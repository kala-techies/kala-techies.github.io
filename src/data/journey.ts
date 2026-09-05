// Caption content for the plain "world" zones. Identity, reveal, impact,
// recommendations, work, and connect render bespoke layouts in
// CaptionOverlay/JourneyFallback since they pull from richer data.
export type SceneCaption = {
  id: string;
  eyebrow: string;
  heading: string;
  line: string;
  /** Optional finer-grained sequence within this zone's own local
   * progress (0-1) — "one sentence, pause, one sentence" instead of one
   * static block sitting on screen for the whole zone. `at` thresholds
   * must be ascending starting at 0; falls back to heading/line above
   * when absent. Driven by useZoneStage, not this array's shape. */
  beats?: { at: number; eyebrow?: string; heading?: string; line: string }[];
};

export const sceneCaptions: SceneCaption[] = [
  {
    id: "pipeline",
    eyebrow: "Scene 02",
    heading: "Pipeline",
    line: "Git keeps the code organized. The pipeline takes it from there — build, test, package, deploy.",
    beats: [
      { at: 0, heading: "Git", line: "Everything starts with code." },
      { at: 0.14, heading: "Git", line: "And every change needs a history." },
      { at: 0.32, heading: "CI/CD", line: "Once the code changes, the pipeline takes over." },
      { at: 0.48, heading: "CI/CD", line: "Build. Test. Package. Deploy." },
      { at: 0.62, heading: "Terraform", line: "But software needs somewhere to run." },
      { at: 0.74, heading: "Terraform", line: "I define the infrastructure. Terraform builds it." },
      { at: 0.87, heading: "Azure", line: "This is where most of my professional engineering work happens." },
    ],
  },
  {
    id: "kubernetes",
    eyebrow: "Scene 03",
    heading: "Kubernetes",
    line: "Containers need somewhere to run — scheduled, connected, and kept alive.",
    beats: [
      { at: 0, heading: "Containers", line: "Now we need to run what we just built." },
      { at: 0.07, heading: "Containers", line: "So I package the application into containers." },
      { at: 0.14, heading: "Containers", line: "One container is easy." },
      { at: 0.2, heading: "Containers", line: "Now imagine hundreds." },
      { at: 0.27, heading: "Kubernetes", line: "Someone has to orchestrate them." },
      { at: 0.34, heading: "Kubernetes", line: "That's Kubernetes." },
      { at: 0.46, heading: "Kubernetes", line: "And the cluster has to adapt." },
    ],
  },
  {
    id: "aks",
    eyebrow: "Scene 04",
    heading: "AKS",
    line: "Kubernetes is powerful. Running it reliably at scale is a different problem.",
    beats: [
      { at: 0, heading: "AKS", line: "Now let's operate it at cloud scale." },
      { at: 0.15, heading: "AKS", line: "This is AKS." },
      { at: 0.35, heading: "AKS", line: "When demand changes, infrastructure has to change with it." },
    ],
  },
  {
    id: "network",
    eyebrow: "Scene 05",
    heading: "Network",
    line: "Infrastructure isn't useful if everything can talk to everything. Traffic needs rules.",
    beats: [
      { at: 0, heading: "Network", line: "Now we need to control how everything talks." },
      { at: 0.08, heading: "Network", line: "Inside the network, workloads still need boundaries." },
      { at: 0.15, heading: "Load Balancer", line: "Traffic doesn't need to know which instance is waiting for it." },
      { at: 0.3, heading: "NSG", line: "But not everything should be allowed through." },
      { at: 0.55, heading: "Private Endpoint", line: "Some services need a private path." },
    ],
  },
  {
    id: "security",
    eyebrow: "Scene 06",
    heading: "Security",
    line: "Applications need secrets. They shouldn't need to know where those secrets live.",
    beats: [
      { at: 0, heading: "Security", line: "Applications need secrets." },
      { at: 0.25, heading: "Key Vault", line: "They shouldn't need to know where those secrets live." },
    ],
  },
  {
    id: "servicebus",
    eyebrow: "Scene 07",
    heading: "Messaging",
    line: "Not everything happens synchronously. Some messages don't make it through cleanly.",
    beats: [
      { at: 0, heading: "Messaging", line: "Not every system should wait for the other side." },
      { at: 0.12, heading: "Messaging", line: "Sometimes we just send a message." },
      { at: 0.22, heading: "Topic", line: "One event can reach many consumers." },
      { at: 0.5, heading: "Dead Letters", line: "And sometimes messages fail." },
      { at: 0.75, heading: "Dead Letters", line: "That's when the dead letters start piling up." },
    ],
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
