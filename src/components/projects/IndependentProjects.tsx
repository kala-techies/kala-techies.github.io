import { Reveal } from "../Reveal";
import { SectionDivider } from "../SectionDivider";
import { personalProjects } from "../../data/profile";

export function IndependentProjects() {
  return (
    <section id="independent-projects" className="relative">
      <SectionDivider from="Professional Engineering" to="Independent Engineering" />
      <div className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
        <Reveal className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">Outside the day job</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {personalProjects.map((project, i) => (
            <Reveal key={project.name} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-border bg-surface/30 p-5 backdrop-blur-md transition-colors hover:border-border-hover">
                <p className="text-sm font-medium text-ink">{project.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-faint">{project.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded border border-border-hover px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[10px] text-ink-faint">{project.status}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
