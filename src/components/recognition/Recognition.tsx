import { Section } from "../Section";
import { FocusReveal } from "../FocusReveal";
import { GlassPanel } from "../GlassPanel";
import { recommendations, recognitions } from "../../data/profile";

export function Recognition() {
  return (
    <Section id="recognition" eyebrow="Recognition" title="How the work landed" className="border-t border-border">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {recommendations.map((rec, i) => (
          <FocusReveal key={rec.name} delay={i * 0.08}>
            <GlassPanel className="h-full p-7 sm:p-8">
              <p className="text-[15px] leading-relaxed text-ink-dim">&ldquo;{rec.text}&rdquo;</p>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <p className="font-medium text-ink">{rec.name}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{rec.title} · {rec.relationship}</p>
              </div>
            </GlassPanel>
          </FocusReveal>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {recognitions.map((r) => (
          <div key={r.name} className="rounded-xl border border-border bg-surface/30 p-5 backdrop-blur-md">
            <p className="text-sm leading-relaxed text-ink-dim">{r.did}</p>
            <p className="mt-3 text-xs italic text-ink-faint">&ldquo;{r.quote}&rdquo;</p>
            <p className="mt-2 text-xs font-medium text-ink">{r.name} · {r.title}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
