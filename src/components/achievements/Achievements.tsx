import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { achievements } from "../../data/profile";

export function Achievements() {
  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Recognition & impact"
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.05}>
            <div className="flex gap-4 rounded-xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-hover">
              <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber/40 text-amber">
                <TrophyIcon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-medium text-ink">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{a.detail}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a2 2 0 0 0 0 4h2M16 5h3a2 2 0 0 1 0 4h-2" />
      <path d="M12 12v3M9 20h6M9.5 20c0-1.8.7-2.5 2.5-2.5s2.5.7 2.5 2.5" strokeLinecap="round" />
    </svg>
  );
}
