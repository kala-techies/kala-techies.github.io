import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { GlassPanel } from "../GlassPanel";
import { recommendations, recognitions } from "../../data/profile";

export function Recognition() {
  return (
    <Section
      id="recognition"
      eyebrow="Recognition"
      title="How the work landed"
      description="A couple of LinkedIn recommendations, and a few notes from colleagues after the fact — kept close to how they were actually written."
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendations.map((rec, i) => (
          <Reveal key={rec.name} delay={i * 0.06}>
            <GlassPanel className="h-full p-7 sm:p-8">
              <QuoteIcon className="h-6 w-6 text-cyan/60" />
              <p className="mt-4 text-[15px] leading-relaxed text-ink-dim">{rec.text}</p>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <p className="font-medium text-ink">{rec.name}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{rec.title}</p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{rec.relationship} · {rec.date}</p>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {recognitions.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.04}>
            <GlassPanel className="h-full p-5">
              <p className="text-sm italic leading-relaxed text-ink-dim">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">{r.context}</p>
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="text-sm font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink-faint">{r.title}</p>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.5 8C6.5 8 4 10.5 4 13.5S6.5 19 9.5 19c1 0 1.8-.3 2.3-.6-.4 1.7-1.9 3-3.8 3.4l.4 1.2c3.3-.6 5.6-3.2 5.6-6.6V13c0-2.8-2.2-5-4.5-5Zm10 0c-3 0-5.5 2.5-5.5 5.5S16.5 19 19.5 19c1 0 1.8-.3 2.3-.6-.4 1.7-1.9 3-3.8 3.4l.4 1.2c3.3-.6 5.6-3.2 5.6-6.6V13c0-2.8-2.2-5-4.5-5Z" />
    </svg>
  );
}
