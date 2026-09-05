import { useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import { Z, cameraZAtProgress } from "./zones";

const CYAN = "#4fd1ff";
const AZURE = "#3b82f6";
const VIOLET = "#8b7cf6";
const AMBER = "#f5b642";

function Rig({ progressRef }: { progressRef: ScrollProgressRef }) {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const targetZ = cameraZAtProgress(progress);
    const targetX = pointer.x * 0.6;
    const targetY = 1.6 + pointer.y * 0.25;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.8, delta);
    camera.lookAt(targetX * 0.4, -0.6, targetZ - 14);

    if (lightsRef.current) lightsRef.current.position.copy(camera.position);
  });

  return (
    <group ref={lightsRef}>
      <pointLight position={[3, 4, 4]} intensity={30} color="#eaf6ff" />
      <pointLight position={[-4, 1, -3]} intensity={14} color={CYAN} />
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
 * than a static diorama. */
function FlowPath({
  points,
  count = 10,
  color = CYAN,
  speed = 0.12,
  size = 0.055,
  offset = 0,
}: {
  points: THREE.Vector3Tuple[];
  count?: number;
  color?: string;
  speed?: number;
  size?: number;
  offset?: number;
}) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t0 = state.clock.elapsedTime * speed + offset;
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

function SlowSpin({ children, speed = 0.05, z }: { children: ReactNode; speed?: number; z: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return (
    <group ref={ref} position={[0, 0, z]}>
      {children}
    </group>
  );
}

/* ---------------------------- SCENE 02: CLOUD ---------------------------- */

function CloudScene() {
  const boxes = useMemo(
    () =>
      [
        [-3, -0.3, 0, 0.7],
        [-1.6, 0.1, -0.5, 1.1],
        [0, -0.5, 0.3, 0.6],
        [1.6, 0.3, -0.3, 1.4],
        [3, -0.2, 0.4, 0.8],
      ] as [number, number, number, number][],
    []
  );
  const segments = useMemo<[THREE.Vector3Tuple, THREE.Vector3Tuple][]>(
    () => boxes.slice(0, -1).map((b, i) => [[b[0], b[1] + b[3] / 2, b[2]], [boxes[i + 1][0], boxes[i + 1][1] + boxes[i + 1][3] / 2, boxes[i + 1][2]]]),
    [boxes]
  );

  return (
    <SlowSpin z={Z.cloud} speed={0.025}>
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.5, 48]} />
        <meshStandardMaterial color="#0d1420" transparent opacity={0.5} />
      </mesh>
      {boxes.map(([x, y, z, h], i) => (
        <mesh key={i} position={[x, y - 1.6 + h / 2, z]}>
          <boxGeometry args={[0.6, h, 0.6]} />
          <meshStandardMaterial color={AZURE} emissive={AZURE} emissiveIntensity={0.25} />
        </mesh>
      ))}
      <Connections segments={segments} color={CYAN} opacity={0.35} />
    </SlowSpin>
  );
}

/* -------------------------- SCENE 03: KUBERNETES -------------------------- */

