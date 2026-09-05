import type { ScrollProgressRef } from "./useScrollProgress";
import { useZoneStage } from "./useZoneStage";

// Sequential beats of the opening ritual, all inside the "identity" zone's
// own local progress (0 = zone start, 1 = zone end).
// Stage 0 gets extra room before the first line — a beat of silence
// with the bike simply parked, so the visitor has a moment to register
// "where am I" before any dialogue starts.
const STAGE_THRESHOLDS = [0, 0.22, 0.4, 0.58, 0.75, 1.01];

export function useOpeningStage(progressRef: ScrollProgressRef): number {
  return useZoneStage(progressRef, "identity", STAGE_THRESHOLDS);
}
