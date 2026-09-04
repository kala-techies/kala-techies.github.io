import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { clientProjects, personalProjects, type ClientProject, type PersonalProject } from "../../data/profile";

type CardData =
  | { kind: "client"; data: ClientProject }
  | { kind: "personal"; data: PersonalProject };

export function Projects() {
  const [selected, setSelected] = useState<CardData | null>(null);

  const cards: CardData[] = [
    ...personalProjects.map((p): CardData => ({ kind: "personal", data: p })),
    ...clientProjects.map((p): CardData => ({ kind: "client", data: p })),
  ];

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Selected work"
      description="Enterprise infrastructure engagements and a personal engineering project built end to end. Click a card for the full case study."
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cards.map((card, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <button
              type="button"
              onClick={() => setSelected(card)}
              className="group h-full w-full rounded-2xl border border-border bg-surface/50 p-6 text-left transition-all hover:-translate-y-1 hover:border-cyan/60 sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan">
                  {card.kind === "client" ? `Client · ${card.data.client}` : "Personal Project"}
                </span>
                <ArrowIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-cyan" />
              </div>

              <h3 className="mt-3 text-xl font-semibold text-ink">{card.data.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-dim">
                {card.kind === "client" ? card.data.points[0] : card.data.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {card.data.tech.slice(0, 5).map((t) => (
                  <span key={t} className="rounded-md border border-border-hover px-2 py-1 font-mono text-[11px] text-ink-faint">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal card={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}

function ProjectModal({ card, onClose }: { card: CardData; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={card.data.name}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto scrollbar-thin rounded-2xl border border-border-hover bg-surface p-7 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan">
              {card.kind === "client" ? `Client · ${card.data.client}` : "Personal Project"}
            </span>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{card.data.name}</h3>
            {card.kind === "personal" && <p className="mt-1 text-ink-dim">{card.data.tagline}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-ink-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            ✕
          </button>
        </div>

        {card.kind === "client" ? (
          <>
            <ul className="mt-6 space-y-3">
              {card.data.points.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-cyan" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              {card.data.impact.map((impact) => (
                <p key={impact} className="text-sm font-medium text-gradient">
                  ↳ {impact}
                </p>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm leading-relaxed text-ink-dim">{card.data.description}</p>
            <ul className="mt-6 space-y-3">
              {card.data.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                  <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-cyan" />
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-xs text-ink-faint">{card.data.status}</p>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {card.data.tech.map((t) => (
            <span key={t} className="rounded-md border border-border-hover px-2.5 py-1 font-mono text-[11px] text-ink-faint">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
