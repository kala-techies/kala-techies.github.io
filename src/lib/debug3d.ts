import type * as THREE from "three";

/**
 * Runtime camera/scene diagnostic, enabled only via ?debug3d=1. Exists to
 * answer one question with actual numbers instead of hand-derived
 * geometry: when a scroll-driven beat becomes visually important, is its
 * geometry actually in front of the camera and within a useful viewing
 * distance? A dot-product derivation on paper already produced one wrong
 * answer this project (contradicted by direct observation) — this module
 * measures the real camera/object transforms at the moment that matters,
 * instead of re-deriving them by hand.
 *
 * Zero cost for real visitors: every write in this module is gated on
 * DEBUG_3D, computed once from the URL at load time.
 */
export const DEBUG_3D =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug3d") === "1";

export type BeatId =
  | "pipelineMultiply"
  | "kubernetesFourthNode"
  | "aksNodePool"
  | "networkNsgSplit"
  | "networkLoadBalancer"
  | "networkPrivateEndpoint"
  | "securityKeyVault"
  | "serviceBusFanout"
  | "serviceBusDeadLetter"
  | "serviceBusToAutomation"
  | "automationActivation"
  | "automationReport"
  | "monitoringAnomaly"
  | "monitoringSignal"
  | "productionIncident"
  | "productionResponse"
  | "drSecondaryReveal"
  | "drFailover"
  | "drStabilization"
  | "revealTransition"
  | "impactMarker1"
  | "impactMarker2"
  | "recommendationMarker1"
  | "recommendationMarker2"
  | "recommendationMarker3"
  | "identityReveal";

export interface BeatMeta {
  label: string;
  zone: string;
  /** local progress (0-1) within the zone where the beat starts animating */
  triggerProgress: number;
  /** local progress (0-1) within the zone where the beat is most visually important — this is the moment that must be in front of the camera */
  peakProgress: number;
}

// Trigger/peak values below reflect the fixes made after live measurement
// with ?debug3d=1 (see commit history for the actual failing readings —
// every one of the first five was measured BEHIND the camera at its old
// peakProgress before these fixes). Re-verify with the same tool after
// touching any of these five beats again.
export const BEAT_META: Record<BeatId, BeatMeta> = {
  pipelineMultiply: { label: "Pipeline container multiply", zone: "pipeline", triggerProgress: 0.1, peakProgress: 0.35 },
  kubernetesFourthNode: { label: "Kubernetes 4th node scale-in", zone: "kubernetes", triggerProgress: 0.05, peakProgress: 0.3 },
  aksNodePool: { label: "AKS 3rd node-pool scale-in", zone: "aks", triggerProgress: 0.1, peakProgress: 0.4 },
  networkNsgSplit: { label: "Network NSG accept/reject split", zone: "network", triggerProgress: 0, peakProgress: 0.3 },
  networkLoadBalancer: { label: "Network load balancer split", zone: "network", triggerProgress: 0, peakProgress: 0.15 },
  networkPrivateEndpoint: { label: "Network private endpoint tunnel", zone: "network", triggerProgress: 0, peakProgress: 0.08 },
  securityKeyVault: { label: "Security Key Vault secret retrieval", zone: "security", triggerProgress: 0.1, peakProgress: 0.3 },
  serviceBusFanout: { label: "Service Bus topic fan-out", zone: "servicebus", triggerProgress: 0.1, peakProgress: 0.22 },
  serviceBusDeadLetter: { label: "Service Bus dead-letter accumulation", zone: "servicebus", triggerProgress: 0.02, peakProgress: 0.15 },
  serviceBusToAutomation: { label: "Service Bus -> Automation handoff", zone: "automation", triggerProgress: 0, peakProgress: 0.04 },
  automationActivation: { label: "Automation gate activation", zone: "automation", triggerProgress: 0.05, peakProgress: 0.15 },
  automationReport: { label: "Automation report card (act 3)", zone: "automation", triggerProgress: 0.75, peakProgress: 0.9 },
  monitoringAnomaly: { label: "Monitoring anomaly detected", zone: "monitoring", triggerProgress: 0.05, peakProgress: 0.25 },
  monitoringSignal: { label: "Monitoring alert signal", zone: "monitoring", triggerProgress: 0.35, peakProgress: 0.85 },
  productionIncident: { label: "Production incident peak", zone: "production", triggerProgress: 0.25, peakProgress: 0.5 },
  productionResponse: { label: "Production incident response", zone: "production", triggerProgress: 0.55, peakProgress: 0.65 },
  drSecondaryReveal: { label: "DR secondary environment reveal", zone: "dr", triggerProgress: 0.15, peakProgress: 0.3 },
  drFailover: { label: "DR failover event", zone: "dr", triggerProgress: 0.35, peakProgress: 0.5 },
  drStabilization: { label: "DR recovery stabilization", zone: "dr", triggerProgress: 0.5, peakProgress: 0.55 },
  revealTransition: { label: "Reveal: environment calms", zone: "reveal", triggerProgress: 0, peakProgress: 0.1 },
  impactMarker1: { label: "Impact marker 1 (Renan)", zone: "impact", triggerProgress: 0, peakProgress: 0.15 },
  impactMarker2: { label: "Impact marker 2 (Manjunath)", zone: "impact", triggerProgress: 0.2, peakProgress: 0.3 },
  recommendationMarker1: { label: "Recommendation marker 1 (Ana)", zone: "recommendations", triggerProgress: 0, peakProgress: 0.12 },
  recommendationMarker2: { label: "Recommendation marker 2 (Deiva)", zone: "recommendations", triggerProgress: 0.35, peakProgress: 0.45 },
  recommendationMarker3: { label: "Recommendation marker 3 (placeholder)", zone: "recommendations", triggerProgress: 0.6, peakProgress: 0.7 },
  identityReveal: { label: "Identity reveal (Kala)", zone: "recommendations", triggerProgress: 0.85, peakProgress: 0.92 },
};

