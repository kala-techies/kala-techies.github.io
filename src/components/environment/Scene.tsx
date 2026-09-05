import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import { Z, cameraZAtProgress, localProgress, revealBlend } from "./zones";

const CYAN = "#4fd1ff";
const AZURE = "#3b82f6";
const VIOLET = "#8b7cf6";
const AMBER = "#f5b642";
const RED = "#e05a5a";
const SLATE = "#5b607a";

/* -------------------------------- SHARED -------------------------------- */

function ForegroundGlass({ camGroupRef }: { camGroupRef: RefObject<THREE.Group | null> }) {
  const edgeGeo = useMemo(() => {
    const w = 6;
    const h = 3.4;
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
        <planeGeometry args={[6, 3.4]} />
        <meshPhysicalMaterial color="#dbeeff" transparent opacity={0.09} roughness={0.06} metalness={0.05} clearcoat={1} clearcoatRoughness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={edgeGeo} rotation={[0.08, 0, 0]}>
        <lineBasicMaterial color="#eaf6ff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Rig({ progressRef, glassRef }: { progressRef: ScrollProgressRef; glassRef: RefObject<THREE.Group | null> }) {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const targetZ = cameraZAtProgress(progress);
    const reveal = revealBlend(progress);

    // Base path: dolly forward with a small pointer-driven parallax.
    const baseX = pointer.x * 0.6;
    const baseY = 1.4 + pointer.y * 0.25;

    // Reveal-zone modifier: blend the camera up and back so it looks down
    // the whole corridor at once, then blend back to the normal path.
    const targetX = baseX;
    const targetY = baseY + reveal * 13;
    const lookAheadBase = 14;
    const lookAhead = lookAheadBase + reveal * 55;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.2, delta);
    camera.lookAt(targetX * 0.4, -0.5 - reveal * 6, targetZ - lookAhead);

    if (lightsRef.current) lightsRef.current.position.copy(camera.position);

    if (glassRef.current) {
      const glassOpacityScale = 1 - reveal;
      glassRef.current.position.set(camera.position.x * 0.9, camera.position.y - 0.35, camera.position.z - 3.2);
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

function SlowSpin({ children, speed = 0.05, z, reducedMotion = false }: { children: ReactNode; speed?: number; z: number; reducedMotion?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !reducedMotion) ref.current.rotation.y += delta * speed;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      {children}
    </group>
  );
}

/* ---------------------------- SCENE 02: PIPELINE ------------------------- */

function PipelineScene({ reducedMotion }: { reducedMotion: boolean }) {
  const buildRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (buildRef.current && !reducedMotion) buildRef.current.rotation.y += delta * 0.4;
  });

  const buildFragments = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return [Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0] as THREE.Vector3Tuple;
      }),
    []
  );

  return (
    <group position={[0, 0.2, Z.pipeline]}>
      {/* CODE — a thin stream of particles flowing toward the build stage */}
      <FlowPath points={[[0, 0, 5], [0.15, 0.1, 3.6], [0, 0, 2.2]]} count={8} speed={0.35} color={CYAN} size={0.04} reducedMotion={reducedMotion} />

      {/* BUILD — fragments assembling (a transformation, not a static shape) */}
      <group ref={buildRef} position={[0, 0, 1.4]}>
        {buildFragments.map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* CONTAINER — a solid container box, the fragments' resolved form */}
      <mesh position={[0, 0, 0]}>
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

      {/* DEPLOY — the container moving onward, toward the cloud */}
      <FlowPath points={[[0, 0, 0], [0, 0, -2], [0, 0, -4]]} count={4} speed={0.2} color={CYAN} size={0.05} offset={0.4} reducedMotion={reducedMotion} />
    </group>
  );
}

/* ---------------------------- SCENE 03: CLOUD ---------------------------- */

function CloudScene({ reducedMotion }: { reducedMotion: boolean }) {
  const boxes = useMemo(
    () =>
      [
        [-3.4, -0.4, 0, 1.1],
        [-1.8, 0.2, -0.6, 1.8],
        [0, -0.7, 0.4, 0.9],
        [1.8, 0.5, -0.4, 2.2],
        [3.4, -0.3, 0.5, 1.3],
      ] as [number, number, number, number][],
    []
  );
  const segments = useMemo<[THREE.Vector3Tuple, THREE.Vector3Tuple][]>(
    () => boxes.slice(0, -1).map((b, i) => [[b[0], b[1] + b[3] / 2, b[2]], [boxes[i + 1][0], boxes[i + 1][1] + boxes[i + 1][3] / 2, boxes[i + 1][2]]]),
    [boxes]
  );

  return (
    <SlowSpin z={Z.cloud} speed={0.025} reducedMotion={reducedMotion}>
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#0d1420" transparent opacity={0.55} />
      </mesh>
      {boxes.map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y - 1.8 + h / 2, z]}>
          <boxGeometry args={[0.9, h, 0.9]} />
          <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.35} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      <Connections segments={segments} color={CYAN} opacity={0.4} />
    </SlowSpin>
  );
}

