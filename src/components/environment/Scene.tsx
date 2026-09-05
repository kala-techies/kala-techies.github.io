import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import {
  Z,
  ZONE_IDS,
  activeZoneAtProgress,
  boundaryBlend,
  cameraZAtProgress,
  localProgress,
  revealBlend,
  withinZone,
  zoneBoundary,
} from "./zones";
import { BEAT_META, BEAT_ORDER, DEBUG_3D, beatSamples, overlayState, recordBeat, type BeatReading } from "../../lib/debug3d";

// How far ahead of the camera a single-hero "climax" scene (one that
// transforms based on local scroll progress, rather than being staggered
// across several meters like Pipeline/Kubernetes/Network) keeps itself.
// These scenes track the camera's own z each frame instead of sitting at
// a fixed world z, so they can't be outrun mid-zone the way a static
// placement could.
const HERO_LEAD = 9;

const CYAN = "#4fd1ff";
const AZURE = "#3b82f6";
const VIOLET = "#8b7cf6";
const AMBER = "#f5b642";
const RED = "#e05a5a";
const SLATE = "#5b607a";
const GREEN = "#5fe0a0";

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/* -------------------------------- SHARED -------------------------------- */

function ForegroundGlass({ camGroupRef }: { camGroupRef: RefObject<THREE.Group | null> }) {
  const edgeGeo = useMemo(() => {
    const w = 2.6;
    const h = 1.5;
    const pts: THREE.Vector3Tuple[] = [
      [-w / 2, -h / 2, 0], [w / 2, -h / 2, 0],
      [w / 2, -h / 2, 0], [w / 2, h / 2, 0],
      [w / 2, h / 2, 0], [-w / 2, h / 2, 0],
      [-w / 2, h / 2, 0], [-w / 2, -h / 2, 0],
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts.flat()), 3));
    return geo;
  }, []);

  return (
    <group ref={camGroupRef}>
      <mesh rotation={[0.08, 0, 0]}>
        <planeGeometry args={[2.6, 1.5]} />
        <meshPhysicalMaterial color="#dbeeff" transparent opacity={0.09} roughness={0.06} metalness={0.05} clearcoat={1} clearcoatRoughness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgeGeo} rotation={[0.08, 0, 0]}>
        <lineBasicMaterial color="#eaf6ff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// Camera flourishes tied to specific zone boundaries — not new zones,
// just moments where the camera itself does something other than dolly
// forward, so the journey reads as exploring architecture rather than a
// single z-axis conveyor.
const AKS_REVEAL_BOUNDARY = zoneBoundary("aks");
const PRODUCTION_LEAN_BOUNDARY = zoneBoundary("production");
const AUTOMATION_ARRIVE_BOUNDARY = zoneBoundary("automation");
const IDENTITY_END_BOUNDARY = zoneBoundary("pipeline");
const IDENTITY_PARK_Z = 12; // ZONE_Z[0] — held fixed through the opening dialogue

// The bike stays parked through the "hop on" dialogue and only pulls
// away once the engine starts, in the last quarter of the identity
// zone's own local progress — the normal zone-to-zone dolly (used for
// every other zone, already measured safe with the runtime diagnostic)
// resumes exactly at the identity/pipeline boundary, so there's no jump
// at the handoff.
function openingAwareCameraZ(progress: number): number {
  if (progress > IDENTITY_END_BOUNDARY) return cameraZAtProgress(progress);
  const t = localProgress(progress, "identity");
  const accelerate = smoothstep((t - 0.75) / 0.25);
  return THREE.MathUtils.lerp(IDENTITY_PARK_Z, cameraZAtProgress(IDENTITY_END_BOUNDARY), accelerate);
}

