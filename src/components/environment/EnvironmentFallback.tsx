export function EnvironmentFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-[10%] h-[50vh] w-[50vh] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #4fd1ff 0%, transparent 70%)" }}
      />
      <div
        className="absolute right-[10%] top-[55%] h-[40vh] w-[40vh] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b7cf6 0%, transparent 70%)" }}
      />
      <div
        className="absolute left-[8%] top-[85%] h-[35vh] w-[35vh] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #f5b642 0%, transparent 70%)" }}
      />
      <div className="grid-fade absolute inset-0" />
    </div>
  );
}