export const BEAT_ORDER: BeatId[] = [
  "pipelineMultiply",
  "kubernetesFourthNode",
  "aksNodePool",
  "networkNsgSplit",
  "networkLoadBalancer",
  "networkPrivateEndpoint",
  "securityKeyVault",
  "serviceBusFanout",
  "serviceBusDeadLetter",
  "serviceBusToAutomation",
  "automationActivation",
  "automationReport",
  "monitoringAnomaly",
  "monitoringSignal",
  "productionIncident",
  "productionResponse",
  "drSecondaryReveal",
  "drFailover",
  "drStabilization",
  "revealTransition",
  "impactMarker1",
  "impactMarker2",
  "recommendationMarker1",
  "recommendationMarker2",
  "recommendationMarker3",
  "identityReveal",
];

interface BeatSample {
  worldPos: THREE.Vector3;
  zoneLocalProgress: number;
}

// Written by each scene's own useFrame (only while DEBUG_3D), read by Rig's
// diagnostic pass once per frame. Plain mutable object, not React state —
// this runs at frame rate and must not trigger re-renders.
export const beatSamples: Partial<Record<BeatId, BeatSample>> = {};

export function recordBeat(id: BeatId, worldPos: THREE.Vector3, zoneLocalProgress: number): void {
  if (!DEBUG_3D) return;
  const existing = beatSamples[id];
  if (existing) {
    existing.worldPos.copy(worldPos);
    existing.zoneLocalProgress = zoneLocalProgress;
  } else {
    beatSamples[id] = { worldPos: worldPos.clone(), zoneLocalProgress };
  }
}

export interface BeatReading {
  id: BeatId;
  label: string;
  zone: string;
  zoneLocalProgress: number;
  triggerProgress: number;
  peakProgress: number;
  atPeak: boolean;
  distance: number;
  dot: number;
  angleDeg: number;
  front: boolean;
  withinFov: boolean;
}

// Overlay text, refreshed by Rig at a throttled rate. Read by a plain DOM
// component polling on an interval — decoupled from the R3F render loop
// so the overlay never forces a React re-render at frame rate.
export const overlayState = {
  lines: [] as string[],
};
