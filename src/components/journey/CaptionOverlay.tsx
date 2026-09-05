import { AnimatePresence, motion } from "framer-motion";
import { profile, recommendations, recognitions, projects } from "../../data/profile";
import { sceneCaptions } from "../../data/journey";
import { useOpeningStage } from "../../hooks/useOpeningStage";
import type { ScrollProgressRef } from "../../hooks/useScrollProgress";

const textShadow = "0 2px 24px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)";

export function CaptionOverlay({ zone, progressRef }: { zone: number; progressRef: ScrollProgressRef }) {
  const openingStage = useOpeningStage(progressRef);
  // The opening ritual (parked bike -> "hop on" -> engine start -> name)
  // has its own finer-grained key than the zone itself, so each line gets
  // its own enter/exit rather than the whole zone-0 block just sitting
  // there while the stage changes underneath it.
  const key = zone === 0 ? `opening-${openingStage}` : zone;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-end px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16">
      <AnimatePresence>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10, position: "absolute" }}
          transition={{ duration: zone === 0 ? 1.1 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
          style={{ textShadow }}
        >
          {zone === 0 && <OpeningCaption stage={openingStage} />}
          {zone >= 1 && zone <= 10 && <SceneCaption index={zone - 1} />}
          {zone === 11 && <RevealCaption />}
          {zone === 12 && <ImpactCaption />}
          {zone === 13 && <RecommendationsCaption />}
          {zone === 14 && <WorkCaption />}
          {zone === 15 && <ConnectCaption />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// The opening ritual: a few short lines before the ride starts, then the
// engineer's name arrives as the payoff of "hop on" rather than the
// immediate landing content. Kept deliberately sparse — this isn't a
// video game, the environment (bike, engine, headlight) carries most of
// the beat, not dialogue.
const OPENING_LINES = ["Hey.", "Thanks for taking the time to be here.", "Hop on.", "I'll show you around."];

function OpeningCaption({ stage }: { stage: number }) {
  if (stage < OPENING_LINES.length) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-2xl font-medium text-ink sm:text-3xl">{OPENING_LINES[stage]}</p>
      </div>
    );
  }
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
      <p className="font-mono text-xs tracking-widest text-cyan uppercase">That's the stack</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
        The technology is only half the story — the real work is keeping all of it working together.
      </h2>
    </div>
  );
}

function ImpactCaption() {
  return (
    <div className="max-w-md">
      <p className="font-mono text-xs tracking-widest text-amber uppercase">What people noticed</p>
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
      <p className="font-mono text-xs tracking-widest text-violet uppercase">When I'm not on the clock</p>
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
    <div className="pointer-events-auto mx-auto max-w-md text-center">
      <p className="text-xl font-medium text-ink">Thanks for coming along.</p>
      <p className="mt-2 text-ink-dim">If you'd like to build something together, let's talk.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg">
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