function Rig({
  progressRef,
  glassRef,
  bikeRef,
}: {
  progressRef: ScrollProgressRef;
  glassRef: RefObject<THREE.Group | null>;
  bikeRef: RefObject<THREE.Group | null>;
}) {
  const lightsRef = useRef<THREE.Group>(null);
  const forwardScratch = useMemo(() => new THREE.Vector3(), []);
  const deltaScratch = useMemo(() => new THREE.Vector3(), []);
  const lastDiagLog = useRef(0);
  const prevProgress = useRef(0);
  const smoothedVelocity = useRef(0);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const reveal = revealBlend(progress);

    // The camera as a physical vehicle: how fast the visitor is moving
    // through the world right now, smoothed so a single scroll tick
    // doesn't read as a jolt. Drives a subtle nose-down pitch on
    // acceleration and nose-up settle on deceleration/stop — this is the
    // "throttle" feel, not just camera.position.z += scroll.
    const rawVelocity = (progress - prevProgress.current) / Math.max(delta, 1 / 240);
    prevProgress.current = progress;
    smoothedVelocity.current = THREE.MathUtils.damp(smoothedVelocity.current, rawVelocity, 4, delta);
    const pitch = THREE.MathUtils.clamp(smoothedVelocity.current * 26, -0.8, 0.8);

    // Kubernetes -> AKS: the camera pulls back and rises, so the cluster is
    // revealed to be inside a larger Azure envelope rather than the scene
    // simply changing underneath an unmoved camera.
    const aksReveal = boundaryBlend(progress, AKS_REVEAL_BOUNDARY, 0.05);
    // Monitoring -> Production: the camera leans in and dips slightly,
    // following the alert signal into the incident.
    const productionLean = boundaryBlend(progress, PRODUCTION_LEAN_BOUNDARY, 0.03);
    // Service Bus -> Automation: a small downward glance at the clutter
    // arriving to be cleaned up.
    const automationArrive = boundaryBlend(progress, AUTOMATION_ARRIVE_BOUNDARY, 0.025);

    // A slow, continuous lateral/vertical drift independent of the mouse —
    // cinematic movement that isn't only camera.position.z += scroll, and
    // keeps working on touch devices with no pointer at all.
    const lateralDrift = Math.sin(progress * 46) * 0.34;
    const verticalDrift = Math.sin(progress * 29 + 1.4) * 0.2;

    const baseX = pointer.x * 0.6 + lateralDrift;
    const baseY = 1.4 + pointer.y * 0.25 + verticalDrift;

    // Reveal-zone modifier: crane the camera up and pivot the look target
    // from "ahead" to "behind" — the visitor has just built everything in
    // the corridor they came from, so the reveal looks back down it rather
    // than continuing to look into the still-empty road ahead (which only
    // holds text zones).
    const targetX = baseX;
    const targetY = baseY + reveal * 24 + aksReveal * 6.5;
    const targetZ = openingAwareCameraZ(progress) + aksReveal * 7.5 - productionLean * 2.2;
    const lookAheadBase = 15;
    const lookBehindDistance = 76;
    const lookZOffset = THREE.MathUtils.lerp(-lookAheadBase, lookBehindDistance, reveal);
    const lookY = -0.5 - reveal * 10 - automationArrive * 1.4 - productionLean * 0.6 - pitch;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.2, delta);

    // A gentle bank during the two biggest reveals, plus a continuous
    // subtle lean into the lateral drift — banking into the turn rather
    // than holding the horizon perfectly level, like a bike actually
    // would. Resets to upright the instant a blend fades since it's all
    // recomputed fresh every frame.
    const steerLean = -lateralDrift * 0.14;
    const roll = aksReveal * 0.1 + reveal * 0.05 + steerLean;
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(targetX * 0.4, lookY, targetZ + lookZOffset);

    // The bike + rider sit fixed relative to the camera's own facing —
    // the visitor's POV from the pillion seat, looking over the rider's
    // shoulder at the road. Using the camera's own quaternion (already
    // carrying the bank above) rather than hand-tracking basis vectors
    // keeps this correct through every camera flourish for free.
    //
    // "Hop on": the visitor starts a little further back — not yet
    // seated — and settles into the normal riding distance right as that
    // line lands, rather than simply always sitting in the final spot.
    const openingTForSeat = localProgress(progress, "identity");
    const seatSettle = smoothstep((openingTForSeat - 0.35) / 0.25);
    const seatOffset = THREE.MathUtils.lerp(-3.05, -2.6, seatSettle);
    if (bikeRef.current) {
      bikeRef.current.position.copy(camera.position);
      bikeRef.current.quaternion.copy(camera.quaternion);
      bikeRef.current.translateZ(seatOffset);
      bikeRef.current.translateY(-1.1);
    }

    // Runtime diagnostic (?debug3d=1 only): measure, don't re-derive.
    // camera.getWorldDirection() reads the camera's actual forward vector
    // after lookAt, and each beat's world position is read straight off
    // its real Object3D (via recordBeat in that scene's own useFrame) —
    // no hand-approximated frustum math, the real transforms three.js is
    // already using to render the frame.
    if (DEBUG_3D && state.clock.elapsedTime - lastDiagLog.current > 0.4) {
      lastDiagLog.current = state.clock.elapsedTime;
      camera.getWorldDirection(forwardScratch);
      const zoneIndex = activeZoneAtProgress(progress);
      const zoneId = ZONE_IDS[zoneIndex];
      const perspCamera = camera as THREE.PerspectiveCamera;
      const halfVFov = THREE.MathUtils.degToRad(perspCamera.fov / 2);
      const halfHFov = Math.atan(Math.tan(halfVFov) * perspCamera.aspect);
      const fovLimitDeg = THREE.MathUtils.radToDeg(Math.max(halfVFov, halfHFov)) * 1.15;

      const readings: BeatReading[] = [];
      for (const id of BEAT_ORDER) {
        const sample = beatSamples[id];
        const meta = BEAT_META[id];
        if (!sample) continue;
        deltaScratch.copy(sample.worldPos).sub(camera.position);
        const distance = deltaScratch.length();
        const dot = distance > 0 ? deltaScratch.dot(forwardScratch) / distance : 0;
        const angleDeg = THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(dot, -1, 1)));
        readings.push({
          id,
          label: meta.label,
          zone: meta.zone,
          zoneLocalProgress: sample.zoneLocalProgress,
          triggerProgress: meta.triggerProgress,
          peakProgress: meta.peakProgress,
          atPeak: Math.abs(sample.zoneLocalProgress - meta.peakProgress) < 0.05,
          distance,
          dot,
          angleDeg,
          front: dot > 0,
          withinFov: angleDeg < fovLimitDeg,
        });
      }

      const lines = [
        `zone: ${zoneId}  (progress ${progress.toFixed(3)})`,
        `camera pos: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`,
        `camera fwd: (${forwardScratch.x.toFixed(2)}, ${forwardScratch.y.toFixed(2)}, ${forwardScratch.z.toFixed(2)})`,
        "",
        ...readings.map((r) => {
          const flag = r.atPeak ? (r.front && r.withinFov ? "PEAK OK" : "PEAK FAIL") : "";
          return `${r.label.padEnd(30)} d=${r.distance.toFixed(1).padStart(5)}  angle=${r.angleDeg.toFixed(0).padStart(3)}°  ${r.front ? "FRONT " : "BEHIND"}  ${r.withinFov ? "in-fov" : "off-fov"}  loc=${r.zoneLocalProgress.toFixed(2)}  ${flag}`;
        }),
      ];
      overlayState.lines = lines;
      // eslint-disable-next-line no-console
      console.log("[debug3d]\n" + lines.join("\n"));
    }

    if (lightsRef.current) lightsRef.current.position.copy(camera.position);

    if (glassRef.current) {
      const glassOpacityScale = 1 - reveal;
      glassRef.current.position.set(camera.position.x * 0.9, camera.position.y - 0.2, camera.position.z - 5);
      glassRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
      glassRef.current.scale.setScalar(Math.max(0.001, glassOpacityScale));
    }
  });

  return (
    <group ref={lightsRef}>
      <pointLight position={[3, 4, 4]} intensity={45} color="#eaf6ff" />
      <pointLight position={[-4, 1, -3]} intensity={22} color={CYAN} />
    </group>
  );
}

// The visitor's vehicle, not a gimmick: this is what makes the journey
// read as "I'm riding somewhere" instead of "the camera is dollying past
// scenes." Deliberately abstract/low-poly, matching the rest of the
// scene's geometric language rather than attempting a realistic model.
// Parked and facing the visitor during the opening ritual; once the
// engine starts, the rider turns forward and stays that way until the
// very end, when they turn back one last time before the closing lines.
// Coarse "what's worth looking at" direction per zone — not a precise
// per-object targeting system, but enough that the rider's attention
// visibly shifts toward where each zone's hero content actually sits
// (Kubernetes' 4th node and AKS's 3rd pool both land to the right;
// Security's gate-then-vault sequence starts to the left), so the ride
// reads as being guided rather than just moved through.
const ZONE_INTEREST_LEAN: Partial<Record<string, number>> = {
  pipeline: -0.4,
  kubernetes: 0.6,
  aks: 0.6,
  network: 0.4,
  security: -0.6,
  automation: 0.6,
  production: 0.6,
};

