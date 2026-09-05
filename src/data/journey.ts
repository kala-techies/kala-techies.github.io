// Caption content for the six plain "engineering scene" zones. The other
// five zones (identity, impact, recommendations, work, connect) render
// bespoke layouts in CaptionOverlay/JourneyFallback since they pull from
// richer data (profile, recommendations, recognitions, projects).
export type SceneCaption = {
  id: string;
  eyebrow: string;
  heading: string;
  line: string;
};

export const sceneCaptions: SceneCaption[] = [
  {
    id: "cloud",
    eyebrow: "Scene 02",
    heading: "Cloud",
    line: "Azure and AWS infrastructure, provisioned as code.",
  },
  {
    id: "kubernetes",
    eyebrow: "Scene 03",
    heading: "Kubernetes",
    line: "Operating and upgrading production clusters on AKS.",
  },
  {
    id: "network-security",
    eyebrow: "Scene 04",
    heading: "Network & Security",
    line: "Private endpoints and Key Vault — access with a reason.",
  },
  {
    id: "automation",
    eyebrow: "Scene 05",
    heading: "Automation",
    line: "Manual operations, turned into scripts and validated reports.",
  },
  {
    id: "production",
    eyebrow: "Scene 06",
    heading: "Production & Reliability",
    line: "Monitoring, incident response, recovery.",
  },
  {
    id: "dr",
    eyebrow: "Scene 07",
    heading: "Disaster Recovery",
    line: "Two environments. One failover away from continuity.",
  },
];
