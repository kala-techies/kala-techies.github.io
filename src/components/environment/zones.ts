import { themes } from "../../data/profile";

// One scroll-driven journey: hero → experience → the six capability
// "worlds" → recognition (glass moment) → projects (quieter, secondary) → contact.
export const ZONE_BOUNDARIES = [0, 0.1, 0.32, 0.66, 0.8, 0.9, 1.0];
export const ZONE_Z = [8, 3, -6, -30, -40, -47, -52];

export function cameraZAtProgress(progress: number): number {
  for (let i = 0; i < ZONE_BOUNDARIES.length - 1; i++) {
    const a = ZONE_BOUNDARIES[i];
    const b = ZONE_BOUNDARIES[i + 1];
    if (progress >= a && progress <= b) {
      const t = b === a ? 0 : (progress - a) / (b - a);
      return ZONE_Z[i] + (ZONE_Z[i + 1] - ZONE_Z[i]) * t;
    }
  }
  return ZONE_Z[ZONE_Z.length - 1];
}

export function activeZoneAtProgress(progress: number): number {
  for (let i = 0; i < ZONE_BOUNDARIES.length - 1; i++) {
    if (progress >= ZONE_BOUNDARIES[i] && progress < ZONE_BOUNDARIES[i + 1]) return i;
  }
  return ZONE_BOUNDARIES.length - 2;
}

export const HERO_Z = 8;
export const EXPERIENCE_Z = -6;

// The six theme forms are spaced along the "capabilities" stretch of the
// journey (zone index 2, progress 0.32–0.66).
export const THEME_Z_START = -10;
export const THEME_Z_SPACING = 5.5;
export const THEME_Z = themes.map((_, i) => THEME_Z_START - i * THEME_Z_SPACING);

export const RECOGNITION_Z = -40;
export const PROJECTS_Z = -47;
export const END_Z = -54;
