import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { experience } from "../../data/profile";

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've built this" className="border-t border-border">
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-border sm:block" />
        <div className="space-y-8">
          {experience.map((entry, i) => (
            <Reveal key={entry.company} delay={i * 0.05}>
              <div className="relative sm:pl-10">
                <span className="absolute left-0 top-1.5 hidden h-3.5 w-3.5 rounded-full border-2 border-cyan bg-void sm:block" />
                <div className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-md transition-colors hover:border-border-hover sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="text-lg font-semibold text-ink">{entry.role}</h3>
                    <span className="font-mono text-xs text-cyan">{entry.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-dim">{entry.company} · {entry.location}</p>

                  <ul className="mt-4 space-y-2">
                    {entry.highlights.map((h, idx) => (
                      <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-ink-faint" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
