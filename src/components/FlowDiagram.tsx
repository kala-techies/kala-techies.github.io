type Props = {
  steps: string[];
  accent?: string;
};

export function FlowDiagram({ steps, accent = "var(--color-cyan)" }: Props) {
  return (
    <div className="scrollbar-thin -mx-1 flex items-stretch gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap sm:overflow-visible">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-shrink-0 items-center gap-2 sm:flex-shrink">
          <div
            className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-border-hover bg-surface-raised/80 px-3 py-2 font-mono text-xs text-ink-dim"
            style={i === steps.length - 1 ? { borderColor: accent, color: accent } : undefined}
          >
            <span className="opacity-50">{String(i + 1).padStart(2, "0")}</span>
            {step}
          </div>
          {i < steps.length - 1 && (
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" className="flex-shrink-0 text-ink-faint" aria-hidden="true">
              <path d="M0 5h15m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
