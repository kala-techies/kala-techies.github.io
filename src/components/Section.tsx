import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, children, className }: Props) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-10 ${className ?? ""}`}>
      <Reveal className="mb-12 max-w-2xl">
        <p className="font-mono text-sm tracking-widest text-cyan uppercase">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-ink-dim leading-relaxed">{description}</p>}
      </Reveal>
      {children}
    </section>
  );
}
