/**
 * The recurring visual anchor: a tilted, translucent plane suggesting the
 * visitor is standing on glass with the environment continuing beneath
 * it. Pure CSS (perspective + rotateX), so it costs nothing extra on top
 * of the WebGL scene and still renders (statically) in the no-3D fallback.
 */
export function GlassFloor() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 -z-[5] h-[55vh] overflow-hidden"
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-[-20%] bottom-[-30%] h-[140%]"
        style={{
          transform: "rotateX(62deg)",
          background:
            "linear-gradient(to top, rgba(79,209,255,0.05) 0%, rgba(79,209,255,0.02) 35%, transparent 75%)",
          borderTop: "1px solid rgba(79,209,255,0.12)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to top, black 0%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 80%)",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent" />
    </div>
  );
}
