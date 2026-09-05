import { useEffect, useState } from "react";
import type { ScrollProgressRef } from "./useScrollProgress";
import { localProgress } from "../components/environment/zones";

// Sequential beats of the opening ritual, all inside the "identity" zone's
// own local progress (0 = zone start, 1 = zone end). Mirrors
// useActiveZone's event-driven pattern rather than polling on
// requestAnimationFrame, for the same reason: rAF is throttled or paused
// in backgrounded tabs, and this drives the very first thing a visitor
// sees.
const STAGE_THRESHOLDS = [0, 0.15, 0.35, 0.55, 0.75, 1.01];

export function useOpeningStage(progressRef: ScrollProgressRef): number {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const update = () => {
      const t = localProgress(progressRef.current, "identity");
      let next = 0;
      for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
        if (t >= STAGE_THRESHOLDS[i]) {
          next = i;
          break;
        }
      }
      setStage((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progressRef]);

  return stage;
}
