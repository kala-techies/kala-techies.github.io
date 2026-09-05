import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import { Z, cameraZAtProgress } from "./zones";

const CYAN = "#4fd1ff";
const AZURE = "#3b82f6";
const VIOLET = "#8b7cf6";
const AMBER = "#f5b642";

/** A physical-feeling glass pane that stays a fixed distance ahead of the
 * camera at all times — the "looking down through glass at a world
 * beyond" sensation the whole journey is built around, not a one-off
 * moment. Clearcoat + a visible edge outline read as a real surface
 * without needing an expensive transmission/render-target pass. */
function ForegroundGlass({ camGroupRef }: { camGroupRef: RefObject<THREE.Group | null> }) {
  const edgeGeo = useMemo(() => {
    const w = 6;
    const h = 3.4;
    const pts: THREE.Vector3Tuple[] = [
      [-w / 2, -h / 2, 0],
      [w / 2, -h / 2, 0],
      [w / 2, -h / 2, 0],
      [w / 2, h / 2, 0],
      [w / 2, h / 2, 0],
      [-w / 2, h / 2, 0],
      [-w / 2, h / 2, 0],
      [-w / 2, -h / 2, 0],
    ];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts.flat()), 3));
    return geo;
  }, []);

  return (
    <group ref={camGroupRef}>
      <mesh rotation={[0.08, 0, 0]}>
        <planeGeometry args={[6, 3.4]} />
        <meshPhysicalMaterial
          color="#dbeeff"
          transparent
          opacity={0.09}
          roughness={0.06}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={edgeGeo} rotation={[0.08, 0, 0]}>
        <lineBasicMaterial color="#eaf6ff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function Rig({
  progressRef,
  glassRef,
}: {
  progressRef: ScrollProgressRef;
  glassRef: RefObject<THREE.Group | null>;
}) {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const targetZ = cameraZAtProgress(progress);
    const targetX = pointer.x * 0.6;
    const targetY = 1.4 + pointer.y * 0.25;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.2, delta);
    camera.lookAt(targetX * 0.4, -0.5, targetZ - 14);

    if (lightsRef.current) lightsRef.current.position.copy(camera.position);

    if (glassRef.current) {
      glassRef.current.position.set(camera.position.x * 0.9, camera.position.y - 0.35, camera.position.z - 3.2);
      glassRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
    }
  });

  return (
    <group ref={lightsRef}>
      <pointLight position={[3, 4, 4]} intensity={45} color="#eaf6ff" />
      <pointLight position={[-4, 1, -3]} intensity={22} color={CYAN} />
    </group>
  );
}

/** Batches many disconnected line segments into one draw call. */
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

/** Small glowing spheres that loop continuously along a curve — the
 * "traffic"/"data flow" motion that makes each scene feel alive rather
 * than a static diorama. Frozen (but still positioned) when reducedMotion
 * is set. */
