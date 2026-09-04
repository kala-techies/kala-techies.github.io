import { heroTechNodes } from "../../data/profile";

export function HeroVisualFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
      <div
        className="absolute h-[70%] w-[70%] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #4fd1ff 0%, transparent 70%)" }}
      />
      <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-4">
        {heroTechNodes.map((node) => (
          <div
            key={node}
            className="animate-float rounded-xl border border-border-hover bg-surface/70 px-4 py-3 text-center font-mono text-xs text-ink-dim backdrop-blur"
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