/* -------------------------- SCENE 04: KUBERNETES -------------------------- */

function KubernetesScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const nodeX = [-3.2, 0, 3.2, 5.6];
  const podOffsets: [number, number][] = [[-0.4, -0.4], [0.4, -0.4], [0, 0.4]];

  const podMeshRef = useRef<THREE.InstancedMesh>(null);
  const scaleNodeRef = useRef<THREE.Group>(null);
  const scaleMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    // Scale the cluster out (a 4th node fades in) as the visitor moves
    // through the back half of this zone — AKS node-pool scaling, made
    // physical rather than described.
    const t = localProgress(progressRef.current, "kubernetes");
    const scaleIn = Math.max(0, (t - 0.55) / 0.45);
    if (scaleNodeRef.current) scaleNodeRef.current.scale.setScalar(scaleIn);
    if (scaleMatRef.current) scaleMatRef.current.opacity = scaleIn;

    if (!podMeshRef.current) return;
    let i = 0;
    for (const nx of nodeX.slice(0, 3)) {
      for (const [ox, oz] of podOffsets) {
        dummy.position.set(nx + ox, 0.7, oz);
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
      <group ref={scaleNodeRef} position={[nodeX[3], 0.1, 0]} scale={0}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.78, 0.6, 24]} />
          <meshStandardMaterial ref={scaleMatRef} color="#111826" emissive={AMBER} emissiveIntensity={0.3} transparent opacity={0} roughness={0.5} metalness={0.4} />
        </mesh>
      </group>

      <instancedMesh ref={podMeshRef} args={[undefined, undefined, 9]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} />
      </instancedMesh>

      <mesh position={[0, 0.2, 5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.08, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.6} />
      </mesh>

      {flowCurves.map((pts, i) => (
        <FlowPath key={i} points={pts} count={7} speed={0.28} offset={i * 0.3} color={CYAN} size={0.07} reducedMotion={reducedMotion} />
      ))}

      <mesh position={[4.4, -0.3, -2]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.35} wireframe />
      </mesh>
    </group>
  );
}

/* ---------------------------- SCENE 05: NETWORK --------------------------- */

function NetworkScene() {
  return (
    <group position={[0, 0, Z.network]}>
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
      <FlowPath points={[[-2, 0, 0], [-0.4, 0, 0], [1.7, 0, 0], [3.1, 0, 0], [4.4, 0, 0]]} count={6} speed={0.15} color={CYAN} size={0.05} />
    </group>
  );
}

/* --------------------------- SCENE 06: SECURITY ---------------------------- */

function SecurityScene() {
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
      {/* the response, only after the gate */}
      <FlowPath points={[[-3.2, 0, 0], [-1.6, 0, 0], [0, 0, 0]]} count={3} speed={0.1} color={AMBER} size={0.05} />
    </group>
  );
}

/* ----------------------------- SCENE 07: AUTOMATION ------------------------ */

function AutomationScene({ progressRef, reducedMotion }: { progressRef: ScrollProgressRef; reducedMotion: boolean }) {
  const count = 9;
  const scatteredMeshRef = useRef<THREE.InstancedMesh>(null);
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
  const slateColor = useMemo(() => new THREE.Color(SLATE), []);
  const cyanColor = useMemo(() => new THREE.Color(CYAN), []);
  const instanceColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!scatteredMeshRef.current) return;
    // The manual-to-automated transformation is literally driven by how
    // far the visitor has scrolled through this zone — not a timer. Dull,
    // scattered slate cubes settle into bright, ordered cyan ones.
    const t = localProgress(progressRef.current, "automation");
    const eased = t * t * (3 - 2 * t); // smoothstep
    for (let i = 0; i < count; i++) {
      dummy.position.lerpVectors(scattered[i], organized[i], eased);
      dummy.rotation.set(rotSeeds[i] * (1 - eased), rotSeeds[i] * (1 - eased), 0);
      dummy.updateMatrix();
      instanceColor.lerpColors(slateColor, cyanColor, eased);
      scatteredMeshRef.current.setColorAt(i, instanceColor);
      scatteredMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    scatteredMeshRef.current.instanceMatrix.needsUpdate = true;
    if (scatteredMeshRef.current.instanceColor) scatteredMeshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <group position={[0, 0, Z.automation]}>
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
    </group>
  );
}