function KubernetesScene() {
  const nodeX = [-2.6, 0, 2.6];
  const podOffsets: [number, number][] = [[-0.35, -0.35], [0.35, -0.35], [0, 0.35]];

  const podMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!podMeshRef.current) return;
    let i = 0;
    for (const nx of nodeX) {
      for (const [ox, oz] of podOffsets) {
        dummy.position.set(nx + ox, 0.55, oz);
        dummy.updateMatrix();
        podMeshRef.current.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    podMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const flowCurves = nodeX.map((nx) => [
    [0, 0.1, 4] as THREE.Vector3Tuple,
    [nx * 0.5, 0.1, 2] as THREE.Vector3Tuple,
    [nx, 0.3, 0] as THREE.Vector3Tuple,
  ]);

  return (
    <group position={[0, 0, Z.kubernetes]}>
      {nodeX.map((x) => (
        <mesh key={x} position={[x, 0.1, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.5, 24]} />
          <meshStandardMaterial color="#111826" emissive={CYAN} emissiveIntensity={0.15} />
        </mesh>
      ))}

      <instancedMesh ref={podMeshRef} args={[undefined, undefined, nodeX.length * podOffsets.length]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} />
      </instancedMesh>

      <mesh position={[0, 0.1, 4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.06, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.5} />
      </mesh>

      {flowCurves.map((pts, i) => (
        <FlowPath key={i} points={pts} count={6} speed={0.25} offset={i * 0.3} color={CYAN} size={0.05} />
      ))}

      <mesh position={[3.6, -0.3, -2]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} wireframe />
      </mesh>
    </group>
  );
}

/* --------------------------- SCENE 04: NETWORK+SECURITY -------------------- */

function NetworkSecurityScene() {
  const secretsRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const secretCount = 5;

  useFrame((state) => {
    if (!secretsRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < secretCount; i++) {
      const angle = t * 0.3 + (i / secretCount) * Math.PI * 2;
      dummy.position.set(3 + Math.cos(angle) * 0.7, 0.2 + Math.sin(t + i) * 0.1, -2 + Math.sin(angle) * 0.7);
      dummy.updateMatrix();
      secretsRef.current.setMatrixAt(i, dummy.matrix);
    }
    secretsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[0, 0, Z.networkSecurity]}>
      <mesh>
        <boxGeometry args={[4, 1.6, 3]} />
        <meshStandardMaterial color={AZURE} wireframe transparent opacity={0.35} />
      </mesh>
      <mesh position={[-0.8, 0, 0]}>
        <boxGeometry args={[2, 1, 1.8]} />
        <meshStandardMaterial color={CYAN} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.5, 0.05, 12, 32]} />
        <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2.6, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#eaf6ff" emissive="#eaf6ff" emissiveIntensity={0.3} />
      </mesh>
      <Connections segments={[[[1.4, 0, 0], [2.6, 0, 0]]]} color={AMBER} opacity={0.5} />

      <mesh position={[3, 0.2, -2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.9, 16]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.3} />
      </mesh>
      <instancedMesh ref={secretsRef} args={[undefined, undefined, secretCount]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={1} />
      </instancedMesh>
      <FlowPath
        points={[
          [3, 0.2, -2],
          [2.8, 0.2, -0.5],
          [2.6, 0, 0],
        ]}
        count={2}
        speed={0.08}
        color={VIOLET}
        size={0.045}
      />
    </group>
  );
}

/* ----------------------------- SCENE 05: AUTOMATION ------------------------ */

function AutomationScene() {
  const scattered = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const seed = i * 12.9898;
        const rand = (n: number) => Math.abs(Math.sin(seed + n) * 43758.5453) % 1;
        return [
          -3 + rand(1) * 1.4 - 0.7,
          -0.3 + rand(2) * 1.2,
          rand(3) * 1.6 - 0.8,
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
        return [2.2 + col * 0.5, -0.3 + row * 0.5, 0, 0] as [number, number, number, number];
      }),
    []
  );

  return (
    <group position={[0, 0, Z.automation]}>
      {scattered.map(([x, y, z, r], i) => (
        <mesh key={`s${i}`} position={[x, y, z]} rotation={[r, r, 0]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color="#5b607a" emissive="#5b607a" emissiveIntensity={0.15} />
        </mesh>
      ))}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.7, 0.08, 12, 32]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.6} />
      </mesh>
      {organized.map(([x, y, z], i) => (
        <mesh key={`o${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.45} />
        </mesh>
      ))}
      <FlowPath
        points={[
          [-3, 0.2, 0],
          [-1, 0.1, 0.3],
          [0, 0, 0],
          [1.2, 0, -0.1],
          [2.6, 0, 0],
        ]}
        count={5}
        speed={0.1}
        color={AMBER}
        size={0.05}
      />
    </group>
  );
}

/* ------------------------- SCENE 06: PRODUCTION/RELIABILITY --------------- */

function ProductionScene() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.3;
    const cycle = (Math.sin(state.clock.elapsedTime * 0.4) + 1) / 2; // 0..1
    if (materialRef.current) {
      materialRef.current.color.set(cycle > 0.85 ? AMBER : CYAN);
      materialRef.current.emissive.set(cycle > 0.85 ? AMBER : CYAN);
    }
    if (coreRef.current) coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04);
  });

  return (
    <group position={[0, 0, Z.production]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial ref={materialRef} color={CYAN} emissive={CYAN} emissiveIntensity={0.4} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.6, 0.02, 8, 64]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.5} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------- SCENE 07: DR ------------------------------ */

function DisasterRecoveryScene() {
  const beamRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (beamRef.current) {
      const m = beamRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.15 + (Math.sin(state.clock.elapsedTime * 1.5) + 1) * 0.15;
    }
  });

  return (
    <>
      <mesh position={[0, 0, Z.drPrimary]}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.3} wireframe />
      </mesh>
      <mesh position={[0, 0, Z.drSecondary]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.25} wireframe />
      </mesh>
      <mesh
        ref={beamRef}
        position={[0, 0, (Z.drPrimary + Z.drSecondary) / 2]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.015, 0.015, Z.drPrimary - Z.drSecondary, 8]} />
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
        <planeGeometry args={[7, 4]} />
        <meshBasicMaterial color={tint} transparent opacity={0.045} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0.12, 0]} position={[0, 0, -0.02]}>
        <planeGeometry args={[7, 4]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.05} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Scene({ progressRef }: { progressRef: ScrollProgressRef }) {
  return (
    <>
      <fog attach="fog" args={["#05070d", 16, 92]} />
      <ambientLight intensity={0.32} />
      <Rig progressRef={progressRef} />

      <Grid
        position={[0, -2.2, -30]}
        args={[10, 10]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#1e2331"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#2c3347"
        fadeDistance={80}
        fadeStrength={1.4}
        infiniteGrid
      />

      <CloudScene />
      <KubernetesScene />
      <NetworkSecurityScene />
      <AutomationScene />
      <ProductionScene />
      <DisasterRecoveryScene />
      <GlassMoment z={Z.impact} tint="#f5b642" />
      <GlassMoment z={Z.recommendations} tint="#dff6ff" />
    </>
  );
}
