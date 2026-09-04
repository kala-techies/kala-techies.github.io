import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { themes } from "../../data/profile";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";
import { PROJECTS_Z, RECOGNITION_Z, THEME_Z, cameraZAtProgress } from "./zones";

function Rig({ progressRef }: { progressRef: ScrollProgressRef }) {
  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const progress = progressRef.current;
    const targetZ = cameraZAtProgress(progress);
    const targetX = pointer.x * 0.4;
    const targetY = 0.6 + pointer.y * 0.2;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2, delta);
    camera.lookAt(targetX * 0.5, targetY * 0.3, targetZ - 12);

    if (lightsRef.current) lightsRef.current.position.copy(camera.position);
  });

  return (
    <group ref={lightsRef}>
      <pointLight position={[2, 3, 4]} intensity={22} color="#eaf6ff" />
      <pointLight position={[-3, 1, -2]} intensity={10} color="#4fd1ff" />
    </group>
  );
}

/** A single restrained, architectural form per theme — wireframe only,
 * monochrome with a touch of the accent colour, slow rotation. No glow,
 * no particles, no floating UI chips inside the 3D space. */
function ThemeForm({ z, index }: { z: number; index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.03 + (index % 3) * 0.01;

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.4;
    }
  });

  const scale = 2.1 + (index % 2) * 0.4;

  return (
    <mesh ref={ref} position={[index % 2 === 0 ? 1.4 : -1.4, 0.4, z]} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#4fd1ff" emissive="#4fd1ff" emissiveIntensity={0.15} wireframe transparent opacity={0.4} />
    </mesh>
  );
}

function RecognitionGlass() {
  return (
    <group position={[0, 0.5, RECOGNITION_Z]}>
      <mesh rotation={[0, 0.15, 0]}>
        <planeGeometry args={[8, 4.5]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.045} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, 0.15, 0]} position={[0, 0, -0.02]}>
        <planeGeometry args={[8, 4.5]} />
        <meshBasicMaterial color="#4fd1ff" transparent opacity={0.06} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ProjectsForm() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 0.3, PROJECTS_Z]} scale={1.3}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8b7cf6" emissive="#8b7cf6" emissiveIntensity={0.12} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

export function Scene({ progressRef }: { progressRef: ScrollProgressRef }) {
  const themeForms = useMemo(() => themes.map((t, i) => ({ id: t.id, z: THEME_Z[i], i })), []);

  return (
    <>
      <fog attach="fog" args={["#05070d", 12, 62]} />
      <ambientLight intensity={0.35} />
      <Rig progressRef={progressRef} />

      <Grid
        position={[0, -2.6, -20]}
        args={[10, 10]}
        cellSize={2}
        cellThickness={0.5}
        cellColor="#1e2331"
        sectionSize={10}
        sectionThickness={1}
        sectionColor="#2c3347"
        fadeDistance={55}
        fadeStrength={1.5}
        infiniteGrid
      />

      {themeForms.map((f) => (
        <ThemeForm key={f.id} z={f.z} index={f.i} />
      ))}

      <RecognitionGlass />
      <ProjectsForm />
    </>
  );
}
