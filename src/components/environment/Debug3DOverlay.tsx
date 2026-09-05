import { useEffect, useState } from "react";
import { DEBUG_3D, overlayState } from "../../lib/debug3d";

/**
 * Renders the live camera/beat diagnostic as plain text over the scene,
 * only when ?debug3d=1 is present. Polls the plain mutable overlayState
 * object (written by Rig inside the R3F render loop) on a slow interval
 * instead of subscribing to it directly — the diagnostic already logs to
 * the console at the same cadence, this is just a visible copy for
 * on-device checks where the console isn't handy.
 */
export function Debug3DOverlay() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!DEBUG_3D) return;
    const id = setInterval(() => setText(overlayState.lines.join("\n")), 200);
    return () => clearInterval(id);
  }, []);

  if (!DEBUG_3D) return null;

  return (
    <pre
      className="pointer-events-none fixed left-3 top-3 z-50 max-w-[min(90vw,520px)] whitespace-pre-wrap rounded-md bg-black/80 p-3 font-mono text-[11px] leading-tight text-lime-300"
      aria-hidden="true"
    >
      {text || "debug3d: waiting for first frame…"}
    </pre>
  );
}
