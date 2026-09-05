import { useCallback, useEffect, useRef } from "react";
import { Canvas, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./Scene";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

/**
 * Bundles the Canvas together with Scene so the entire Three.js/R3F/drei
 * runtime stays inside one lazily-loaded chunk — importing `Canvas` at the
 * ScrollEnvironment level (which is mounted eagerly) would otherwise pull
 * all of it into the main bundle regardless of whether Scene itself is
 * lazy.
 *
 * R3F's own auto-sizing (measuring its wrapper div via a ResizeObserver
 * and calling gl.setSize accordingly) was silently not running in the
 * production build — the canvas element never received a width/height at
 * all, staying at the browser's 300x150 default, so nothing ever
 * rendered anywhere visible despite a perfectly live WebGL context.
 * Forcing an explicit size on creation and on window resize sidesteps
 * whatever's wrong in that pipeline — this is plain Three.js
 * (renderer.setSize), not a workaround specific to R3F internals.
 */
export function CanvasScene({
  progressRef,
  reducedMotion,
}: {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
}) {
  const stateRef = useRef<RootState | null>(null);

  const applySize = useCallback(() => {
    const state = stateRef.current;
    if (!state) return;
    const { innerWidth: w, innerHeight: h } = window;
    state.gl.setSize(w, h);
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }, []);

  const handleCreated = useCallback(
    (state: RootState) => {
      stateRef.current = state;
      applySize();
    },
    [applySize]
  );

  useEffect(() => {
    window.addEventListener("resize", applySize);
    return () => window.removeEventListener("resize", applySize);
  }, [applySize]);

  return (
    <Canvas
      onCreated={handleCreated}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
