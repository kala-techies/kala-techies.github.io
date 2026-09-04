export function EnvironmentFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-[15%] h-[45vh] w-[45vh] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #4fd1ff 0%, transparent 70%)" }}
      />
      <div className="grid-fade absolute inset-0" />
    </div>
  );
}
