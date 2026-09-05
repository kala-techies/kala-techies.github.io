import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

// TEMP-DEBUG: stripped to bare Canvas defaults to isolate a render bug.
export function CanvasScene({
  progressRef,
}: {
  progressRef: ScrollProgressRef;
  reducedMotion: boolean;
}) {
  return (
    <Canvas>
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