function BikeRider({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const riderRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const armRefs = useRef<(THREE.Mesh | null)[]>([]);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const rearWheelRef = useRef<THREE.Mesh>(null);
  const headlightMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const vibrateRef = useRef<THREE.Group>(null);
  const leanSmoothed = useRef(0);
  const prevProgress = useRef(0);
  const smoothedVelocity = useRef(0);

  useFrame((state, delta) => {
    const progress = progressRef.current;
    const openingT = localProgress(progress, "identity");
    const connectT = localProgress(progress, "connect");

    // A short beat of stillness before anything happens, then a small
    // cascade of distinct actions rather than everything snapping at
    // once: turn to face forward, hands settle onto the bars, engine
    // catches, then (via openingAwareCameraZ, elsewhere) we accelerate.
    const turnForward = smoothstep((openingT - 0.75) / 0.1);
    const handsReady = smoothstep((openingT - 0.82) / 0.08);
    const engineOn = smoothstep((openingT - 0.85) / 0.1);
    // a subtle gesture toward the seat right on "Hop on."
    const hopGesture = Math.max(0, 1 - Math.abs(openingT - 0.45) / 0.12);

    const lookBackOpening = 1 - turnForward;
    const lookBackEnd = smoothstep((connectT - 0.5) / 0.4);
    const lookBack = Math.max(lookBackOpening, lookBackEnd);

    // once riding, a coarse lean toward whatever this zone's hero content
    // actually is — not applied at all while facing the visitor, so it
    // never fights the opening/ending "look back" beats
    const zoneId = ZONE_IDS[activeZoneAtProgress(progress)];
    const interestTarget = ZONE_INTEREST_LEAN[zoneId] ?? 0;
    leanSmoothed.current = THREE.MathUtils.damp(leanSmoothed.current, interestTarget, 1.2, delta);

    if (riderRef.current) {
      riderRef.current.rotation.y = THREE.MathUtils.lerp(leanSmoothed.current * 0.3, Math.PI, lookBack);
    }
    if (headlightMatRef.current) headlightMatRef.current.opacity = 0.12 + engineOn * 0.85;

    // acceleration/braking posture — smoothed scroll velocity, same
    // formula as the camera's own throttle feel, computed independently
    // here rather than threaded through a prop
    const rawVelocity = (progress - prevProgress.current) / Math.max(delta, 1 / 240);
    prevProgress.current = progress;
    smoothedVelocity.current = THREE.MathUtils.damp(smoothedVelocity.current, rawVelocity, 4, delta);
    const brakingLean = THREE.MathUtils.clamp(smoothedVelocity.current * 30, -0.12, 0.12);
    if (torsoRef.current) torsoRef.current.rotation.x = 0.25 - brakingLean;

    // the "hop on" gesture: one arm lifts briefly, independent of the
    // handlebar-ready pose that follows once the engine starts
    const armLift = hopGesture * (1 - handsReady) * 0.7;
    armRefs.current.forEach((arm, i) => {
      if (!arm) return;
      const side = i === 0 ? 1 : -1;
      arm.rotation.z = side * armLift;
      arm.rotation.x = THREE.MathUtils.lerp(0.5, 0.9, handsReady);
    });

    if (!reducedMotion && engineOn > 0.3) {
      frontWheelRef.current?.rotateX(delta * 6);
      rearWheelRef.current?.rotateX(delta * 6);
    }

    // a faint idle vibration once the engine has caught, on the visual
    // geometry only — never on the camera-tracked outer group, so it
    // can't perturb any beat's measured position
    if (vibrateRef.current) {
      if (!reducedMotion && engineOn > 0.05) {
        const t = state.clock.elapsedTime;
        vibrateRef.current.position.set(Math.sin(t * 47) * 0.004 * engineOn, Math.sin(t * 61 + 1) * 0.003 * engineOn, 0);
      } else {
        vibrateRef.current.position.set(0, 0, 0);
      }
    }
  });

  return (
    <group>
      {/* settling into the seat happens as a camera offset (see Rig) —
          the geometry itself just idles until the engine cascade begins */}
      <group ref={vibrateRef}>
        {/* frame */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.34, 0.3, 1.5]} />
          <meshStandardMaterial color="#111826" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* seat */}
        <mesh position={[0, 0.2, 0.35]}>
          <boxGeometry args={[0.32, 0.1, 0.55]} />
          <meshStandardMaterial color="#1c2230" roughness={0.7} />
        </mesh>
        {/* wheels */}
        <mesh ref={frontWheelRef} position={[0, -0.35, -0.95]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.32, 0.07, 10, 24]} />
          <meshStandardMaterial color="#05070d" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh ref={rearWheelRef} position={[0, -0.35, 0.75]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.34, 0.08, 10, 24]} />
          <meshStandardMaterial color="#05070d" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* handlebar */}
        <mesh position={[0, 0.15, -0.75]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#2c3347" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* headlight — dim until the engine starts */}
        <mesh position={[0, 0, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.09, 16]} />
          <meshBasicMaterial ref={headlightMatRef} color="#eaf6ff" transparent opacity={0.12} />
        </mesh>

        {/* rider */}
        <group ref={riderRef} position={[0, 0.55, 0.15]}>
          <mesh ref={torsoRef} position={[0, 0.15, 0]} rotation={[0.25, 0, 0]}>
            <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
            <meshStandardMaterial color="#161b26" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.52, -0.08]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#0d1017" roughness={0.4} metalness={0.3} />
          </mesh>
          {/* visor — on the forward-facing side, so turning to face the
              camera is visually obvious even on abstract geometry */}
          <mesh position={[0, 0.53, -0.2]}>
            <boxGeometry args={[0.16, 0.07, 0.04]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
          </mesh>
          {[-0.16, 0.16].map((x, i) => (
            <mesh key={i} ref={(el) => { armRefs.current[i] = el; }} position={[x, 0.28, -0.35]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
              <meshStandardMaterial color="#161b26" roughness={0.6} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

function Connections({ segments, color = "#2c3347", opacity = 0.5 }: { segments: [THREE.Vector3Tuple, THREE.Vector3Tuple][]; color?: string; opacity?: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], i) => positions.set([...a, ...b], i * 6));
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [segments]);
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

function FlowPath({
  points, count = 10, color = CYAN, speed = 0.12, size = 0.055, offset = 0, reducedMotion = false,
}: {
  points: THREE.Vector3Tuple[]; count?: number; color?: string; speed?: number; size?: number; offset?: number; reducedMotion?: boolean;
}) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t0 = (reducedMotion ? 0 : state.clock.elapsedTime * speed) + offset;
    for (let i = 0; i < count; i++) {
      const t = (t0 + i / count) % 1;
      const pos = curve.getPointAt(t < 0 ? t + 1 : t);
      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
    </instancedMesh>
  );
}

/* ---------------------------- SCENE 02: PIPELINE ------------------------- */
// CODE -> BUILD -> CONTAINER -> REGISTRY -> MULTIPLY. The multiply beat, in
// the back third of the zone, splits the single container into three and
// carries them toward the exact x-positions Kubernetes' first three nodes
// occupy — so crossing into the next zone reads as the containers arriving
// and becoming workloads, not one diorama ending and another beginning.

const HANDOFF_NODE_X = [-3.2, 0, 3.2];

function PipelineScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const buildRef = useRef<THREE.Group>(null);
  const multiplyRef = useRef<THREE.InstancedMesh>(null);
  const containerRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const debugScratch = useMemo(() => new THREE.Vector3(), []);
  // Terraform: infrastructure drawing itself into what was, a moment ago,
  // an empty stretch of the same road — not a separate scene, the camera
  // never stops moving for this. Each piece is positioned deep enough
  // (local z beyond -6.6) that its own growth window finishes well
  // before the camera reaches that depth — same "stay ahead of the
  // camera" rule proven for every other late-triggering beat this
  // session, just applied to scenery instead of a single hero object.
  const tfComputeRef = useRef<THREE.Group>(null);
  const tfStorageRef = useRef<THREE.Group>(null);
  const tfNetRef = useRef<THREE.Group>(null);
  const tfSubnetRef = useRef<THREE.Group>(null);
  const azureEnvelopeRef = useRef<THREE.Mesh>(null);
  const azureEnvelopeMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const buildFragments = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return [Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0] as THREE.Vector3Tuple;
      }),
    []
  );

  useFrame((_, delta) => {
    if (buildRef.current && !reducedMotion) buildRef.current.rotation.y += delta * 0.4;

    const t = localProgress(progressRef.current, "pipeline");
    // Measured with the runtime diagnostic (?debug3d=1): the camera
    // reaches this beat's target world-z (local -6.2, i.e. world -0.2) at
    // local progress 0.517 — completing the animation at 0.65, as the
    // previous "conservative" retiming did, finishes it AFTER the camera
    // has already passed it (confirmed: BEHIND, 138° off-axis). Completing
    // by 0.35 leaves a real margin before the 0.517 pass-point.
    const eased = smoothstep((t - 0.1) / 0.25);

    if (containerRef.current) {
      // the original container fades as its copies take over the frame
      containerRef.current.scale.setScalar(1 - eased * 0.35);
    }

    if (multiplyRef.current) {
      for (let i = 0; i < HANDOFF_NODE_X.length; i++) {
        dummy.position.set(
          THREE.MathUtils.lerp(0, HANDOFF_NODE_X[i], eased),
          THREE.MathUtils.lerp(0, -0.1, eased),
          THREE.MathUtils.lerp(-0.3, -6.2, eased)
        );
        dummy.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, Math.min(1, eased * 1.7)));
        dummy.updateMatrix();
        multiplyRef.current.setMatrixAt(i, dummy.matrix);
      }
      multiplyRef.current.instanceMatrix.needsUpdate = true;

      if (DEBUG_3D) {
        // the center instance (x=0) is a representative sample of where
        // the multiply beat actually is at this moment
        debugScratch.set(0, THREE.MathUtils.lerp(0, -0.1, eased), THREE.MathUtils.lerp(-0.3, -6.2, eased));
        multiplyRef.current.updateMatrixWorld(true);
        multiplyRef.current.localToWorld(debugScratch);
        recordBeat("pipelineMultiply", debugScratch, t);
      }
    }

    // Terraform / Azure: a staggered materialize-in, each piece finishing
    // its own growth before the camera reaches it.
    const computeGrow = smoothstep((t - 0.45) / 0.13);
    const storageGrow = smoothstep((t - 0.55) / 0.13);
    const netGrow = smoothstep((t - 0.65) / 0.13);
    const subnetGrow = smoothstep((t - 0.72) / 0.13);
    const azureGrow = smoothstep((t - 0.75) / 0.17);

    if (tfComputeRef.current) tfComputeRef.current.scale.setScalar(Math.max(0.001, computeGrow));
    if (tfStorageRef.current) tfStorageRef.current.scale.setScalar(Math.max(0.001, storageGrow));
    if (tfNetRef.current) tfNetRef.current.scale.setScalar(Math.max(0.001, netGrow));
    if (tfSubnetRef.current) tfSubnetRef.current.scale.setScalar(Math.max(0.001, subnetGrow));
    if (azureEnvelopeRef.current) azureEnvelopeRef.current.scale.setScalar(Math.max(0.001, azureGrow));
    if (azureEnvelopeMatRef.current) azureEnvelopeMatRef.current.opacity = azureGrow * 0.26;
  });

  return (
    <group position={[0, 0.2, Z.pipeline]}>
      {/* CODE — a thin stream of particles flowing toward the build stage */}
      <FlowPath points={[[0, 0, 5], [0.15, 0.1, 3.6], [0, 0, 2.2]]} count={8} speed={0.35} color={CYAN} size={0.04} reducedMotion={reducedMotion} />

      {/* GIT — two branches converging into the main line before it
          reaches the build stage. No logo; the merge itself is the idea. */}
      <FlowPath points={[[-0.85, 0.08, 5.3], [-0.45, 0.08, 4.1], [0, 0.05, 2.6]]} count={4} speed={0.3} color={AZURE} size={0.035} offset={0.15} reducedMotion={reducedMotion} />
      <FlowPath points={[[0.85, 0.08, 5.3], [0.45, 0.08, 4.1], [0, 0.05, 2.6]]} count={4} speed={0.3} color={VIOLET} size={0.035} offset={0.4} reducedMotion={reducedMotion} />

      {/* BUILD — a physical processing chamber the fragments assemble inside,
          not fragments floating in open space */}
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.5, 24, 1, true]} />
        <meshStandardMaterial color={AZURE} wireframe transparent opacity={0.3} />
      </mesh>
      <group ref={buildRef} position={[0, 0, 1.4]}>
        {buildFragments.map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* CONTAINER — a solid container box, the fragments' resolved form */}
      <mesh ref={containerRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.3, 0.7, 0.7]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.34, 0.05, 0.74]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.3} />
      </mesh>

      {/* REGISTRY — storage towers off to the side */}
      {[-2.2, -1.6].map((x, i) => (
        <mesh key={i} position={[x, -0.1, -1.2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.9 + i * 0.3, 12]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} />
        </mesh>
      ))}
      <Connections segments={[[[0, 0, 0], [-1.9, -0.1, -1.2]]]} color={VIOLET} opacity={0.4} />

      {/* MULTIPLY — the container becomes three, seeding Kubernetes ahead */}
      <instancedMesh ref={multiplyRef} args={[undefined, undefined, HANDOFF_NODE_X.length]}>
        <boxGeometry args={[0.5, 0.34, 0.34]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.55} roughness={0.4} metalness={0.3} />
      </instancedMesh>

      {/* DEPLOY — a thin stream continuing toward where the copies land */}
      <FlowPath points={[[0, 0, -0.4], [0, 0, -3], [0, 0, -6]]} count={5} speed={0.22} color={CYAN} size={0.05} offset={0.4} reducedMotion={reducedMotion} />

      {/* TERRAFORM — the deploy stream doesn't land on a pre-existing
          server; it enters an empty stretch of road, and infrastructure
          draws itself in around it. */}
      <group ref={tfComputeRef} position={[-2.4, -0.15, -7]} scale={0.001}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.35} roughness={0.4} metalness={0.4} />
        </mesh>
      </group>
      <group ref={tfStorageRef} position={[2.3, -0.1, -8.5]} scale={0.001}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.4, 0.9, 16]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>
      <group ref={tfNetRef} position={[0, 0.1, -10]} scale={0.001}>
        <mesh>
          <boxGeometry args={[4.4, 1.6, 2.6]} />
          <meshStandardMaterial color={CYAN} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={tfSubnetRef} position={[-1.3, 0, -11]} scale={0.001}>
        <mesh>
          <boxGeometry args={[1.6, 1, 1.2]} />
          <meshStandardMaterial color={CYAN} wireframe transparent opacity={0.5} />
        </mesh>
      </group>

      {/* AZURE — the boundary this infrastructure has been forming
          inside all along. Positioned deep enough (local z -13) that the
          camera never reaches it within this zone at all — it stays
          "just ahead" through the handoff into Kubernetes. */}
      <mesh ref={azureEnvelopeRef} position={[0, 0.3, -13]} scale={0.001}>
        <boxGeometry args={[10, 4, 6]} />
        <meshStandardMaterial ref={azureEnvelopeMatRef} color={AZURE} wireframe transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* -------------------------- SCENE 03: KUBERNETES -------------------------- */
