// Caption content for the plain "world" zones. Identity, reveal, impact,
// recommendations, work, and connect render bespoke layouts in
// CaptionOverlay/JourneyFallback since they pull from richer data.
export type SceneCaption = {
  id: string;
  eyebrow: string;
  heading: string;
  line: string;
};

export const sceneCaptions: SceneCaption[] = [
  {
    id: "pipeline",
    eyebrow: "Scene 02",
    heading: "Pipeline",
    line: "Code becomes a build, becomes an image, becomes a deployment.",
  },
  {
    id: "cloud",
    eyebrow: "Scene 03",
    heading: "Cloud",
    line: "Azure and AWS infrastructure, provisioned as code.",
  },
  {
    id: "kubernetes",
    eyebrow: "Scene 04",
    heading: "Kubernetes",
    line: "Nodes, pods, and a cluster that scales under load.",
  },
  {
    id: "network",
    eyebrow: "Scene 05",
    heading: "Network",
    line: "VNet to subnet to private endpoint — a path, not a shortcut.",
  },
  {
    id: "security",
    eyebrow: "Scene 06",
    heading: "Security",
    line: "A vault that only answers a request it can verify.",
  },
  {
    id: "automation",
    eyebrow: "Scene 07",
    heading: "Automation",
    line: "The same task, done once, instead of every time.",
  },
  {
    id: "servicebus",
    eyebrow: "Scene 08",
    heading: "Messaging",
    line: "Messages in transit — and the ones that need a second look.",
  },
  {
    id: "production",
    eyebrow: "Scene 09",
    heading: "Production",
    line: "Something breaks. It gets found. It gets fixed.",
  },
  {
    id: "dr",
    eyebrow: "Scene 10",
    heading: "Reliability",
    line: "When primary fails, traffic already knows where to go.",
  },
];
