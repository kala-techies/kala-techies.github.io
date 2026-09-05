import { profile, recommendations, recognitions, projects } from "../../data/profile";
import { sceneCaptions } from "../../data/journey";

/**
 * The same journey content as CaptionOverlay, but laid out as a normal,
 * linear, scrollable document — no fixed overlay, no camera, no 3D. Used
 * both visibly (prefers-reduced-motion, no WebGL) and screen-reader-only
 * (so assistive tech gets a coherent read-through of the cinematic mode
 * too, since its real content lives inside a scroll-position-driven fixed
 * overlay that a linear reading order can't otherwise make sense of).
 */
export function JourneyFallback({ visuallyHidden = false }: { visuallyHidden?: boolean }) {
  return (
    <div className={visuallyHidden ? "sr-only" : "relative mx-auto max-w-2xl px-6 py-24 sm:px-8"}>
      <section className="py-16 text-center">
        <p className="font-mono text-sm tracking-[0.3em] text-cyan uppercase">{profile.title}</p>
        <h1 className="mt-4 text-5xl font-semibold text-ink">{profile.name}</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-dim">{profile.positioning}</p>
        <p className="mt-6 font-mono text-xs tracking-widest text-ink-faint">{profile.employers.join("  ·  ")}</p>
      </section>

      {sceneCaptions.map((scene) => (
        <section key={scene.id} className="py-16">
          <p className="font-mono text-xs tracking-widest text-cyan uppercase">{scene.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">{scene.heading}</h2>
          <p className="mt-2 text-ink-dim">{scene.line}</p>
        </section>
      ))}

      <section className="py-16">
        <p className="font-mono text-xs tracking-widest text-amber uppercase">Impact</p>
        <div className="mt-4 space-y-4">
          {recognitions.map((r) => (
            <div key={r.name}>
              <p className="text-ink-dim">{r.work}</p>
              <p className="mt-1 text-sm italic text-ink-faint">&ldquo;{r.quote}&rdquo; — {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <p className="font-mono text-xs tracking-widest text-cyan uppercase">Recommended</p>
        <div className="mt-4 space-y-6">
          {recommendations.map((r) => (
            <div key={r.name}>
              <p className="text-ink-dim">&ldquo;{r.text}&rdquo;</p>
              <p className="mt-1.5 text-sm font-medium text-ink">
                {r.name} <span className="font-normal text-ink-faint">— {r.title}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <p className="font-mono text-xs tracking-widest text-violet uppercase">Selected Work</p>
        <div className="mt-4 space-y-2">
          {projects.map((p) => (
            <p key={p.name} className="text-ink-dim">
              <span className="text-ink">{p.name}</span> — {p.tagline}
            </p>
          ))}
        </div>
      </section>

      <section id="connect" className="py-16">
        <p className="font-mono text-xs tracking-widest text-cyan uppercase">Connect</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-lg">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-ink transition-colors hover:text-cyan">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="text-ink transition-colors hover:text-cyan">
            GitHub
          </a>
          <a href={`mailto:${profile.email}`} className="text-ink transition-colors hover:text-cyan">
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
