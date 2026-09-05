import { useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import { Scene } from "./Scene";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

// TEMP-DEBUG: exposes frame-loop liveness and a manual render trigger on
// `window` for diagnosis from the browser console.
function FrameCounter() {
  useFrame(() => {
    const w = window as unknown as { __frameCount?: number };
    w.__frameCount = (w.__frameCount ?? 0) + 1;
  });
  return null;
}

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

      const w = window as unknown as {
        __r3fState?: RootState;
        __manualRender?: () => { rendered: boolean; error?: string };
      };
      w.__r3fState = state;
      w.__manualRender = () => {
        try {
          state.gl.render(state.scene, state.camera);
          return { rendered: true };
        } catch (e) {
          return { rendered: false, error: String(e) };
        }
      };
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
      frameloop="always"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
    >
      <FrameCounter />
      <Scene progressRef={progressRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
