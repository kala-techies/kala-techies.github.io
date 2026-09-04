import { useEffect, useRef } from "react";

export type ScrollProgressRef = { current: number };

/**
 * Tracks document scroll progress (0 at top, 1 at bottom) in a ref, updated
 * on scroll/resize without triggering React re-renders. Meant to be read
 * imperatively inside a useFrame loop (R3F's own render loop already runs
 * continuously) rather than driving React state on every scroll tick.
 */
export function useScrollProgress(): ScrollProgressRef {
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
