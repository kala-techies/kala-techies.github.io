import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { education } from "../../data/profile";

export function Education() {
  return (
    <Section
      id="education"
      eyebrow="Education"
      title="Academic background"
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {education.map((entry, i) => (
          <Reveal key={entry.institution} delay={i * 0.06}>
            <div className="h-full rounded-xl border border-border bg-surface/50 p-6">
              <p className="font-mono text-xs text-cyan">{entry.period}</p>
              <h3 className="mt-2 font-medium text-ink">{entry.degree}</h3>
              <p className="mt-1 text-sm text-ink-dim">{entry.institution}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
