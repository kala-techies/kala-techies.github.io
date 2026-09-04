import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { GlassPanel } from "../GlassPanel";
import { engineeringMap } from "../../data/profile";

export function EngineeringMap() {
  return (
    <Section
      id="engineering"
      eyebrow="Professional Engineering"
      title="The world I operate in"
      description="Everything below sits inside a single Azure subscription — from policy at the top down to the automation and monitoring that keeps it honest."
      className="border-t border-border"
    >
      <Reveal>
        <GlassPanel className="p-6 sm:p-10">
          <div className="flex flex-col items-center gap-0">
            {engineeringMap.map((tier, tierIndex) => (
              <div key={tier.label} className="flex w-full flex-col items-center">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {tier.nodes.map((node) => (
                    <span
                      key={node}
                      className="rounded-lg border border-border-hover bg-surface-raised/70 px-4 py-2.5 font-mono text-sm text-ink-dim transition-colors hover:border-cyan hover:text-cyan"
                    >
                      {node}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink-faint">{tier.label}</p>
                {tierIndex < engineeringMap.length - 1 && (
                  <div className="my-4 h-8 w-px bg-gradient-to-b from-border-hover to-transparent" />
                )}
              </div>
            ))}
          </div>
        </GlassPanel>
      </Reveal>
    </Section>
  );
}
