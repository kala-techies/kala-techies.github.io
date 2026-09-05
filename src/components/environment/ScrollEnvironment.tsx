import { Suspense, lazy, useState } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import { useActiveZone } from "../../hooks/useActiveZone";
import { hasWebGL } from "../../lib/webgl";
import { EnvironmentFallback } from "./EnvironmentFallback";
import { GlassFloor } from "./GlassFloor";
import { CaptionOverlay } from "../journey/CaptionOverlay";
import { JourneyFallback } from "../journey/JourneyFallback";

// The Canvas import (and therefore all of three/@react-three/fiber/drei)
// must live inside this lazy boundary, not at this module's top level —
// ScrollEnvironment itself is mounted eagerly by App.tsx.
const CanvasScene = lazy(() => import("./CanvasScene").then((m) => ({ default: m.CanvasScene })));

// Total scroll distance driving the journey, in viewport heights.
const JOURNEY_VH = 900;

/**
 * The cinematic mode: a fixed, page-spanning 3D canvas whose camera
 * dollies through 11 zones as the visitor scrolls, with a thin fixed
 * caption overlay whose content swaps per zone — the DOM is not a series
 * of sections you scroll past, it's a subtitle track for the 3D journey.
 * A tall, otherwise-empty spacer supplies the scrollable distance.
 *
 * Falls back to a normal linear, accessible page only when WebGL is
 * genuinely unavailable. `prefers-reduced-motion` does NOT trigger the
 * fallback — the camera only moves in direct response to scroll input,
 * which isn't the ambient/autoplaying motion that setting exists to
 * suppress. Instead it's threaded into the scene to freeze idle
 * animation (rotation, pulsing, flowing particles) while scroll-driven
 * camera movement keeps working.
 */
export function ScrollEnvironment() {
  const reducedMotion = useReducedMotion();
  const [canRender3D] = useState(() => hasWebGL());
  const progressRef = useScrollProgress();
  const zone = useActiveZone(progressRef);

  if (!canRender3D) {
    return (
      <main id="content">
        <JourneyFallback />
      </main>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={<EnvironmentFallback />}>
          <CanvasScene progressRef={progressRef} reducedMotion={reducedMotion} />
        </Suspense>
      </div>
      <GlassFloor />
      <CaptionOverlay zone={zone} />

      {/* Real, linearly-ordered content for screen readers and search
          crawlers — the visual experience above is a fixed overlay keyed
          to scroll position, which has no sensible reading order on its
          own. */}
      <div id="content" tabIndex={-1}>
        <JourneyFallback visuallyHidden />
      </div>

      <div style={{ height: `${JOURNEY_VH}vh` }} aria-hidden="true" />
    </>
  );
}