/* --------------------------- SCENE 08: SERVICE BUS -------------------------- */

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
      {/* queue / topic */}
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
      {/* dead-letter area — a separate, amber-tinted holding zone */}
      <mesh position={[1.4, -2, -0.5]}>
        <boxGeometry args={[0.9, 0.6, 0.6]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={0.3} wireframe />
      </mesh>

      {/* main flow: app → queue → subscriptions → consumers */}
      <FlowPath points={[[-3.4, 0.2, 0], [-0.4, 0, 0], [1.4, 0.6, 0], [2.8, 0.6, 0]]} count={5} speed={0.14} color={CYAN} size={0.05} reducedMotion={reducedMotion} />
      <FlowPath points={[[-3.4, 0.2, 0], [-0.4, 0, 0], [1.4, -0.6, 0], [2.8, -0.6, 0]]} count={5} speed={0.12} offset={0.4} color={CYAN} size={0.05} reducedMotion={reducedMotion} />
      {/* a slower, diverted stream — the messages that don't make it through cleanly */}
      <FlowPath points={[[-0.4, 0, 0], [0.5, -1, -0.3], [1.4, -2, -0.5]]} count={2} speed={0.05} color={RED} size={0.05} reducedMotion={reducedMotion} />
    </group>
  );
}

/* ------------------------- SCENE 09: PRODUCTION ---------------------------- */

function ProductionScene({ progressRef }: { progressRef: ScrollProgressRef }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const alertRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const alertMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.3;

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
  });

  return (
    <group position={[1.9, 0.2, Z.production]}>
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
    </group>
  );
}

/* ------------------------------- SCENE 10: DR ------------------------------ */

function DisasterRecoveryScene({ progressRef }: { progressRef: ScrollProgressRef }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const primaryMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const secondaryMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = localProgress(progressRef.current, "dr");
    // 0–0.4 primary active; 0.4–0.6 failover event; 0.6–1 secondary active.
    const primaryHealth = t < 0.4 ? 1 : Math.max(0, 1 - (t - 0.4) / 0.2);
    const secondaryHealth = t < 0.4 ? 0.25 : Math.min(1, (t - 0.4) / 0.2);

    if (primaryMatRef.current) primaryMatRef.current.emissiveIntensity = 0.15 + primaryHealth * 0.6;
    if (secondaryMatRef.current) secondaryMatRef.current.emissiveIntensity = 0.1 + secondaryHealth * 0.55;
    if (beamRef.current) {
      const m = beamRef.current.material as THREE.MeshBasicMaterial;
      const failoverPulse = t > 0.35 && t < 0.65 ? 0.5 : 0.2;
      m.opacity = failoverPulse + (Math.sin(state.clock.elapsedTime * 1.5) + 1) * 0.15;
    }
  });

  return (
    <>
      <mesh position={[-1, 0.3, Z.drPrimary]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial ref={primaryMatRef} color={CYAN} emissive={CYAN} emissiveIntensity={0.7} wireframe />
      </mesh>
      <mesh position={[1, -0.2, Z.drSecondary]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial ref={secondaryMatRef} color={VIOLET} emissive={VIOLET} emissiveIntensity={0.6} wireframe />
      </mesh>
      <mesh ref={beamRef} position={[0, 0.05, (Z.drPrimary + Z.drSecondary) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, Z.drPrimary - Z.drSecondary, 8]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.3} />
      </mesh>
      <FlowPath points={[[-1, 0.3, Z.drPrimary], [0, 0.05, (Z.drPrimary + Z.drSecondary) / 2], [1, -0.2, Z.drSecondary]]} count={4} speed={0.15} color={CYAN} size={0.05} />
    </>
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

  return (
    <>
      <fog attach="fog" args={["#05070d", 22, 115]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#eaf6ff" />
      <Rig progressRef={progressRef} glassRef={glassRef} />

      <Grid
        position={[0, -2.4, -40]}
        args={[10, 10]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#242b3d"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#3a4358"
        fadeDistance={100}
        fadeStrength={1.2}
        infiniteGrid
      />

      <PipelineScene reducedMotion={reducedMotion} />
      <CloudScene reducedMotion={reducedMotion} />
      <KubernetesScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <NetworkScene />
      <SecurityScene />
      <AutomationScene progressRef={progressRef} reducedMotion={reducedMotion} />
      <ServiceBusScene reducedMotion={reducedMotion} />
      <ProductionScene progressRef={progressRef} />
      <DisasterRecoveryScene progressRef={progressRef} />
      <GlassMoment z={Z.impact} tint="#f5b642" />
      <GlassMoment z={Z.recommendations} tint="#dff6ff" />

      <ForegroundGlass camGroupRef={glassRef} />
    </>
  );
}
