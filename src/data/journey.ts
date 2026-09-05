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
    line: "Git keeps the code organized. The pipeline takes it from there — build, test, package, deploy.",
  },
  {
    id: "kubernetes",
    eyebrow: "Scene 03",
    heading: "Kubernetes",
    line: "Containers need somewhere to run — scheduled, connected, and kept alive.",
  },
  {
    id: "aks",
    eyebrow: "Scene 04",
    heading: "AKS",
    line: "Kubernetes is powerful. Running it reliably at scale is a different problem.",
  },
  {
    id: "network",
    eyebrow: "Scene 05",
    heading: "Network",
    line: "Infrastructure isn't useful if everything can talk to everything. Traffic needs rules.",
  },
  {
    id: "security",
    eyebrow: "Scene 06",
    heading: "Security",
    line: "Applications need secrets. They shouldn't need to know where those secrets live.",
  },
  {
    id: "servicebus",
    eyebrow: "Scene 07",
    heading: "Messaging",
    line: "Not everything happens synchronously. Some messages don't make it through cleanly.",
  },
  {
    id: "automation",
    eyebrow: "Scene 08",
    heading: "Automation",
    line: "If I have to do the same operational task repeatedly, I automate it.",
  },
  {
    id: "monitoring",
    eyebrow: "Scene 09",
    heading: "Observability",
    line: "Automation needs awareness — something has to notice when the system changes.",
  },
  {
    id: "production",
    eyebrow: "Scene 10",
    heading: "Production",
    line: "And then production happens. The interesting part isn't preventing every failure — it's knowing how to recover.",
  },
  {
    id: "dr",
    eyebrow: "Scene 11",
    heading: "Reliability",
    line: "Production isn't the only place that needs to survive. Systems need a way back.",
  },
];