function FlowPath({
  points,
  count = 10,
  color = CYAN,
  speed = 0.12,
  size = 0.055,
  offset = 0,
  reducedMotion = false,
}: {
  points: THREE.Vector3Tuple[];
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  offset?: number;
  reducedMotion?: boolean;
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

/* ---------------------------- SCENE 02: CLOUD ---------------------------- */

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

/* -------------------------- SCENE 03: KUBERNETES -------------------------- */

function KubernetesScene({ reducedMotion }: { reducedMotion: boolean }) {
  const nodeX = [-3.2, 0, 3.2];
  const podOffsets: [number, number][] = [[-0.4, -0.4], [0.4, -0.4], [0, 0.4]];

  const podMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!podMeshRef.current) return;
    let i = 0;
    for (const nx of nodeX) {
      for (const [ox, oz] of podOffsets) {
        dummy.position.set(nx + ox, 0.7, oz);
        dummy.updateMatrix();
        podMeshRef.current.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    podMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const flowCurves = nodeX.map((nx) => [
    [0, 0.1, 5] as THREE.Vector3Tuple,
    [nx * 0.5, 0.1, 2.5] as THREE.Vector3Tuple,
    [nx, 0.4, 0] as THREE.Vector3Tuple,
  ]);

  return (
    <group position={[0, 0, Z.kubernetes]}>
      {nodeX.map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.78, 0.6, 24]} />
          <meshStandardMaterial color="#111826" emissive={CYAN} emissiveIntensity={0.2} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      <instancedMesh ref={podMeshRef} args={[undefined, undefined, nodeX.length * podOffsets.length]}>
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

/* --------------------------- SCENE 04: NETWORK+SECURITY -------------------- */

function NetworkSecurityScene({ reducedMotion }: { reducedMotion: boolean }) {
  const secretsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const secretCount = 5;

  useFrame((state) => {
    if (!secretsRef.current) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    for (let i = 0; i < secretCount; i++) {
      const angle = t * 0.3 + (i / secretCount) * Math.PI * 2;
      dummy.position.set(3.6 + Math.cos(angle) * 0.85, 0.2 + Math.sin(t + i) * 0.1, -2.4 + Math.sin(angle) * 0.85);
      dummy.updateMatrix();
      secretsRef.current.setMatrixAt(i, dummy.matrix);
    }
    secretsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, Z.networkSecurity]}>
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
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.4} roughness={0.3} metalness={0.5} />
      </mesh>
      <Connections segments={[[[1.7, 0, 0], [3.1, 0, 0]]]} color={AMBER} opacity={0.55} />

      <mesh position={[3.6, 0.2, -2.4]}>
        <cylinderGeometry args={[0.5, 0.5, 1.1, 16]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.35} roughness={0.4} metalness={0.4} />
      </mesh>
      <instancedMesh ref={secretsRef} args={[undefined, undefined, secretCount]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={1} />
      </instancedMesh>
      <FlowPath
        points={[
          [3.6, 0.2, -2.4],
          [3.3, 0.2, -0.6],
          [3.1, 0, 0],
        ]}
        count={2}
        speed={0.08}
        color={VIOLET}
        size={0.05}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

/* ----------------------------- SCENE 05: AUTOMATION ------------------------ */

function AutomationScene({ reducedMotion }: { reducedMotion: boolean }) {
  const scattered = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const seed = i * 12.9898;
        const rand = (n: number) => Math.abs(Math.sin(seed + n) * 43758.5453) % 1;
        return [
          -3.6 + rand(1) * 1.8 - 0.9,
          -0.3 + rand(2) * 1.5,
          rand(3) * 2 - 1,
          rand(4) * Math.PI,
        ] as [number, number, number, number];
      }),
    []
  );
  const organized = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return [2.6 + col * 0.65, -0.4 + row * 0.65, 0, 0] as [number, number, number, number];
      }),
    []
  );

  return (
    <group position={[0, 0, Z.automation]}>
      {scattered.map(([x, y, z, r], i) => (
        <mesh key={`s${i}`} position={[x, y, z]} rotation={[r, r, 0]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial color="#5b607a" emissive="#5b607a" emissiveIntensity={0.2} />
        </mesh>
      ))}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.9, 0.1, 12, 32]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.7} />
      </mesh>
      {organized.map(([x, y, z], i) => (
        <mesh key={`o${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
        </mesh>
      ))}
      <FlowPath
        points={[
          [-3.6, 0.2, 0],
          [-1.2, 0.1, 0.4],
          [0, 0, 0],
          [1.4, 0, -0.1],
          [3.2, 0, 0],
        ]}
        count={5}
        speed={0.1}
        color={AMBER}
        size={0.065}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

/* ------------------------- SCENE 06: PRODUCTION/RELIABILITY --------------- */

function ProductionScene({ reducedMotion }: { reducedMotion: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (reducedMotion) return;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.3;
    const cycle = (Math.sin(state.clock.elapsedTime * 0.4) + 1) / 2; // 0..1
    if (materialRef.current) {
      materialRef.current.color.set(cycle > 0.85 ? AMBER : CYAN);
      materialRef.current.emissive.set(cycle > 0.85 ? AMBER : CYAN);
    }
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04);
  });

  return (
    // Offset off the camera's direct path (x=0) — a solid core sitting
    // dead-center gets flown straight into as the camera dollies through,
    // filling the whole frame instead of reading as a composed scene.
    <group position={[1.9, 0.2, Z.production]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial ref={materialRef} color={CYAN} emissive={CYAN} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.2, 0.025, 8, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

/* ------------------------------- SCENE 07: DR ------------------------------ */

function DisasterRecoveryScene({ reducedMotion }: { reducedMotion: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (beamRef.current) {
      const m = beamRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = reducedMotion ? 0.2 : 0.15 + (Math.sin(state.clock.elapsedTime * 1.5) + 1) * 0.15;
    }
  });

  return (
    <>
      <mesh position={[0, 0, Z.drPrimary]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.35} wireframe />
      </mesh>
      <mesh position={[0, 0, Z.drSecondary]}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} wireframe />
      </mesh>
      <mesh
        ref={beamRef}
        position={[0, 0, (Z.drPrimary + Z.drSecondary) / 2]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.02, 0.02, Z.drPrimary - Z.drSecondary, 8]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.2} />
      </mesh>
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

export function Scene({
  progressRef,
  reducedMotion = false,
}: {
  progressRef: ScrollProgressRef;
  reducedMotion?: boolean;
}) {
  const glassRef = useRef<THREE.Group>(null);

  return (
    <>
      <fog attach="fog" args={["#05070d", 22, 95]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#eaf6ff" />
      <Rig progressRef={progressRef} glassRef={glassRef} />

      <Grid
        position={[0, -2.4, -30]}
        args={[10, 10]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#242b3d"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#3a4358"
        fadeDistance={85}
        fadeStrength={1.2}
        infiniteGrid
      />

      <CloudScene reducedMotion={reducedMotion} />
      <KubernetesScene reducedMotion={reducedMotion} />
      <NetworkSecurityScene reducedMotion={reducedMotion} />
      <AutomationScene reducedMotion={reducedMotion} />
      <ProductionScene reducedMotion={reducedMotion} />
      <DisasterRecoveryScene reducedMotion={reducedMotion} />
      <GlassMoment z={Z.impact} tint="#f5b642" />
      <GlassMoment z={Z.recommendations} tint="#dff6ff" />

      <ForegroundGlass camGroupRef={glassRef} />
    </>
  );
}
