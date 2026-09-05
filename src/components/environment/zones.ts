// The scroll journey: 11 zones, each a distinct physical space the camera
// dollies through. Boundaries are fractions of total scroll (12 values →
// 11 zones); Z values are the camera's world-space depth at each boundary.
export const ZONE_IDS = [
  "identity",
  "cloud",
  "kubernetes",
  "network-security",
  "automation",
  "production",
  "dr",
  "impact",
  "recommendations",
  "work",
  "connect",
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

export const ZONE_BOUNDARIES = [0, 0.08, 0.18, 0.3, 0.42, 0.52, 0.62, 0.72, 0.8, 0.88, 0.95, 1.0];
export const ZONE_Z = [10, 4, -4, -14, -22, -30, -38, -46, -54, -60, -66, -72];

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

// Z-depth of each zone's centerpiece geometry (matches ZONE_Z above so the
// camera is looking straight at it mid-zone).
export const Z = {
  cloud: ZONE_Z[1],
  kubernetes: ZONE_Z[2],
  networkSecurity: ZONE_Z[3],
  automation: ZONE_Z[4],
  production: ZONE_Z[5],
  drPrimary: ZONE_Z[6] + 3,
  drSecondary: ZONE_Z[6] - 3,
  impact: ZONE_Z[7],
  recommendations: ZONE_Z[8],
  work: ZONE_Z[9],
  connect: ZONE_Z[10],
};
