export const profile = {
  name: "Kalandar",
  fullName: "Shaik Kalandar",
  title: "Cloud & DevOps Engineer",
  positioning: "Building, operating, and automating reliable Azure and AWS infrastructure.",
  location: "Bangalore, India",
  email: "shaik.kalandar20@gmail.com",
  phone: "+91-8519992634",
  github: "https://github.com/kala-techies",
  linkedin: "https://www.linkedin.com/in/shaik-kalandar",
  resumeDocx: "/resume/Shaik-Kalandar-Resume.docx",
  stats: [
    { value: "3+", label: "years in cloud & DevOps" },
    { value: "4", label: "enterprise engagements" },
    { value: "18+", label: "open-source repos" },
  ],
};

// The six worlds the scroll journey moves through. Kept deliberately to
// one sentence each — the 3D environment carries the weight, not prose.
export type Theme = {
  id: string;
  label: string;
  tagline: string;
};

export const themes: Theme[] = [
  { id: "cloud", label: "Cloud", tagline: "Azure and AWS infrastructure, provisioned as code." },
  { id: "containers", label: "Containers", tagline: "Operating and upgrading production Kubernetes on AKS." },
  { id: "automation", label: "Automation", tagline: "Turning repetitive operations into PowerShell and Python." },
  { id: "security", label: "Security", tagline: "Key Vault, RBAC, and policy-driven governance." },
  { id: "reliability", label: "Reliability", tagline: "Monitoring, incident response, and disaster-recovery design." },
  { id: "engineering", label: "Engineering", tagline: "Troubleshooting, RCA, and continuous improvement." },
];

export type ExperienceEntry = {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "CloudOps Engineer",
    company: "AB InBev",
    location: "Bangalore",
    period: "Jul 2025 – Present",
    highlights: [
      "Reduced manual provisioning effort 60% with Terraform-driven Azure environments.",
      "Cut deployment errors 40% through reusable pipeline modules.",
      "Operate and upgrade production AKS clusters, networking, and Key Vault access.",
    ],
  },
  {
    role: "DevOps Engineer",
    company: "Daimler Trucks Innovation Center India",
    location: "Bangalore",
    period: "Feb 2025 – Jul 2025",
    highlights: [
      "Built CI/CD for a monorepo, with security gates (Snyk, SonarQube, BlackDuck) on every pipeline.",
      "Migrated services from Azure Web Apps to AKS for scalability.",
    ],
  },
  {
    role: "Product Specialist — DevOps & Cloud",
    company: "Cognizant",
    location: "Bangalore",
    period: "May 2022 – Feb 2024",
    highlights: [
      "Built hub-and-spoke AWS network architecture across enterprise client environments.",
      "Automated compliance audit reporting, cutting manual tracking 40%.",
    ],
  },
  {
    role: "IT Support Associate",
    company: "ICICI Bank",
    location: "Hyderabad",
    period: "Dec 2018 – 2019",
    highlights: ["L1 support and foundational infrastructure operations."],
  },
];

export type Recommendation = {
  name: string;
  title: string;
  relationship: string;
  text: string;
};

// From LinkedIn — Deiva and Ana specifically, trimmed to their most
// relevant sentences without changing meaning.
export const recommendations: Recommendation[] = [
  {
    name: "Ana Paula Malta",
    title: "Senior Project & Product Manager",
    relationship: "Managed Kalandar directly at AB InBev",
    text: "A committed professional, always looking to learn something that goes beyond his role. He automated processes for efficiency gains and was responsible for more than 50% of the Azure services configuration, ensuring SLA compliance throughout. A proactive professional with a sense of ownership, always willing to help.",
  },
  {
    name: "Deiva Ganesh",
    title: "Client Partner, Healthcare & Life Sciences",
    relationship: "Senior colleague",
    text: "Kalandar worked as an Azure Admin during the IUHP pilot, migrating Facets applications from on-premises and owning the Network Pricer component. He showed great initiative, commitment, and troubleshooting skills — fixing things in time and helping drive a successful go-live.",
  },
];

export type Recognition = {
  name: string;
  title: string;
  did: string;
  quote: string;
};

// Generalized from internal appreciation — ticket numbers, resource
// names, and contact details deliberately omitted.
export const recognitions: Recognition[] = [
  {
    name: "Renan Tieghi Pepi",
    title: "Cloud Tech Lead",
    did: "Led an infrastructure migration and decommissioning effort to completion.",
    quote: "Thank you for the effort here!",
  },
  {
    name: "Sebastiao Graciano",
    title: "Colleague, Global Cloud team",
    did: "Resource and secrets-management support across dev and QA environments.",
    quote: "Sense of urgency and dedication to seeing it through.",
  },
  {
    name: "Manjunath K S",
    title: "SAP Service Manager",
    did: "Fast-turnaround fix for a production issue under time pressure.",
    quote: "We really appreciate it.",
  },
];

export type OSSProject = {
  repo: string;
  name: string;
  description: string;
  tech: string[];
  demo?: string;
  featured?: boolean;
};

// Static fallback data (mirrors GitHub at time of writing) — used if the
// live GitHub API call fails or is rate-limited.
export const ossProjectsFallback: OSSProject[] = [
  {
    repo: "TerraformWithAzure",
    name: "Terraform with Azure",
    description: "A step-by-step learning series deploying Azure resources with Terraform.",
    tech: ["Terraform", "Azure"],
    featured: true,
  },
  {
    repo: "DockerGithubActionsDeployment",
    name: "Docker + GitHub Actions",
    description: "CI/CD pipeline for a Dockerized Flask app, built and deployed automatically on push.",
    tech: ["Python", "Docker", "GitHub Actions"],
    featured: true,
  },
  {
    repo: "vehicle-ui-dashboard",
    name: "Vehicle UI Dashboard",
    description: "React + Nx monorepo simulating a vehicle dashboard, with CI/CD to GitHub Pages.",
    tech: ["React", "TypeScript", "Nx"],
    demo: "https://kala-techies.github.io/vehicle-ui-dashboard/",
    featured: true,
  },
  {
    repo: "sdlc-fundamentals",
    name: "SDLC Fundamentals",
    description: "A beginner-friendly guide to the Software Development Life Cycle.",
    tech: ["Documentation"],
  },
];

export type PersonalProject = {
  name: string;
  tagline: string;
  tech: string[];
  status: string;
};

export const personalProjects: PersonalProject[] = [
  {
    name: "OfflineMoMAI",
    tagline: "Offline-first AI meeting and document workspace for Android — on-device transcription, summarization, and retrieval, no cloud.",
    tech: ["Flutter", "whisper.cpp", "llama.cpp"],
    status: "Private repository",
  },
  {
    name: "AP EC Voter Search",
    tagline: "Flutter app for offline electoral-roll lookup — CSV and OCR ingestion into a local, searchable index.",
    tech: ["Flutter", "SQLite", "OCR"],
    status: "Independent project",
  },
  {
    name: "AI / RAG Exploration",
    tagline: "Independent exploration of offline AI, retrieval-augmented generation, and on-device inference.",
    tech: ["RAG", "On-device LLM"],
    status: "Ongoing exploration",
  },
];

export type EducationEntry = {
  institution: string;
  degree: string;
  period: string;
};

export const education: EducationEntry[] = [
  { institution: "Acharya Nagarjuna University", degree: "M.Sc Computer Science (Pursuing)", period: "2026 – 2028" },
  { institution: "Sri Krishnadevaraya University", degree: "MBA", period: "2019 – 2021" },
  { institution: "Rayalaseema University", degree: "B.Com (Computer Applications)", period: "2015 – 2018" },
];
