import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

// TEMP-DEBUG: minimal proof-of-concept scene to isolate a rendering bug.
export function Scene({ progressRef }: { progressRef: ScrollProgressRef; reducedMotion?: boolean }) {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (cubeRef.current) cubeRef.current.rotation.y += delta * 0.5;
    const targetZ = 5 - progressRef.current * 20;
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 3, delta);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={50} color="#ffffff" />
      <mesh ref={cubeRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff3355" />
      </mesh>
      <mesh position={[0, 0, -15]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#4fd1ff" />
      </mesh>
      <mesh position={[0, 0, -30]}>
        <torusKnotGeometry args={[3, 1, 100, 16]} />
        <meshStandardMaterial color="#8b7cf6" />
      </mesh>
    </>
  );
}
