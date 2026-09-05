import { AnimatePresence, motion } from "framer-motion";
import { profile, recommendations, recognitions, projects } from "../../data/profile";
import { sceneCaptions } from "../../data/journey";

const textShadow = "0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)";

export function CaptionOverlay({ zone }: { zone: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-end px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
      <AnimatePresence>
        <motion.div
          key={zone}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, position: "absolute" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
          style={{ textShadow }}
        >
          {zone === 0 && <IdentityCaption />}
          {zone >= 1 && zone <= 9 && <SceneCaption index={zone - 1} />}
          {zone === 10 && <RevealCaption />}
          {zone === 11 && <ImpactCaption />}
          {zone === 12 && <RecommendationsCaption />}
          {zone === 13 && <WorkCaption />}
          {zone === 14 && <ConnectCaption />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IdentityCaption() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-sm tracking-[0.3em] text-cyan uppercase">{profile.title}</p>
      <h1 className="mt-4 text-5xl font-semibold text-ink sm:text-6xl lg:text-7xl">{profile.name}</h1>
      <p className="mx-auto mt-5 max-w-md text-lg text-ink-dim">{profile.positioning}</p>
      <p className="mt-6 font-mono text-xs tracking-widest text-ink-faint">
        {profile.employers.join("  ·  ")}
      </p>
    </div>
  );
}

function SceneCaption({ index }: { index: number }) {
  const scene = sceneCaptions[index];
  return (
    <div className="max-w-md">
      <p className="font-mono text-xs tracking-widest text-cyan uppercase">{scene.eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold text-ink sm:text-4xl">{scene.heading}</h2>
      <p className="mt-2 text-ink-dim">{scene.line}</p>
    </div>
  );
}

function RevealCaption() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="font-mono text-xs tracking-widest text-cyan uppercase">One system</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Everything you just walked through is connected.</h2>
    </div>
  );
}

function ImpactCaption() {
  return (
    <div className="max-w-md">
      <p className="font-mono text-xs tracking-widest text-amber uppercase">Impact</p>
      <div className="mt-3 space-y-4">
        {recognitions.map((r) => (
          <div key={r.name}>
            <p className="text-ink-dim">{r.work}</p>
            <p className="mt-1 text-sm italic text-ink-faint">&ldquo;{r.quote}&rdquo; — {r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsCaption() {
  return (
    <div className="max-w-lg">
      <p className="font-mono text-xs tracking-widest text-cyan uppercase">Recommended</p>
      <div className="mt-3 space-y-5">
        {recommendations.map((r) => (
          <div key={r.name}>
            <p className="text-ink-dim">&ldquo;{r.text}&rdquo;</p>
            <p className="mt-1.5 text-sm font-medium text-ink">{r.name} <span className="font-normal text-ink-faint">— {r.title}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkCaption() {
  return (
    <div className="max-w-md">
      <p className="font-mono text-xs tracking-widest text-violet uppercase">Selected Work</p>
      <div className="mt-3 space-y-2">
        {projects.map((p) => (
          <p key={p.name} className="text-ink-dim">
            <span className="text-ink">{p.name}</span> — {p.tagline}
          </p>
        ))}
      </div>
    </div>
  );
}

function ConnectCaption() {
  return (
    <div className="pointer-events-auto max-w-md">
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
    </div>
  );
}