// The three containers that just multiplied in from Pipeline arrive here as
// three nodes, each carrying pods. Pods restart on their own — a constant,
// ambient "this cluster is alive" motion independent of scroll — and a
// fourth node scales in as the visitor moves through the back half.

function KubernetesScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const nodeX = [...HANDOFF_NODE_X, 5.6];
  const podOffsets: [number, number][] = [[-0.4, -0.4], [0.4, -0.4], [0, 0.4]];

  const podMeshRef = useRef<THREE.InstancedMesh>(null);
  const scaleNodeRef = useRef<THREE.Group>(null);
  const scaleMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const serviceRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const kubeDebugScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (serviceRef.current && !reducedMotion) serviceRef.current.rotation.z += delta * 0.12;

    // Scale the cluster out (a 4th node fades in) as the visitor moves
    // through this zone — AKS node-pool scaling, made physical rather
    // than described. Measured with ?debug3d=1: even with -9 local z
    // depth, completing at 0.5 landed inside the Kubernetes->AKS reveal
    // camera bump's ramp window (that flourish starts 0.05 before the
    // AKS boundary, which falls at kubernetes-zone-local 0.44) - the
    // camera rising/pulling back for that reveal is what pushed this
    // beat off-fov, not its own position. Completing by 0.3 lands well
    // before the reveal bump engages.
    const t = localProgress(progressRef.current, "kubernetes");
    const scaleIn = Math.max(0, Math.min(1, (t - 0.05) / 0.25));
    if (scaleNodeRef.current) scaleNodeRef.current.scale.setScalar(scaleIn);
    if (scaleMatRef.current) scaleMatRef.current.opacity = scaleIn;

    if (DEBUG_3D && scaleNodeRef.current) {
      scaleNodeRef.current.updateMatrixWorld(true);
      recordBeat("kubernetesFourthNode", scaleNodeRef.current.getWorldPosition(kubeDebugScratch), t);
    }

    if (!podMeshRef.current) return;
    const elapsed = reducedMotion ? 0 : state.clock.elapsedTime;
    let i = 0;
    for (const nx of nodeX.slice(0, 3)) {
      for (const [ox, oz] of podOffsets) {
        // an ambient "restart" pulse — a pod occasionally dips and recovers,
        // independent of scroll, so the cluster reads as alive even at rest
        const cycle = (elapsed * 0.12 + i * 0.41) % 1;
        const dip = Math.max(0, 1 - Math.pow((cycle - 0.94) * 22, 2));
        const scale = 1 - dip * 0.85;
        dummy.position.set(nx + ox, 0.7, oz);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        podMeshRef.current.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    podMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const flowCurves = nodeX.slice(0, 3).map((nx) => [
    [0, 0.1, 5] as THREE.Vector3Tuple,
    [nx * 0.5, 0.1, 2.5] as THREE.Vector3Tuple,
    [nx, 0.4, 0] as THREE.Vector3Tuple,
  ]);

  return (
    <group position={[0, 0, Z.kubernetes]}>
      {nodeX.slice(0, 3).map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.78, 0.6, 24]} />
          <meshStandardMaterial color="#111826" emissive={CYAN} emissiveIntensity={0.2} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* the scaling node — invisible until scroll progress inside this
          zone crosses the threshold, then grows in */}
      <group ref={scaleNodeRef} position={[nodeX[3], 0.1, -9]} scale={0}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.78, 0.6, 24]} />
          <meshStandardMaterial ref={scaleMatRef} color="#111826" emissive={AMBER} emissiveIntensity={0.3} transparent opacity={0} roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      <instancedMesh ref={podMeshRef} args={[undefined, undefined, 9]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} />
      </instancedMesh>

      {/* services — a flat ring spanning the node row */}
      <mesh ref={serviceRef} position={[1.2, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.02, 8, 64]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.4} transparent opacity={0.4} />
      </mesh>

      {/* ingress */}
      <mesh position={[0, 0.2, 5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.08, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>

      {flowCurves.map((pts, i) => (
        <FlowPath key={i} points={pts} count={7} speed={0.28} offset={i * 0.3} color={CYAN} size={0.07} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}

/* ------------------------------- SCENE 04: AKS ----------------------------- */
// The camera pulls back and the cluster is revealed to be sitting inside an
// Azure boundary. Two node pools are already visible; a third scales in and
// workloads visibly redistribute across all three — scaling, made physical.

const AKS_POOL_X = [-3, 0, 3];
const AKS_POOL_C_Z = -6;

function AksScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const poolCRef = useRef<THREE.Group>(null);
  const poolMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const workloadRef = useRef<THREE.InstancedMesh>(null);
  const envelopeRef = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const aksDebugScratch = useMemo(() => new THREE.Vector3(), []);
  const workloadCount = 9;

  useFrame((_, delta) => {
    if (envelopeRef.current && !reducedMotion) envelopeRef.current.rotation.y += delta * 0.03;

    // Measured with ?debug3d=1: pool C at the zone's own start anchor was
    // BEHIND the camera by 142deg at its old 0.65 completion point — the
    // camera reaches that world-z at local progress 0. Its own -6 local z
    // offset (see JSX below) pushes the real pass-point to local progress
    // 0.6; completing by 0.4 leaves real margin before that.
    const t = localProgress(progressRef.current, "aks");
    const scaleIn = smoothstep((t - 0.1) / 0.3);
    if (poolCRef.current) poolCRef.current.scale.setScalar(scaleIn);
    if (poolMatRef.current) poolMatRef.current.opacity = scaleIn * 0.9;

    if (DEBUG_3D && poolCRef.current) {
      poolCRef.current.updateMatrixWorld(true);
      recordBeat("aksNodePool", poolCRef.current.getWorldPosition(aksDebugScratch), t);
    }

    if (workloadRef.current) {
      const activePools = scaleIn > 0.5 ? 3 : 2;
      for (let i = 0; i < workloadCount; i++) {
        const poolIdx = i % activePools;
        const within = Math.floor(i / activePools) - 1;
        const poolZ = poolIdx === 2 ? AKS_POOL_C_Z : 0;
        dummy.position.set(AKS_POOL_X[poolIdx] + within * 0.34, 1.05, poolZ + within * 0.3);
        dummy.updateMatrix();
        workloadRef.current.setMatrixAt(i, dummy.matrix);
      }
      workloadRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, Z.aks]}>
      {/* the Azure boundary the cluster has been sitting inside all along */}
      <mesh ref={envelopeRef}>
        <boxGeometry args={[9, 3, 4]} />
        <meshStandardMaterial color={AZURE} wireframe transparent opacity={0.28} />
      </mesh>

      {[AKS_POOL_X[0], AKS_POOL_X[1]].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          {[0, 1].map((i) => (
            <mesh key={i} position={[(i - 0.5) * 0.7, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.46, 0.5, 16]} />
              <meshStandardMaterial color="#111826" emissive={CYAN} emissiveIntensity={0.25} roughness={0.5} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ))}

      {/* node pool C — 2 pools become 3 mid-zone. Offset -6 in z (past
          this zone's own start anchor) so the camera doesn't reach its
          world position until local progress 0.6, giving the scale-in
          room to complete while still in front of the camera — measured
          with ?debug3d=1, its old z=0 placement was behind by local
          progress 0 (see AKS_POOL_C_Z below). */}
      <group ref={poolCRef} position={[AKS_POOL_X[2], 0, AKS_POOL_C_Z]} scale={0}>
        <mesh position={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.46, 0.5, 16]} />
          <meshStandardMaterial ref={poolMatRef} color="#111826" emissive={AMBER} emissiveIntensity={0.35} transparent opacity={0} roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.46, 0.5, 16]} />
          <meshStandardMaterial color="#111826" emissive={AMBER} emissiveIntensity={0.35} roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      <instancedMesh ref={workloadRef} args={[undefined, undefined, workloadCount]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} />
      </instancedMesh>

      <Connections
        segments={[
          [[AKS_POOL_X[0], 0, 0], [AKS_POOL_X[1], 0, 0]],
          [[AKS_POOL_X[1], 0, 0], [AKS_POOL_X[2], 0, AKS_POOL_C_Z]],
        ]}
        color={AZURE}
        opacity={0.35}
      />
    </group>
  );
}

/* ---------------------------- SCENE 05: NETWORK --------------------------- */
// Traffic reaches the NSG gate and splits: most continues through the
// private endpoint, some is visibly diverted and never arrives.

// Measured with ?debug3d=1: at this scene's old anchor (the zone's own
// start Z, matching every element's local z=0), the camera reached that
// world position at local progress 0 — the whole scene, NSG included,
// was already behind the camera for nearly this entire zone (confirmed:
// BEHIND, 153deg off-axis at local progress 0.5). Pushing the whole
// group 5 units deeper moves the real pass-point out to local progress
// 0.5, so the traffic split is in front of the camera for the front
// half of the zone instead of almost none of it.
const NETWORK_Z_OFFSET = -5;

function NetworkScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const nsgScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (DEBUG_3D && groupRef.current) {
      groupRef.current.updateMatrixWorld(true);
      nsgScratch.set(1.7, 0, 0);
      groupRef.current.localToWorld(nsgScratch);
      recordBeat("networkNsgSplit", nsgScratch, localProgress(progressRef.current, "network"));
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, Z.network + NETWORK_Z_OFFSET]}>
      <mesh>
        <boxGeometry args={[5, 2, 3.6]} />
        <meshStandardMaterial color={AZURE} wireframe transparent opacity={0.4} />
      </mesh>
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[2.4, 1.2, 2.2]} />
        <meshStandardMaterial color={CYAN} wireframe transparent opacity={0.55} />
      </mesh>
      <mesh position={[1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.6, 0.06, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[3.1, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} transparent opacity={0.6} />
      </mesh>
      <mesh position={[4.4, 0, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.4} roughness={0.3} metalness={0.5} />
      </mesh>
      {/* accepted traffic — passes the gate, reaches the endpoint */}
      <FlowPath points={[[-2, 0, 0], [-0.4, 0, 0], [1.7, 0, 0], [3.1, 0, 0], [4.4, 0, 0]]} count={6} speed={0.15} color={CYAN} size={0.05} reducedMotion={reducedMotion} />
      {/* rejected traffic — meets the gate and never arrives */}
      <FlowPath points={[[1.5, 0.15, 0], [2, -0.55, 0.35], [2.3, -1.05, 0.55]]} count={3} speed={0.22} color={RED} size={0.045} reducedMotion={reducedMotion} />
    </group>
  );
}

/* --------------------------- SCENE 06: SECURITY ---------------------------- */

function SecurityScene({ reducedMotion }: { reducedMotion: boolean }) {
  const secretsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const secretCount = 6;

  useFrame((state) => {
    if (!secretsRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < secretCount; i++) {
      const angle = t * 0.3 + (i / secretCount) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * 0.9, 0.2 + Math.sin(t + i) * 0.1, Math.sin(angle) * 0.9);
      dummy.updateMatrix();
      secretsRef.current.setMatrixAt(i, dummy.matrix);
    }
    secretsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, Z.security]}>
      {/* the requesting application */}
      <mesh position={[-3.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.3} />
      </mesh>
      {/* an identity/access gate the request must pass */}
      <mesh position={[-1.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.05, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.5} />
      </mesh>
      {/* the vault — the only thing secrets orbit */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 1.1, 20]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.35} roughness={0.4} metalness={0.4} />
      </mesh>
      <instancedMesh ref={secretsRef} args={[undefined, undefined, secretCount]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={1} />
      </instancedMesh>
      {/* the request, only granted past the gate */}
      <FlowPath points={[[-3.2, 0, 0], [-1.6, 0, 0], [0, 0, 0]]} count={3} speed={0.1} color={AMBER} size={0.05} reducedMotion={reducedMotion} />
      {/* the secret, carried back out */}
      <FlowPath points={[[0, 0.15, 0], [-1.6, 0.15, 0], [-3.2, 0.15, 0]]} count={2} speed={0.08} offset={0.5} color={VIOLET} size={0.045} reducedMotion={reducedMotion} />
    </group>
  );
}

/* --------------------------- SCENE 07: SERVICE BUS -------------------------- */

function ServiceBusScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group position={[0, 0, Z.servicebus]}>
      {/* application */}
      <mesh position={[-3.4, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.3} />
      </mesh>
      {/* namespace boundary */}
      <mesh position={[-0.4, 0, 0]}>
        <boxGeometry args={[3.4, 1.4, 1.4]} />
        <meshStandardMaterial color={AZURE} wireframe transparent opacity={0.4} />
      </mesh>
      {/* topic */}
      <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 2.6, 20]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} transparent opacity={0.7} />
      </mesh>
      {/* subscriptions branching off */}
      {[0.6, -0.6].map((y, i) => (
        <mesh key={i} position={[1.4, y, 0]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* consumers */}
      {[0.6, -0.6].map((y, i) => (
        <mesh key={i} position={[2.8, y, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* dead-letter area — a separate, amber-tinted holding zone that
          Automation, next, will be shown clearing out */}
      <mesh position={[1.4, -2, -0.5]}>
        <boxGeometry args={[0.9, 0.6, 0.6]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.3} wireframe />
      </mesh>

      {/* main flow: app → topic → subscriptions → consumers */}
      <FlowPath points={[[-3.4, 0.2, 0], [-0.4, 0, 0], [1.4, 0.6, 0], [2.8, 0.6, 0]]} count={5} speed={0.14} color={CYAN} size={0.05} reducedMotion={reducedMotion} />
      <FlowPath points={[[-3.4, 0.2, 0], [-0.4, 0, 0], [1.4, -0.6, 0], [2.8, -0.6, 0]]} count={5} speed={0.12} offset={0.4} color={CYAN} size={0.05} reducedMotion={reducedMotion} />
      {/* a slower, diverted stream — the messages that don't make it through cleanly */}
      <FlowPath points={[[-0.4, 0, 0], [0.5, -1, -0.3], [1.4, -2, -0.5]]} count={2} speed={0.05} color={RED} size={0.05} reducedMotion={reducedMotion} />
    </group>
  );
}

/* ----------------------------- SCENE 08: AUTOMATION ------------------------ */
// A three-act transformation, all driven by local scroll progress: the
// dead-letter clutter from Service Bus settles into an ordered flow
// (0–0.5), a validation sweep confirms it (0.5–0.75), then a small report
// resolves out of it (0.75–1) — chaos, automation, validation, structured
// output, exactly as described, not summarized.

// Measured with ?debug3d=1: at the zone's own start anchor, the red
// dead-letter callback moment (local progress 0.04) was already behind
// the camera (confirmed: BEHIND, 98deg off-axis, only 1.5 units away —
// the camera passes this anchor almost immediately on entering the
// zone). This scene has three sequential acts sharing the same flat z
// (chaos/order 0-0.5, validation 0.5-0.75, report 0.75-1), so fixing
// only the earliest one isn't enough — a -9 offset pushes the pass-point
// out to local progress 0.75, covering chaos/order and validation with
// margin; the report card additionally sits its own few units deeper
// (see its own position below) to stay ahead through act three too.
const AUTOMATION_Z_OFFSET = -9;

function AutomationScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const count = 9;
  const scatteredMeshRef = useRef<THREE.InstancedMesh>(null);
  const validationRef = useRef<THREE.Mesh>(null);
  const validationMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const reportRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const scattered = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = i * 12.9898;
        const rand = (n: number) => Math.abs(Math.sin(seed + n) * 43758.5453) % 1;
        return new THREE.Vector3(-3.6 + rand(1) * 1.8 - 0.9, -0.3 + rand(2) * 1.5, rand(3) * 2 - 1);
      }),
    []
  );
  const organized = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return new THREE.Vector3(2.6 + col * 0.65, -0.4 + row * 0.65, 0);
      }),
    []
  );
  const rotSeeds = useMemo(() => Array.from({ length: count }, (_, i) => i * 1.7), []);
  // The chaos state starts dead-letter red — these are the same operational
  // clutter Service Bus, just before this zone, showed diverting into a
  // holding area. Automation is what turns that red clutter cyan.
  const deadLetterColor = useMemo(() => new THREE.Color(RED), []);
  const slateColor = useMemo(() => new THREE.Color(SLATE), []);
  const cyanColor = useMemo(() => new THREE.Color(CYAN), []);
  const greenColor = useMemo(() => new THREE.Color(GREEN), []);
  const instanceColor = useMemo(() => new THREE.Color(), []);
  const chaosColor = useMemo(() => new THREE.Color(), []);
  const automationDebugScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = localProgress(progressRef.current, "automation");

    if (DEBUG_3D && scatteredMeshRef.current) {
      scatteredMeshRef.current.updateMatrixWorld(true);
      recordBeat("serviceBusToAutomation", scatteredMeshRef.current.getWorldPosition(automationDebugScratch), t);
    }

    // ACT 1 — CHAOS -> ORDER (0 – 0.5)
    const orderEased = smoothstep(t / 0.5);
    // ACT 2 — VALIDATION sweep (0.5 – 0.75)
    const validationT = Math.max(0, Math.min(1, (t - 0.5) / 0.25));
    // ACT 3 — REPORT resolves (0.75 – 1)
    const reportT = smoothstep((t - 0.75) / 0.25);
    // the red dead-letter tint bleeds into slate very early in the act,
    // well before order sets in — the clutter arrives red, then dulls
    // before it starts organizing
    chaosColor.lerpColors(deadLetterColor, slateColor, smoothstep(t / 0.12));

    if (scatteredMeshRef.current) {
      for (let i = 0; i < count; i++) {
        dummy.position.lerpVectors(scattered[i], organized[i], orderEased);
        // an idle wobble while still unordered — repetitive, manual motion
        // that settles the instant an object organizes
        const wobble = Math.sin(state.clock.elapsedTime * 2.2 + i * 1.9) * 0.5 * (1 - orderEased);
        dummy.rotation.set(rotSeeds[i] * (1 - orderEased) + wobble, rotSeeds[i] * (1 - orderEased) - wobble, 0);
        dummy.updateMatrix();
        // validated cubes flash green as the sweep passes their column
        const col = i % 3;
        const passed = validationT > col / 3;
        instanceColor.lerpColors(chaosColor, passed ? greenColor : cyanColor, orderEased);
        scatteredMeshRef.current.setColorAt(i, instanceColor);
        scatteredMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      scatteredMeshRef.current.instanceMatrix.needsUpdate = true;
      if (scatteredMeshRef.current.instanceColor) scatteredMeshRef.current.instanceColor.needsUpdate = true;
    }

    if (validationRef.current && validationMatRef.current) {
      validationRef.current.position.x = THREE.MathUtils.lerp(2.2, 4.2, validationT);
      validationMatRef.current.opacity = validationT > 0 && validationT < 1 ? 0.85 : 0;
    }

    if (reportRef.current) {
      reportRef.current.scale.setScalar(Math.max(0.001, reportT));
      if (DEBUG_3D) {
        reportRef.current.updateMatrixWorld(true);
        recordBeat("automationReport", reportRef.current.getWorldPosition(automationDebugScratch), t);
      }
    }
  });

  return (
    <group position={[0, 0, Z.automation + AUTOMATION_Z_OFFSET]}>
      <instancedMesh ref={scatteredMeshRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.36, 0.36, 0.36]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
      </instancedMesh>

      {/* the automation gate the objects pass through as they organize */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.9, 0.1, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.7} />
      </mesh>
      <FlowPath points={[[-3.6, 0.2, 0], [-1.2, 0.1, 0.4], [0, 0, 0], [1.4, 0, -0.1], [3.2, 0, 0]]} count={5} speed={0.1} color={AMBER} size={0.065} reducedMotion={reducedMotion} />

      {/* validation — a thin ring sweeping across the organized grid */}
      <mesh ref={validationRef} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.75, 0.02, 8, 32]} />
        <meshBasicMaterial ref={validationMatRef} color={GREEN} transparent opacity={0} />
      </mesh>

      {/* report — a small resolved card, the structured output */}
      <group ref={reportRef} position={[5.1, 0.1, -10]} scale={0.001}>
        <mesh>
          <planeGeometry args={[1.3, 0.9]} />
          <meshPhysicalMaterial color="#0d1420" transparent opacity={0.85} clearcoat={0.6} side={THREE.DoubleSide} />
        </mesh>
        {[0.28, 0.05, -0.18].map((y, i) => (
          <mesh key={i} position={[i === 0 ? -0.15 : 0, y, 0.01]}>
            <planeGeometry args={[i === 0 ? 0.7 : 0.95, 0.07]} />
            <meshBasicMaterial color={i === 0 ? GREEN : "#3a4358"} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --------------------------- SCENE 09: MONITORING --------------------------- */
// An orbiting ring watching the whole system — infrastructure, workloads,
// messaging, network — represented as small nodes in constant motion. In
// the back of the zone, a signal launches ahead into Production: the first
// sign of the incident the visitor is about to walk into.

const MONITOR_NODES = [
  { color: CYAN, r: 1.6, speed: 0.4 },
  { color: VIOLET, r: 1.6, speed: -0.3 },
  { color: AMBER, r: 1.9, speed: 0.25 },
  { color: AZURE, r: 1.3, speed: -0.5 },
];

function MonitoringScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const signalRef = useRef<THREE.Mesh>(null);
  const signalMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const orbitRefs = useRef<(THREE.Mesh | null)[]>([]);
  const monitorDebugScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (ringRef.current && !reducedMotion) ringRef.current.rotation.z += delta * 0.15;

    if (!reducedMotion) {
      MONITOR_NODES.forEach((n, i) => {
        const m = orbitRefs.current[i];
        if (!m) return;
        const a = state.clock.elapsedTime * n.speed + i * 2;
        m.position.set(Math.cos(a) * n.r, Math.sin(a * 0.6) * 0.4, Math.sin(a) * n.r);
      });
    }

    // the first signal of the incident ahead — launches toward Production
    // in the back 40% of this zone and travels far enough to visibly cross
    // into it, fading only once it "arrives" rather than cutting off at
    // this zone's own boundary
    const t = localProgress(progressRef.current, "monitoring");
    const alertT = Math.max(0, Math.min(1, (t - 0.35) / 0.55));
    if (signalRef.current && signalMatRef.current) {
      signalRef.current.position.z = THREE.MathUtils.lerp(0, -9, alertT);
      const fadeIn = smoothstep(alertT / 0.08);
      const fadeOut = 1 - smoothstep((alertT - 0.82) / 0.18);
      signalMatRef.current.opacity = 0.9 * fadeIn * fadeOut;

      if (DEBUG_3D) {
        signalRef.current.updateMatrixWorld(true);
        recordBeat("monitoringSignal", signalRef.current.getWorldPosition(monitorDebugScratch), t);
      }
    }
  });

  return (
    <group position={[0, 0.5, Z.monitoring]}>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#111826" emissive={CYAN} emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2, 0.03, 8, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      {MONITOR_NODES.map((n, i) => (
        <mesh key={i} ref={(el) => { orbitRefs.current[i] = el; }}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <mesh ref={signalRef}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshBasicMaterial ref={signalMatRef} color={AMBER} transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* ------------------------- SCENE 10: PRODUCTION ---------------------------- */

function ProductionScene({ progressRef }: { progressRef: ScrollProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const alertRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const alertMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const productionDebugScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.3;

    // Track a fixed distance ahead of the camera's own position through
    // this zone, rather than sitting at a fixed world z — a static
    // placement gets outrun by the camera partway through the zone and
    // the incident becomes invisible right as it should be climaxing.
    // Only while near this zone, so it doesn't chase the camera for the
    // entire journey and collide with the other tracked hero scenes.
    if (groupRef.current && withinZone(progressRef.current, "production")) {
      groupRef.current.position.z = cameraZAtProgress(progressRef.current) - HERO_LEAD;
    }

    // The incident lifecycle: calm → alert → investigated → remediated →
    // calm again, driven entirely by how far through this zone the
    // visitor has scrolled.
    const t = localProgress(progressRef.current, "production");
    const alertPhase = t > 0.25 && t < 0.75 ? 1 - Math.abs(t - 0.5) / 0.25 : 0;

    if (materialRef.current) {
      const color = alertPhase > 0.4 ? AMBER : CYAN;
      materialRef.current.color.set(color);
      materialRef.current.emissive.set(color);
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04 + alertPhase * 0.15);
    }
    if (alertRingRef.current && alertMatRef.current) {
      const expand = (state.clock.elapsedTime * 0.6) % 1;
      alertRingRef.current.scale.setScalar(1 + expand * 2.5);
      alertMatRef.current.opacity = alertPhase * (1 - expand) * 0.6;
    }

    if (DEBUG_3D && coreRef.current) {
      coreRef.current.updateMatrixWorld(true);
      recordBeat("productionIncident", coreRef.current.getWorldPosition(productionDebugScratch), t);
    }
  });

  return (
    <group ref={groupRef} position={[1.4, 0.2, Z.production]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial ref={materialRef} color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 8, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} transparent opacity={0.65} />
      </mesh>
      {/* expanding alert pulse — only visible during the incident window */}
      <mesh ref={alertRingRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.4, 0.03, 8, 48]} />
        <meshBasicMaterial ref={alertMatRef} color={AMBER} transparent opacity={0} />
      </mesh>
      {/* traffic — an ambient loop past the core, always alive */}
      <FlowPath points={[[-2.6, 0.6, -1], [-0.6, 0.2, 0.6], [0.6, -0.2, -0.6], [2.6, -0.6, 1]]} count={5} speed={0.18} color={CYAN} size={0.05} />
    </group>
  );
}

