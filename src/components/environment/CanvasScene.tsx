import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

/**
 * Bundles the Canvas together with Scene so the entire Three.js/R3F/drei
 * runtime stays inside one lazily-loaded chunk — importing `Canvas` at the
 * ScrollEnvironment level (which is mounted eagerly) would otherwise pull
 * all of it into the main bundle regardless of whether Scene itself is
 * lazy.
 */
export function CanvasScene({
  progressRef,
  activeZone,
  onZoneChange,
}: {
  progressRef: ScrollProgressRef;
  activeZone: number;
  onZoneChange: (zone: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene progressRef={progressRef} activeZone={activeZone} onZoneChange={onZoneChange} />
    </Canvas>
  );
}
