import { useEffect, useState } from "react";
import type { ScrollProgressRef } from "./useScrollProgress";
import { localProgress } from "../components/environment/zones";

// Sequential beats of the opening ritual, all inside the "identity" zone's
// own local progress (0 = zone start, 1 = zone end). Mirrors
// useActiveZone's event-driven pattern rather than polling on
// requestAnimationFrame, for the same reason: rAF is throttled or paused
// in backgrounded tabs, and this drives the very first thing a visitor
// sees.
// Stage 0 gets extra room before the first line — a beat of silence
// with the bike simply parked, so the visitor has a moment to register
// "where am I" before any dialogue starts.
const STAGE_THRESHOLDS = [0, 0.22, 0.4, 0.58, 0.75, 1.01];

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