/* ------------------------------- SCENE 11: DR ------------------------------ */

const DR_PRIMARY_LEAD = 4;
const DR_SECONDARY_LEAD = -5;

function DisasterRecoveryScene({ progressRef }: { progressRef: ScrollProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const primaryMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const secondaryMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const drDebugScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    // Same fixed-lead, own-zone-only tracking as Production — without it,
    // the camera outruns the primary/secondary pair before the failover
    // they're meant to illustrate ever plays out on screen.
    if (groupRef.current && withinZone(progressRef.current, "dr")) {
      groupRef.current.position.z = cameraZAtProgress(progressRef.current) - HERO_LEAD;
    }

    const t = localProgress(progressRef.current, "dr");
    // 0–0.4 primary active, replicating; 0.4–0.6 failover event; 0.6–1
    // secondary active.
    const primaryHealth = t < 0.4 ? 1 : Math.max(0, 1 - (t - 0.4) / 0.2);
    const secondaryHealth = t < 0.4 ? 0.25 : Math.min(1, (t - 0.4) / 0.2);

    if (primaryMatRef.current) primaryMatRef.current.emissiveIntensity = 0.15 + primaryHealth * 0.6;
    if (secondaryMatRef.current) secondaryMatRef.current.emissiveIntensity = 0.1 + secondaryHealth * 0.55;
    if (beamRef.current) {
      const m = beamRef.current.material as THREE.MeshBasicMaterial;
      const failoverPulse = t > 0.35 && t < 0.65 ? 0.5 : 0.2;
      m.opacity = failoverPulse + (Math.sin(state.clock.elapsedTime * 1.5) + 1) * 0.15;
    }

    if (DEBUG_3D && groupRef.current) {
      groupRef.current.updateMatrixWorld(true);
      drDebugScratch.set(0, 0.05, (DR_PRIMARY_LEAD + DR_SECONDARY_LEAD) / 2);
      groupRef.current.localToWorld(drDebugScratch);
      recordBeat("drFailover", drDebugScratch, t);
    }
  });

  const beamMid = (DR_PRIMARY_LEAD + DR_SECONDARY_LEAD) / 2;

  return (
    <group ref={groupRef} position={[0, 0, Z.dr]}>
      <mesh position={[-1, 0.3, DR_PRIMARY_LEAD]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial ref={primaryMatRef} color={CYAN} emissive={CYAN} emissiveIntensity={0.7} wireframe />
      </mesh>
      <mesh position={[1, -0.2, DR_SECONDARY_LEAD]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial ref={secondaryMatRef} color={VIOLET} emissive={VIOLET} emissiveIntensity={0.6} wireframe />
      </mesh>
      {/* the replication beam — always present, primary to secondary */}
      <mesh ref={beamRef} position={[0, 0.05, beamMid]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, DR_PRIMARY_LEAD - DR_SECONDARY_LEAD, 8]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.3} />
      </mesh>
      <FlowPath points={[[-1, 0.3, DR_PRIMARY_LEAD], [0, 0.05, beamMid], [1, -0.2, DR_SECONDARY_LEAD]]} count={4} speed={0.15} color={CYAN} size={0.05} />
    </group>
  );
}

