import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { profile } from "../../data/profile";

const STATS = [
  { value: "3+", label: "Years in Cloud & DevOps" },
  { value: "2", label: "Cloud Platforms (Azure · AWS)" },
  { value: "18+", label: "Open-Source Repositories" },
  { value: "4", label: "Enterprise Engagements" },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Infrastructure that stays out of the way"
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          {profile.aboutNarrative.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="leading-relaxed text-ink-dim">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface/60 p-5 transition-colors hover:border-border-hover"
              >
                <p className="text-2xl font-semibold text-gradient">{stat.value}</p>
                <p className="mt-1 text-xs leading-snug text-ink-faint">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
