import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { fibonacciSphere, tieredLayout } from "../../lib/layouts";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import {
  ENGINEERING_CLUSTER,
  END_CLUSTER,
  HERO_CLUSTER,
  PERSONAL_CLUSTER,
  RECOGNITION_CLUSTER,
  activeZoneAtProgress,
  cameraZAtProgress,
} from "./zones";

const PALETTE = ["#4fd1ff", "#3b82f6", "#8b7cf6", "#f5b642"];

function Rig({ progressRef, onZoneChange }: { progressRef: ScrollProgressRef; onZoneChange: (zone: number) => void }) {
  const lightsRef = useRef<THREE.Group>(null);
  const lastZone = useRef(-1);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const targetZ = cameraZAtProgress(progress);
    const targetX = Math.sin(progress * Math.PI * 2.4) * 1.3 + pointer.x * 0.5;
    const targetY = pointer.y * 0.25 + Math.cos(progress * Math.PI * 1.6) * 0.3;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.2, delta);
    camera.lookAt(targetX * 0.6, targetY * 0.6, targetZ - 9);

    if (lightsRef.current) {
      lightsRef.current.position.copy(camera.position);
    }

    const zone = activeZoneAtProgress(progress);
    if (zone !== lastZone.current) {
      lastZone.current = zone;
      onZoneChange(zone);
    }
  });

  return (
    <group ref={lightsRef}>
      <pointLight position={[3, 2, 4]} intensity={35} color="#4fd1ff" />
      <pointLight position={[-3, -2, 2]} intensity={18} color="#8b7cf6" />
    </group>
  );
}

/** Renders many disconnected line segments as a single draw call (one
 * BufferGeometry + one plain LineBasicMaterial) instead of one drei <Line>
 * per segment — each of those compiles its own fat-line shader, which adds
 * up fast in GPU-constrained environments. */
function Connections({ segments, opacity = 0.5 }: { segments: [THREE.Vector3Tuple, THREE.Vector3Tuple][]; opacity?: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(segments.length * 6);
    segments.forEach(([a, b], i) => {
      positions.set([...a, ...b], i * 6);
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [segments]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#2c3347" transparent opacity={opacity} />
    </lineSegments>
  );
}

function ClusterCore({ position, color = "#4fd1ff" }: { position: [number, number, number]; color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#0a0d16" emissive={color} emissiveIntensity={0.3} wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.45, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function LabeledNode({
  position,
  label,
  color,
  showLabel,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  showLabel: boolean;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6} floatingRange={[-0.12, 0.12]}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.75} />
        </mesh>
        {showLabel && (
          <Html center distanceFactor={9} occlude={false} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full border border-white/10 bg-surface/80 px-2.5 py-1 font-mono text-[11px] text-ink-dim backdrop-blur-sm">
              {label}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

function HeroCluster() {
  const positions = useMemo(() => fibonacciSphere(HERO_CLUSTER.labels.length, HERO_CLUSTER.radius), []);
  const segments = useMemo<[THREE.Vector3Tuple, THREE.Vector3Tuple][]>(
    () => positions.map((pos) => [[0, 0, 0], pos]),
    [positions]
  );

  return (
    <group position={[0, 0, HERO_CLUSTER.z]}>
      <ClusterCore position={[0, 0, 0]} />
      <Connections segments={segments} />
      {positions.map((pos, i) => (
        <LabeledNode
          key={HERO_CLUSTER.labels[i]}
          position={pos}
          label={HERO_CLUSTER.labels[i]}
          color={PALETTE[i % PALETTE.length]}
          showLabel
        />
      ))}
    </group>
  );
}

function EngineeringCluster({ active }: { active: boolean }) {
  const positions = useMemo(() => tieredLayout(ENGINEERING_CLUSTER.tierSizes, 2.2, 2.4), []);
  const tierCount = ENGINEERING_CLUSTER.tierSizes.length;
  const tierY = (tierIndex: number) => ((tierCount - 1) * 2.4) / 2 - tierIndex * 2.4;

  const tierStartIndices = useMemo(
    () =>
      ENGINEERING_CLUSTER.tierSizes.reduce<{ starts: number[]; running: number }>(
        (acc, size) => {
          acc.starts.push(acc.running);
          acc.running += size;
          return acc;
        },
        { starts: [], running: 0 }
      ).starts,
    []
  );

  const segments = useMemo<[THREE.Vector3Tuple, THREE.Vector3Tuple][]>(() => {
    const spine: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = [];
    for (let t = 0; t < tierCount - 1; t++) {
      spine.push([[0, tierY(t), 0], [0, tierY(t + 1), 0]]);
    }
    const branches: [THREE.Vector3Tuple, THREE.Vector3Tuple][] = positions.map((pos, i) => {
      const tierIndex = tierStartIndices.findIndex(
        (start, idx) => i >= start && i < start + ENGINEERING_CLUSTER.tierSizes[idx]
      );
      return [[0, tierY(tierIndex), 0], pos];
    });
    return [...spine, ...branches];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions, tierStartIndices]);

  return (
    <group position={[0, 0, ENGINEERING_CLUSTER.z]}>
      <Connections segments={segments} opacity={0.5} />
      {positions.map((pos, i) => (
        <LabeledNode
          key={ENGINEERING_CLUSTER.labels[i]}
          position={pos}
          label={ENGINEERING_CLUSTER.labels[i]}
          color={PALETTE[i % PALETTE.length]}
          showLabel={active}
        />
      ))}
    </group>
  );
}

function RecognitionMoment() {
  return (
    <group position={[0, 0, RECOGNITION_CLUSTER.z]}>
      <mesh rotation={[0, 0.2, 0]}>
        <planeGeometry args={[9, 5.5]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-2.2, 1, -1.5]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial color="#f5b642" emissive="#f5b642" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh position={[2.4, -0.8, -1.8]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#4fd1ff" emissive="#4fd1ff" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function PersonalCluster({ active }: { active: boolean }) {
  const positions = useMemo(() => fibonacciSphere(PERSONAL_CLUSTER.labels.length, PERSONAL_CLUSTER.radius), []);
  const segments = useMemo<[THREE.Vector3Tuple, THREE.Vector3Tuple][]>(
    () => positions.map((pos) => [[0, 0, 0], pos]),
    [positions]
  );

  return (
    <group position={[0, 0, PERSONAL_CLUSTER.z]}>
      <ClusterCore position={[0, 0, 0]} color="#8b7cf6" />
      <Connections segments={segments} />
      {positions.map((pos, i) => (
        <LabeledNode
          key={PERSONAL_CLUSTER.labels[i]}
          position={pos}
          label={PERSONAL_CLUSTER.labels[i]}
          color={i % 2 === 0 ? "#8b7cf6" : "#f5b642"}
          showLabel={active}
        />
      ))}
    </group>
  );
}

export function Scene({
  progressRef,
  activeZone,
  onZoneChange,
}: {
  progressRef: ScrollProgressRef;
  activeZone: number;
  onZoneChange: (zone: number) => void;
}) {
  return (
    <>
      <fog attach="fog" args={["#05070d", 8, 34]} />
      <ambientLight intensity={0.4} />
      <Rig progressRef={progressRef} onZoneChange={onZoneChange} />
      <Sparkles count={70} scale={[16, 16, 46]} size={1.2} speed={0.1} color="#4fd1ff" opacity={0.22} position={[0, 0, -20]} />

      <HeroCluster />
      <EngineeringCluster active={activeZone === 1} />
      <RecognitionMoment />
      <PersonalCluster active={activeZone === 3} />
      <group position={[0, 0, END_CLUSTER.z]} />
    </>
  );
}
