import { useEffect, useState } from "react";
import type { ScrollProgressRef } from "./useScrollProgress";
import { localProgress, type ZoneId } from "../components/environment/zones";

/**
 * Generic version of the opening ritual's staging mechanism: derives a
 * discrete stage index from a zone's own local progress crossing a list
 * of thresholds. Event-driven (scroll/resize), not a requestAnimationFrame
 * poll — rAF is throttled or paused in backgrounded tabs, and captions
 * are exactly the kind of thing that should keep working there.
 *
 * Lets any zone's caption sequence through several short lines paced to
 * scroll — "one sentence, pause, one sentence" — instead of one static
 * block sitting on screen for the zone's entire width.
 */
export function useZoneStage(progressRef: ScrollProgressRef, zoneId: ZoneId, thresholds: number[]): number {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const update = () => {
      const t = localProgress(progressRef.current, zoneId);
      let next = 0;
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (t >= thresholds[i]) {
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
    // thresholds is expected to be a stable module-level array per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressRef, zoneId]);

  return stage;
}
