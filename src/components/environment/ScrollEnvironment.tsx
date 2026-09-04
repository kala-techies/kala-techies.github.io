import { Suspense, lazy, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { hasWebGL } from "../../lib/webgl";
import { EnvironmentFallback } from "./EnvironmentFallback";
import { GlassFloor } from "./GlassFloor";

// The Canvas import (and therefore all of three/@react-three/fiber/drei)
// must live inside this lazy boundary, not at this module's top level —
// ScrollEnvironment itself is mounted eagerly by App.tsx.
const CanvasScene = lazy(() => import("./CanvasScene").then((m) => ({ default: m.CanvasScene })));

/**
 * A single, page-spanning 3D backdrop mounted once and fixed behind all
 * content. Scroll position drives a camera dolly through the journey —
 * not per-section canvases, not sections fading in and out.
 */
export function ScrollEnvironment() {
  const reducedMotion = useReducedMotion();
  const [canRender3D] = useState(() => hasWebGL() && !reducedMotion);
  const progressRef = useScrollProgress();

  return (
    <>
      {canRender3D ? (
        <div className="fixed inset-0 -z-10">
          <Suspense fallback={<EnvironmentFallback />}>
            <CanvasScene progressRef={progressRef} />
          </Suspense>
        </div>
      ) : (
        <EnvironmentFallback />
      )}
      <GlassFloor />
    </>
  );
}
