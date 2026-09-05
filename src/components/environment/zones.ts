// The scroll journey: 15 zones, each a distinct physical space the camera
// travels through. Boundaries are fractions of total scroll (16 values →
// 15 zones); Z values are the camera's world-space depth at each boundary.
export const ZONE_IDS = [
  "identity",
  "pipeline",
  "cloud",
  "kubernetes",
  "network",
  "security",
  "automation",
  "servicebus",
  "production",
  "dr",
  "reveal",
  "impact",
  "recommendations",
  "work",
  "connect",
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

export const ZONE_BOUNDARIES = [
  0, 0.05, 0.12, 0.23, 0.31, 0.38, 0.47, 0.54, 0.63, 0.71, 0.76, 0.82, 0.89, 0.94, 0.97, 1.0,
];
export const ZONE_Z = [
  12, 6, -2, -12, -22, -30, -38, -46, -54, -64, -76, -84, -90, -96, -100, -104,
];

export const REVEAL_ZONE_INDEX = ZONE_IDS.indexOf("reveal");

function interpolate(progress: number, boundaries: number[], values: number[]): number {
  for (let i = 0; i < boundaries.length - 1; i++) {
    const a = boundaries[i];
    const b = boundaries[i + 1];
    if (progress >= a && progress <= b) {
      const t = b === a ? 0 : (progress - a) / (b - a);
      return values[i] + (values[i + 1] - values[i]) * t;
    }
  }
  return values[values.length - 1];
}

export function cameraZAtProgress(progress: number): number {
  return interpolate(progress, ZONE_BOUNDARIES, ZONE_Z);
}

export function activeZoneAtProgress(progress: number): number {
  for (let i = 0; i < ZONE_BOUNDARIES.length - 1; i++) {
    if (progress >= ZONE_BOUNDARIES[i] && progress < ZONE_BOUNDARIES[i + 1]) return i;
  }
  return ZONE_BOUNDARIES.length - 2;
}

/** 0..1 progress *within* a given zone — drives before/after transformations
 * inside a single scene (chaos → order, healthy → incident → recovered,
 * primary → failover) rather than only reacting to the global scroll
 * fraction. */
export function localProgress(progress: number, zoneId: ZoneId): number {
  const idx = ZONE_IDS.indexOf(zoneId);
  const a = ZONE_BOUNDARIES[idx];
  const b = ZONE_BOUNDARIES[idx + 1];
  if (b === a) return 0;
  return Math.min(1, Math.max(0, (progress - a) / (b - a)));
}

/** Whether progress falls within a given zone (plus a small buffer on
 * either side) — used by scenes that track the camera's z each frame so
 * that tracking only kicks in near their own zone, instead of following
 * the camera for the entire journey and colliding with every other
 * tracked scene. */
export function withinZone(progress: number, zoneId: ZoneId, buffer = 0.02): boolean {
  const idx = ZONE_IDS.indexOf(zoneId);
  return progress >= ZONE_BOUNDARIES[idx] - buffer && progress <= ZONE_BOUNDARIES[idx + 1] + buffer;
}

/** How "inside" the reveal zone we are, 0→1→0, used to blend the camera
 * into an elevated pull-back view and back out smoothly rather than
 * snapping. */
export function revealBlend(progress: number): number {
  const idx = REVEAL_ZONE_INDEX;
  const start = ZONE_BOUNDARIES[idx - 1];
  const mid0 = ZONE_BOUNDARIES[idx];
  const mid1 = ZONE_BOUNDARIES[idx + 1];
  const end = ZONE_BOUNDARIES[idx + 2];
  if (progress <= start || progress >= end) return 0;
  if (progress < mid0) return (progress - start) / (mid0 - start);
  if (progress > mid1) return 1 - (progress - mid1) / (end - mid1);
  return 1;
}

// Z-depth of each zone's centerpiece geometry (matches ZONE_Z above so the
// camera is looking roughly at it mid-zone).
export const Z = {
  pipeline: ZONE_Z[1],
  cloud: ZONE_Z[2],
  kubernetes: ZONE_Z[3],
  network: ZONE_Z[4],
  security: ZONE_Z[5],
  automation: ZONE_Z[6],
  servicebus: ZONE_Z[7],
  production: ZONE_Z[8],
  dr: ZONE_Z[9],
  impact: ZONE_Z[11],
  recommendations: ZONE_Z[12],
  work: ZONE_Z[13],
  connect: ZONE_Z[14],
};
