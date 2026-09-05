// The scroll journey: 16 zones, each a distinct physical space the camera
// travels through. Boundaries are fractions of total scroll (17 values →
// 16 zones); Z values are the camera's world-space depth at each boundary.
export const ZONE_IDS = [
  "identity",
  "pipeline",
  "kubernetes",
  "aks",
  "network",
  "security",
  "servicebus",
  "automation",
  "monitoring",
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
  0, 0.05, 0.14, 0.23, 0.3, 0.37, 0.43, 0.5, 0.59, 0.63, 0.71, 0.77, 0.83, 0.89, 0.94, 0.97, 1.0,
];
export const ZONE_Z = [
  12, 6, -6, -18, -28, -38, -47, -58, -70, -76, -88, -98, -108, -117, -125, -130, -135,
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
 * snapping. Ramps in/out over a small fixed buffer immediately adjacent
 * to the reveal zone's own boundaries — not the full width of the DR/
 * Impact zones on either side, which would eat into their own screen
 * time (DR's failover, in particular, needs its whole zone to play out
 * before the camera pulls back to look at it from a distance). */
export function revealBlend(progress: number, buffer = 0.03): number {
  const idx = REVEAL_ZONE_INDEX;
  const mid0 = ZONE_BOUNDARIES[idx];
  const mid1 = ZONE_BOUNDARIES[idx + 1];
  const start = mid0 - buffer;
  const end = mid1 + buffer;
  if (progress <= start || progress >= end) return 0;
  if (progress < mid0) return (progress - start) / (mid0 - start);
  if (progress > mid1) return 1 - (progress - mid1) / (end - mid1);
  return 1;
}

/** A triangular 0→1→0 bump centered exactly on a zone boundary, for camera
 * flourishes at specific transitions (Kubernetes→AKS pulling back to
 * reveal the Azure envelope, Monitoring→Production leaning into the
 * incident) without introducing a new zone or touching localProgress —
 * this is purely a camera-timing signal. */
export function boundaryBlend(progress: number, boundary: number, rampWidth = 0.035): number {
  const d = Math.abs(progress - boundary);
  if (d >= rampWidth) return 0;
  return 1 - d / rampWidth;
}

export function zoneBoundary(zoneId: ZoneId): number {
  return ZONE_BOUNDARIES[ZONE_IDS.indexOf(zoneId)];
}

// Z-depth of each zone's centerpiece geometry (matches ZONE_Z above so the
// camera is looking roughly at it mid-zone). Production and DR track the
// camera dynamically every frame instead (see HERO_LEAD in Scene.tsx) —
// confirmed live earlier this session to be necessary for a compact,
// off-axis object with a late climax. The wider, spread-out scenes below
// (Kubernetes, Network, Security, etc.) use this simpler static anchor,
// which earlier live verification confirmed renders acceptably across
// their zones; late-triggering beats within them (AKS's node-pool scale-
// in, Kubernetes' 4th node, Pipeline's multiply, Monitoring's signal) are
// timed to complete with plenty of zone left afterward as a conservative
// safety margin, rather than re-anchoring the whole group.
export const Z = {
  pipeline: ZONE_Z[1],
  kubernetes: ZONE_Z[2],
  aks: ZONE_Z[3],
  network: ZONE_Z[4],
  security: ZONE_Z[5],
  servicebus: ZONE_Z[6],
  automation: ZONE_Z[7],
  monitoring: ZONE_Z[8],
  production: ZONE_Z[9],
  dr: ZONE_Z[10],
  impact: ZONE_Z[12],
  recommendations: ZONE_Z[13],
  work: ZONE_Z[14],
  connect: ZONE_Z[15],
};
