import { Suspense, lazy, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { hasWebGL } from "../../lib/webgl";
import { EnvironmentFallback } from "./EnvironmentFallback";

// The Canvas import (and therefore all of three/@react-three/fiber/drei)
// must live inside this lazy boundary, not at this module's top level —
// ScrollEnvironment itself is mounted eagerly by App.tsx.
const CanvasScene = lazy(() => import("./CanvasScene").then((m) => ({ default: m.CanvasScene })));

/**
 * A single, page-spanning 3D backdrop mounted once and fixed behind all
 * content. Scroll position drives a camera dolly through zones — hero,
 * engineering map, recognition, personal projects — rather than each
 * section owning its own canvas.
 */
export function ScrollEnvironment() {
  const reducedMotion = useReducedMotion();
  const [canRender3D] = useState(() => hasWebGL() && !reducedMotion);
  const progressRef = useScrollProgress();
  const [activeZone, setActiveZone] = useState(0);

  if (!canRender3D) {
    return <EnvironmentFallback />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={<EnvironmentFallback />}>
        <CanvasScene progressRef={progressRef} activeZone={activeZone} onZoneChange={setActiveZone} />
      </Suspense>
    </div>
  );
}
