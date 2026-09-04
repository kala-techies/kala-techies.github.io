import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Html, Line, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heroTechNodes } from "../../data/profile";

const NODE_COLORS = ["#4fd1ff", "#3b82f6", "#8b7cf6", "#f5b642"];

function fibonacciSphere(count: number, radius: number) {
  const points: [number, number, number][] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push([x * radius, y * radius, z * radius]);
  }
  return points;
}

function CoreNode() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#0a0d16"
          emissive="#4fd1ff"
          emissiveIntensity={0.35}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial color="#4fd1ff" emissive="#4fd1ff" emissiveIntensity={0.8} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

type TechNodeProps = {
  position: [number, number, number];
  label: string;
  color: string;
  index: number;
};

function TechNode({ position, label, color, index }: TechNodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.8} floatingRange={[-0.15, 0.15]}>
      <group position={position}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.35 : 1}
        >
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.4 : 0.7} />
        </mesh>
        <Html center distanceFactor={9} occlude={false} style={{ pointerEvents: "none" }}>
          <div
            className="font-mono whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] transition-all duration-200"
            style={{
              transform: `translateY(${index % 2 === 0 ? "-26px" : "18px"})`,
              borderColor: hovered ? color : "rgba(255,255,255,0.12)",
              background: hovered ? "rgba(10,13,22,0.92)" : "rgba(10,13,22,0.55)",
              color: hovered ? color : "#9aa1b5",
              opacity: hovered ? 1 : 0.85,
            }}
          >
            {label}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(heroTechNodes.length, 2.6), []);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;

    target.current.x = state.pointer.y * 0.25;
    target.current.y += (state.pointer.x * 0.4 - target.current.y) * 0.02;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, target.current.x, 0.05);
  });

  return (
    <group ref={groupRef}>
      <CoreNode />
      {positions.map((pos, i) => (
        <Line
          key={`line-${i}`}
          points={[[0, 0, 0], pos]}
          color="#2c3347"
          transparent
          opacity={0.5}
          lineWidth={1}
        />
      ))}
      {positions.map((pos, i) => (
        <TechNode
          key={heroTechNodes[i]}
          position={pos}
          label={heroTechNodes[i]}
          color={NODE_COLORS[i % NODE_COLORS.length]}
          index={i}
        />
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#4fd1ff" />
      <pointLight position={[-5, -3, -4]} intensity={20} color="#8b7cf6" />
      <Suspense fallback={null}>
        <Sparkles count={70} scale={7} size={1.4} speed={0.15} color="#4fd1ff" opacity={0.35} />
        <Constellation />
      </Suspense>
    </Canvas>
  );
}
