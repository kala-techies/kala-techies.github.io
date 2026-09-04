import { engineeringMap, heroTechNodes, personalProjects } from "../../data/profile";

export const ZONE_BOUNDARIES = [0, 0.1, 0.44, 0.6, 0.78, 1.0];
export const ZONE_Z = [6, 2, -14, -24, -34, -42];

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

export const HERO_CLUSTER = { z: 0, radius: 2.6, labels: heroTechNodes };

export const ENGINEERING_CLUSTER = {
  z: -14,
  tierSizes: engineeringMap.map((t) => t.nodes.length),
  labels: engineeringMap.flatMap((t) => t.nodes),
  tierNames: engineeringMap.map((t) => t.label),
};

export const RECOGNITION_CLUSTER = { z: -24 };

export const PERSONAL_CLUSTER = {
  z: -34,
  radius: 1.4,
  labels: personalProjects.map((p) => p.name),
};

export const END_CLUSTER = { z: -42 };
