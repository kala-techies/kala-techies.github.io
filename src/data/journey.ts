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
    line: "Code becomes a build, becomes a container — then it multiplies.",
  },
  {
    id: "kubernetes",
    eyebrow: "Scene 03",
    heading: "Kubernetes",
    line: "Nodes, pods, and traffic — orchestration, alive.",
  },
  {
    id: "aks",
    eyebrow: "Scene 04",
    heading: "AKS",
    line: "The cluster is Azure infrastructure. Watch it scale.",
  },
  {
    id: "network",
    eyebrow: "Scene 05",
    heading: "Network",
    line: "A gate that lets some traffic through, and stops the rest.",
  },
  {
    id: "security",
    eyebrow: "Scene 06",
    heading: "Security",
    line: "A vault that only answers a request it can verify.",
  },
  {
    id: "servicebus",
    eyebrow: "Scene 07",
    heading: "Messaging",
    line: "Messages in transit — and the ones that need a second look.",
  },
  {
    id: "automation",
    eyebrow: "Scene 08",
    heading: "Automation",
    line: "Manual work, reorganized into one repeatable, validated flow.",
  },
  {
    id: "monitoring",
    eyebrow: "Scene 09",
    heading: "Observability",
    line: "Always watching. The first signal starts here.",
  },
  {
    id: "production",
    eyebrow: "Scene 10",
    heading: "Production",
    line: "Something breaks. It gets found. It gets fixed.",
  },
  {
    id: "dr",
    eyebrow: "Scene 11",
    heading: "Reliability",
    line: "Replicated, then failed over. Recovery, not luck.",
  },
];
