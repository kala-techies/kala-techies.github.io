import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Content appears to drift into focus out of depth — scale and blur
 * settle as it enters view, reinforcing the sense of the camera
 * approaching rather than a section simply fading in. */
export function FocusReveal({ children, className, delay = 0 }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
