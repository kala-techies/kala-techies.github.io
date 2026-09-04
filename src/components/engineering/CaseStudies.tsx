import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { GlassPanel } from "../GlassPanel";
import { FlowDiagram } from "../FlowDiagram";
import { caseStudies, type CaseStudy } from "../../data/profile";

export function CaseStudies() {
  const [selected, setSelected] = useState<CaseStudy | null>(null);

  return (
    <Section
      id="case-studies"
      eyebrow="Engineering Case Studies"
      title="How the work actually goes"
      description="Not a skills list — the real sequence of steps behind cluster upgrades, network fixes, and production incidents. Click a card for the full walk-through."
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {caseStudies.map((cs, i) => (
          <Reveal key={cs.id} delay={i * 0.05}>
            <GlassPanel
              as="article"
              className="group h-full cursor-pointer p-6 transition-all hover:-translate-y-1 hover:border-cyan/40 sm:p-7"
            >
              <button type="button" onClick={() => setSelected(cs)} className="block w-full text-left">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan">{cs.category}</span>
                  <ArrowIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-cyan" />
                </div>
                <h3 className="mt-3 text-xl font-semibold text-ink">{cs.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{cs.summary}</p>
                <div className="mt-5">
                  <FlowDiagram steps={cs.flow} />
                </div>
                {cs.groundedIn && (
                  <p className="mt-4 font-mono text-[11px] text-ink-faint">Grounded in: {cs.groundedIn}</p>
                )}
              </button>
            </GlassPanel>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {selected && <CaseStudyModal caseStudy={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}

function CaseStudyModal({ caseStudy, onClose }: { caseStudy: CaseStudy; onClose: () => void }) {
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
        aria-label={caseStudy.title}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22 }}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto scrollbar-thin rounded-2xl border border-border-hover bg-surface p-7 sm:p-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan">{caseStudy.category}</span>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{caseStudy.title}</h3>
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

        <p className="mt-4 text-sm leading-relaxed text-ink-dim">{caseStudy.summary}</p>

        <div className="mt-6">
          <FlowDiagram steps={caseStudy.flow} />
        </div>

        <ul className="mt-6 space-y-3">
          {caseStudy.detail.map((point, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-cyan" />
              {point}
            </li>
          ))}
        </ul>

        {caseStudy.groundedIn && (
          <p className="mt-6 font-mono text-xs text-ink-faint">Grounded in: {caseStudy.groundedIn}</p>
        )}
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
