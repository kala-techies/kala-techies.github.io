import { FocusReveal } from "../FocusReveal";
import { themes } from "../../data/profile";

export function Themes() {
  return (
    <section id="capabilities" className="relative py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <FocusReveal className="mb-20 text-center">
          <p className="font-mono text-sm tracking-widest text-cyan uppercase">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Six worlds, one engineer</h2>
        </FocusReveal>

        <div className="space-y-28 sm:space-y-36">
          {themes.map((theme, i) => (
            <FocusReveal key={theme.id} className="text-center" delay={0.05}>
              <span className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-4xl font-semibold text-ink sm:text-5xl">{theme.label}</h3>
              <p className="mx-auto mt-4 max-w-sm text-ink-dim">{theme.tagline}</p>
            </FocusReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
