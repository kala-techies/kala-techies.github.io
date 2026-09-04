import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
};

/**
 * The recurring "content sits in front of glass, environment behind it"
 * visual language — a performant CSS realization (backdrop-filter) rather
 * than per-panel WebGL refraction, so it stays cheap no matter how many
 * are on screen.
 */
export function GlassPanel({ children, className = "", as = "div" }: Props) {
  const Tag = as;
  return (
    <Tag
      className={`relative rounded-2xl border border-white/[0.08] bg-surface/60 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="relative">{children}</div>
    </Tag>
  );
}
