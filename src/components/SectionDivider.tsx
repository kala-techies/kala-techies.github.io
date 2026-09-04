type Props = {
  from: string;
  to: string;
};

export function SectionDivider({ from, to }: Props) {
  return (
    <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8 lg:px-10">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">{from}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-border-hover via-violet/40 to-border-hover" />
        <span className="font-mono text-xs uppercase tracking-widest text-violet">{to}</span>
      </div>
    </div>
  );
}
