import { useEffect, useRef, useState } from "react";

// Last-resort safety net for the rare case IntersectionObserver never fires
// (unsupported/broken in some environment). Long enough that it never
// preempts a normal scroll-triggered reveal.
const FALLBACK_MS = 4000;

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fallback = window.setTimeout(() => setInView(true), FALLBACK_MS);

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
        window.clearTimeout(fallback);
      }
    }, { threshold: 0.15, ...options });
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [options]);

  return { ref, inView };
}
