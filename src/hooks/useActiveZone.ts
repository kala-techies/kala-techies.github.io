import { useEffect, useState } from "react";
import type { ScrollProgressRef } from "./useScrollProgress";
import { activeZoneAtProgress } from "../components/environment/zones";

/**
 * Derives the current discrete zone index from continuous scroll
 * progress. Driven directly by scroll/resize events (like
 * useScrollProgress itself) rather than a requestAnimationFrame poll —
 * rAF is throttled or paused entirely in backgrounded/inactive tabs, and
 * a poll loop built on it would silently stop tracking the zone in
 * exactly the situations where robustness matters most.
 */
export function useActiveZone(progressRef: ScrollProgressRef): number {
  const [zone, setZone] = useState(0);

  useEffect(() => {
    const update = () => {
      const next = activeZoneAtProgress(progressRef.current);
      setZone((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [progressRef]);

  return zone;
}
