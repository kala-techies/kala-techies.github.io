import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, children, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], reducedMotion ? [0, 0, 0] : [24, 0, -24]);

  return (
    <section id={id} ref={ref} className={`relative mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 ${className ?? ""}`}>
      <Reveal className="mb-12 max-w-2xl">
        <motion.div style={{ y }}>
          <p className="font-mono text-sm tracking-widest text-cyan uppercase">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-ink-dim leading-relaxed">{description}</p>}
        </motion.div>
      </Reveal>
      {children}
    </section>
  );
}