/* --------------------------- IMPACT / RECOMMENDATIONS ---------------------- */

function GlassMoment({ z, tint = "#dff6ff" }: { z: number; tint?: string }) {
  return (
    <group position={[0, 0.4, z]}>
      <mesh rotation={[0, 0.12, 0]}>
        <planeGeometry args={[8, 4.4]} />
        <meshPhysicalMaterial color={tint} transparent opacity={0.06} clearcoat={1} clearcoatRoughness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0.12, 0]} position={[0, 0, -0.02]}>
        <planeGeometry args={[8, 4.4]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.06} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Scene({ progressRef, reducedMotion = false }: { progressRef: ScrollProgressRef; reducedMotion?: boolean }) {
  const glassRef = useRef<THREE.Group>(null);
  const bikeRef = useRef<THREE.Group>(null);

  return (
    <>
      <fog attach="fog" args={["#05070d", 24, 135]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#eaf6ff" />
      <Rig progressRef={progressRef} glassRef={glassRef} bikeRef={bikeRef} />
      <group ref={bikeRef}>
        <BikeRider progressRef={progressRef} reducedMotion={reducedMotion} />
      </group>

      <Grid
        position={[0, -2.4, -70]}
        args={[10, 10]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#242b3d"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#3a4358"
        fadeDistance={140}
        fadeStrength={1.2}
        infiniteGrid
      />

      <PipelineScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <KubernetesScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <AksScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <NetworkScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <SecurityScene reducedMotion={reducedMotion} />
      <ServiceBusScene reducedMotion={reducedMotion} />
      <AutomationScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <MonitoringScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <ProductionScene progressRef={progressRef} />
      <DisasterRecoveryScene progressRef={progressRef} />
      <GlassMoment z={Z.impact} tint="#f5b642" />
      <GlassMoment z={Z.recommendations} tint="#dff6ff" />

      <ForegroundGlass camGroupRef={glassRef} />
    </>
  );
}
