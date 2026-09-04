export const profile = {
  name: "Shaik Kalandar",
  title: "Cloud & DevOps Engineer",
  tagline: "Azure & AWS infrastructure, automated.",
  location: "Bangalore, India",
  email: "shaik.kalandar20@gmail.com",
  phone: "+91-8519992634",
  github: "https://github.com/kala-techies",
  linkedin: "https://www.linkedin.com/in/shaik-kalandar",
  resumeDocx: "/resume/Shaik-Kalandar-Resume.docx",
  summary:
    "Cloud Admin and DevOps Engineer with 3 years of experience deploying and managing cloud infrastructure on Microsoft Azure and AWS. Proven expertise in CI/CD pipeline automation using Azure DevOps and GitHub Actions, Infrastructure as Code with Terraform, container orchestration on AKS and EKS, and DevSecOps practices using Snyk and SonarQube. Hands-on experience in Azure Networking (VNETs, NSGs, Private Endpoints, DNS, App Services, AKS), cloud security (IAM, RBAC, Key Vault, Firewall), and monitoring using Azure Monitor, Log Analytics, Application Insights, and Datadog. Skilled in PowerShell and Python automation for operational efficiency.",
  aboutNarrative: [
    "I manage and secure enterprise-scale cloud infrastructure — the kind that has to stay up, stay compliant, and stay cheap to run. Three years in, that's meant a lot of Terraform, a lot of pipelines, and a lot of 2am DNS resolution issues that turned into automation so they wouldn't happen again.",
    "My day-to-day sits at the intersection of Azure and AWS: provisioning networks and clusters as code, wiring CI/CD through Azure DevOps and GitHub Actions, and closing the loop with DevSecOps tooling — Snyk, SonarQube, BlackDuck — so security gates run before anything reaches production, not after.",
    "I like the operational side as much as the build side: proactive monitoring, incident RCAs, and turning repetitive manual work into PowerShell and Python scripts that don't need me anymore. Outside client work, I maintain a set of open-source repos teaching Azure, Terraform, and Git to people getting started in cloud and DevOps.",
  ],
};

export type SkillCategory = {
  name: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  { name: "Cloud Platforms", items: ["Microsoft Azure", "Amazon Web Services (AWS)"] },
  { name: "CI/CD & DevOps", items: ["Azure DevOps Pipelines", "GitHub Actions", "Git", "GitOps"] },
  { name: "Containers & Kubernetes", items: ["Docker", "Kubernetes (AKS)", "Kubernetes (EKS)", "Azure Container Registry", "Amazon ECR"] },
  { name: "IaC & Scripting", items: ["Terraform", "PowerShell", "AZ CLI", "Python", "YAML"] },
  { name: "Azure Networking", items: ["VNETs", "Subnets", "NSGs", "ASGs", "Private Endpoints", "Service Endpoints", "DNS", "Azure Firewall", "Load Balancers", "App Gateway"] },
  { name: "AWS Networking", items: ["VPC", "VPC Peering", "Transit Gateway", "VPC Endpoints", "Security Groups", "NACLs", "AWS Network Firewall", "Route 53"] },
  { name: "Monitoring & Observability", items: ["Azure Monitor", "Log Analytics Workspace", "Application Insights", "Datadog", "CloudWatch", "SNS"] },
  { name: "Security", items: ["IAM", "RBAC", "Azure Key Vault", "AWS KMS", "DevSecOps", "Pod Security Standards"] },
  { name: "DevSecOps Tools", items: ["Snyk", "SonarQube", "BlackDuck"] },
  { name: "Other", items: ["MSSQL", "Active Directory", "ServiceNow", "Azure Static Web Apps", "Azure NetApp Files"] },
];

export const heroTechNodes = [
  "Azure", "AWS", "Kubernetes", "Terraform", "Docker", "GitHub Actions", "Python", "PowerShell",
];

export type ExperienceEntry = {
  role: string;
  company: string;
  companyContext: string;
  location: string;
  period: string;
  points: string[];
  tech: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "CloudOps Engineer",
    company: "AB InBev (via TEKsystems)",
    companyContext: "One of the world's largest multinational beverage and brewing companies.",
    location: "Bangalore",
    period: "Jul 2025 – Present",
    points: [
      "Managing and supporting enterprise-scale Azure cloud infrastructure, ensuring high availability, operational stability, and secure cloud operations across production environments.",
      "Designed and deployed Azure environments using Terraform and AZ CLI — VMs, Web Apps, Storage Accounts, and networking (VNETs, Subnets, NSGs, ASGs, Service/Private Endpoints) — reducing manual provisioning effort by 60%.",
      "Developed reusable Terraform modules and automated end-to-end deployments via Azure DevOps Pipelines and GitHub Actions, reducing deployment errors by 40%.",
      "Troubleshoot complex Azure infrastructure issues spanning VNets, Private Endpoints, DNS resolution, NSGs, Load Balancers, App Services, AKS, and hybrid connectivity.",
      "Support containerized workloads on AKS — deployment troubleshooting, Ingress management, ACR image pull failures, pod scaling, and cluster-level operations.",
      "Proactive monitoring via Azure Monitor, Log Analytics, Application Insights, and Datadog, tracking AKS cluster health, Key Vault access, and Service Bus capacity across production.",
      "Performed AKS cluster upgrades — node pool management, pod scheduling and PodDisruptionBudget validation, node draining, and troubleshooting Istio ingress gateway behavior — while navigating Azure Policy restrictions, private cluster requirements, and VM family quota constraints during upgrade planning.",
      "Diagnosed and resolved Service Bus private endpoint and DNS resolution issues, and supported secret provisioning and network-restricted Key Vault access across development and QA environments.",
      "Contributing to operational excellence through RCA preparation and automation of repetitive tasks using PowerShell and Python.",
    ],
    tech: ["Azure", "Terraform", "AKS", "Azure DevOps", "GitHub Actions", "Datadog", "PowerShell", "Python"],
  },
  {
    role: "DevOps Engineer",
    company: "Daimler Trucks Innovation Center India (via JoulesToWatts)",
    companyContext: "A leading manufacturer of commercial vehicles.",
    location: "Bangalore",
    period: "Feb 2025 – Jul 2025",
    points: [
      "Managed GitHub repositories and implemented GitHub Actions CI/CD pipelines for a monorepo housing Angular (frontend) and Node.js (backend); modularized reusable workflows to enforce CI/CD standards.",
      "Integrated a full DevSecOps toolchain — Snyk, SonarQube, and BlackDuck — embedding security gates in every CI pipeline before deployment.",
      "Built and versioned Docker images via Azure Container Registry and deployed to AKS with environment-specific configurations.",
      "Migrated applications from Azure Web Apps to AKS, improving scalability and resource efficiency; deployed static UI components via Azure Static Web Apps.",
      "Participated in Agile Scrum ceremonies, aligning DevOps pipeline work with product delivery milestones.",
    ],
    tech: ["GitHub Actions", "Docker", "AKS", "ACR", "Snyk", "SonarQube", "BlackDuck", "Azure Static Web Apps"],
  },
  {
    role: "Product Specialist – Technical (DevOps & Cloud)",
    company: "Cognizant Technology Solutions",
    companyContext: "Leading professional services company, transforming clients through cloud and technology.",
    location: "Bangalore",
    period: "May 2022 – Feb 2024",
    points: [
      "Managed and supported Azure cloud infrastructure for enterprise clients, ensuring high availability and secure cloud operations across production environments.",
      "Built hub-and-spoke network architectures on AWS using VPC Peering (regional, global, cross-account), Transit Gateway, and VPC Endpoints; configured Security Groups, NACLs, and AWS Network Firewall for defence-in-depth.",
      "Implemented IAM policies, RBAC, Azure Key Vault, and AWS KMS across environments, enforcing least-privilege access on both AWS and Azure.",
      "Configured monitoring with CloudWatch, Azure Monitor, and Log Analytics for proactive performance tracking and faster incident response.",
      "Automated audit reporting with Python, reducing manual PR compliance tracking effort by 40%; built PowerShell scripts for routine Azure operations.",
      "Built Azure DevOps Pipelines and GitHub Actions workflows for IaC provisioning, deployments, and security compliance checks across DEV, SIT, UAT, and production.",
      "Investigated IAM permission issues, firewall rules, and VPC/VNet networking problems affecting application accessibility.",
    ],
    tech: ["AWS", "Azure", "Terraform", "IAM", "CloudWatch", "Python", "PowerShell", "Azure DevOps"],
  },
  {
    role: "IT Support Associate",
    company: "ICICI Bank",
    companyContext: "India's leading private sector bank with a digital and cloud-first infrastructure approach.",
    location: "Hyderabad",
    period: "Dec 2018 – 2019",
    points: [
      "Provided L1 technical support for internal users via ServiceNow.",
      "Gained foundational exposure to Active Directory, DNS/DHCP, VM provisioning concepts, and enterprise infrastructure operations.",
    ],
    tech: ["ServiceNow", "Active Directory", "DNS/DHCP"],
  },
];

export type CaseStudy = {
  id: string;
  category: string;
  title: string;
  summary: string;
  flow: string[];
  detail: string[];
  groundedIn?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "aks-upgrades",
    category: "Kubernetes",
    title: "AKS Cluster Upgrade Operations",
    summary:
      "Upgrading a live AKS cluster isn't just clicking 'upgrade' — it's making sure nothing scheduled on it breaks on the way through.",
    flow: ["Existing Cluster", "Pre-Check", "Workload Analysis", "PDB / Drain Validation", "Node Pool Upgrade", "Issue Triage", "Remediation", "Validated"],
    detail: [
      "Reviewed node pool composition, pod scheduling, and PodDisruptionBudgets before triggering an upgrade, so draining nodes doesn't take a workload below its minimum available replicas.",
      "Worked through Istio ingress gateway behavior during upgrades — traffic routing doesn't always survive a node cycle cleanly.",
      "Navigated Azure Policy restrictions and private-cluster requirements that shape what an upgrade is even allowed to do.",
      "Planned around VM family quota limits so a new node pool has somewhere to land before the old one is drained.",
      "Kept ACR image pulls and LoadBalancer services healthy through the transition.",
    ],
    groundedIn: "AB InBev · IUHP (client engagement)",
  },
  {
    id: "networking",
    category: "Networking",
    title: "Network Architecture: VNet to Application",
    summary: "Every private connection in Azure is a chain — one broken link and the whole path fails silently.",
    flow: ["VNet", "Subnet", "NSG", "Private Endpoint", "DNS Zone Link", "Application"],
    detail: [
      "Built hub-and-spoke topologies with VNet/VPC peering, Transit Gateway, and Private/Service Endpoints so traffic never needs to leave the private network.",
      "NSGs and Azure Firewall rules scoped for defence-in-depth rather than one flat allow-list.",
      "Diagnosed DNS resolution failures where a Private DNS Zone existed but wasn't linked to the right VNet — the most common reason a private endpoint 'doesn't work'.",
      "Load Balancers and App Gateway configured to route traffic without exposing anything publicly that didn't need to be.",
    ],
    groundedIn: "AB InBev · CareFirst (client engagement)",
  },
  {
    id: "service-bus",
    category: "Messaging",
    title: "Service Bus Connectivity",
    summary: "A namespace, a queue, and a consumer that can't reach either — until the DNS chain is traced end to end.",
    flow: ["Namespace", "Queue / Topic", "Private Endpoint", "DNS Zone Link", "Consumer App"],
    detail: [
      "Created private endpoints for Service Bus namespaces and linked them into the correct Private DNS Zone (privatelink.servicebus.windows.net).",
      "Traced a connectivity failure down to a missing VNet link on the DNS zone — added hosts-file entries during diagnosis, then fixed the zone link as the real, permanent solution.",
      "Validated fixes by confirming the private IP resolved correctly and that both the AMQP (5671) and HTTPS (443) ports were reachable before handing off.",
      "Built PowerShell reporting around Service Bus entities and dead-letter queues for ongoing operational visibility.",
    ],
    groundedIn: "AB InBev",
  },
  {
    id: "security-governance",
    category: "Security",
    title: "Secrets & Governance",
    summary: "Secure → Govern → Remediate → Validate — access to a secret should always be able to answer 'why'.",
    flow: ["Application", "Identity & RBAC", "Secret Request", "Network-Restricted Key Vault", "Policy Check", "Remediation", "Validated"],
    detail: [
      "Provisioned and network-restricted Key Vaults — private endpoints only, no public access, RBAC over access policies.",
      "Supported secret creation and rotation across development and QA environments, including monitoring for upcoming secret expirations.",
      "Worked through Azure Policy-driven governance and compliance checks, including legacy-authentication remediation on App Services and Function Apps, with resource-specific exceptions where a control genuinely didn't apply.",
      "Applied the same least-privilege IAM/RBAC discipline across both Azure and AWS environments.",
    ],
    groundedIn: "AB InBev · Cognizant",
  },
  {
    id: "automation",
    category: "Automation",
    title: "From Manual Operations to Automated Reporting",
    summary: "If I've done it by hand twice, the third time it's a script.",
    flow: ["Manual Operation", "Repetitive Task Identified", "PowerShell Script", "Validation", "Structured Report", "Efficiency Gain"],
    detail: [
      "Automated Azure resource inventory, VM information, and VNet/subnet documentation into structured CSV/Excel reports instead of manual tracking.",
      "Led a boot-diagnostics migration and storage account decommissioning effort end to end, closing out a multi-step infrastructure cleanup.",
      "Built PowerShell tooling around Service Bus policy and entity reporting, and Python automation for PR compliance audit tracking — cutting manual tracking effort by 40%.",
      "Reusable Terraform modules and pipeline templates so a new environment is provisioned the same way every time, not re-typed.",
    ],
    groundedIn: "AB InBev · Cognizant",
  },
  {
    id: "incident-lifecycle",
    category: "Production Engineering",
    title: "Production Incident Lifecycle",
    summary: "Detect → Investigate → Assess → Remediate → Validate → Document — and make sure it doesn't happen the same way twice.",
    flow: ["Detect", "Investigate", "Identify Dependency", "Assess Impact", "Remediate", "Validate", "Document", "Prevent Recurrence"],
    detail: [
      "Monitoring across Azure Monitor, Log Analytics, Application Insights, and Datadog to catch production issues early.",
      "Coordinated fast-turnaround fixes for production application issues affecting business-critical workflows, working directly with the teams whose processes depended on them.",
      "RCA preparation and change-management discipline so a fix is documented, not just applied.",
      "Change execution through Azure DevOps and GitHub Actions pipelines rather than ad-hoc manual changes, so remediation is repeatable.",
    ],
    groundedIn: "AB InBev",
  },
  {
    id: "disaster-recovery",
    category: "Architecture Exploration",
    title: "AKS Disaster Recovery — Design Exploration",
    summary:
      "An architecture exploration into what a real AKS failover would require — not a production system, a design study of the moving parts.",
    flow: ["Primary Region", "Replication / Sync", "Secondary Region", "Traffic Failover", "Recovery Validation", "Failback"],
    detail: [
      "Mapped what needs to replicate for a secondary cluster to actually be usable: container images (registry replication), configuration, secrets, and persistent data.",
      "Considered DNS/traffic failover mechanics and what realistic RTO/RPO targets would look like for the workload.",
      "Thought through the failback path deliberately — recovering to secondary is only half the problem; returning to primary cleanly is the other half.",
    ],
  },
];

export type Recommendation = {
  name: string;
  title: string;
  relationship: string;
  date: string;
  text: string;
};

// Verbatim (light typo cleanup only) from LinkedIn recommendations, used
// with the specific people named, per direct request.
export const recommendations: Recommendation[] = [
  {
    name: "Ana Paula Malta",
    title: "Senior Project & Product Manager",
    relationship: "Managed Shaik directly at AB InBev",
    date: "August 2026",
    text: "I worked with Kalandar at AB InBev in 2025/2026. He is a committed professional, always looking to learn something that goes beyond his role. He coordinated the work of responding to budget deviations, liaising with Finance teams, and addressing infrastructure housekeeping and adjustments when necessary. He automated processes for efficiency gains, and was responsible for more than 50% of the Azure services/products configuration, ensuring SLA compliance throughout. He is a proactive professional with a sense of ownership, always willing to help. I recommend him.",
  },
  {
    name: "Deiva Ganesh",
    title: "Client Partner — Healthcare & Life Sciences",
    relationship: "Senior colleague, did not manage Shaik directly",
    date: "August 2026",
    text: "Kalandar worked as an Azure Admin on the HC-BPAAS team during the IUHP pilot, migrating Facets applications from on-premises. He owned the Network Pricer component and supported deployments across Interactive, Workflow, App Server, and FOA, along with SQL installations using Azure DevOps for IUHP onto QNXT. He showed great initiative, commitment, and troubleshooting skills — fixing things in time and helping drive a successful go-live. He will add good value to any team he works with.",
  },
];

export type Recognition = {
  name: string;
  title: string;
  quote: string;
  context: string;
};

// Generalized from internal Teams/email appreciation — ticket numbers,
// resource names, hostnames, and contact details deliberately omitted.
export const recognitions: Recognition[] = [
  {
    name: "Leonardo Souto Rodrigues Alves",
    title: "Colleague, Global Cloud team",
    quote: "Thank you for your help! It is working now!",
    context: "Diagnosed a Service Bus private-endpoint DNS resolution issue blocking a colleague's environment, traced it to a missing DNS zone link, and validated connectivity end to end before handing off.",
  },
  {
    name: "Manjunath K S",
    title: "SAP Service Manager, IT Operations",
    quote: "Thank you very much for your quick support on this! We really appreciate it.",
    context: "Fast-turnaround support restoring a production application form used across the Africa region, coordinating with the wider ops team under time pressure.",
  },
  {
    name: "Renan Tieghi Pepi",
    title: "Cloud Tech Lead",
    quote: "Thank you for the effort here!",
    context: "Led an Azure boot-diagnostics migration and storage account decommissioning effort through to completion.",
  },
  {
    name: "Sebastiao Graciano",
    title: "Colleague, Global Cloud team",
    quote: "Fully available to join calls and work directly on the problems together — collaborative approach, sense of urgency, and dedication to ensuring the activities were successfully completed.",
    context: "Recognized for resource-creation and secrets-management support across development and QA environments.",
  },
];

export type EngineeringMapTier = {
  label: string;
  nodes: string[];
};

export const engineeringMap: EngineeringMapTier[] = [
  { label: "Azure Cloud", nodes: ["Subscription", "Resource Groups", "Azure Policy"] },
  { label: "Platform", nodes: ["AKS", "Networking", "Security & Key Vault"] },
  { label: "Delivery", nodes: ["Applications", "Service Bus", "App Services"] },
  { label: "Operations", nodes: ["Monitoring", "Automation", "Incident Response"] },
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
    description: "A step-by-step learning series deploying Azure resources with Terraform — providers, resources, modules, and remote state, written for people new to IaC.",
    tech: ["Terraform", "Azure", "HCL"],
    featured: true,
  },
  {
    repo: "sdlc-fundamentals",
    name: "SDLC Fundamentals",
    description: "A beginner-friendly guide to the Software Development Life Cycle — Planning through Maintenance — covering Waterfall, Agile, and DevOps models.",
    tech: ["Documentation"],
  },
  {
    repo: "DockerGithubActionsDeployment",
    name: "Docker + GitHub Actions Deployment",
    description: "A CI/CD pipeline that builds, tests, and deploys a Dockerized Python Flask app to Docker Hub automatically on every push to main.",
    tech: ["Python", "Flask", "Docker", "GitHub Actions", "Pytest"],
    featured: true,
  },
  {
    repo: "CloudControl-with-Azure",
    name: "CloudControl with Azure",
    description: "A hands-on Azure Administration learning series — labs and real-world scenarios for going from zero to confidently managing Azure services.",
    tech: ["Azure", "IAM", "Networking"],
  },
  {
    repo: "GitForOps",
    name: "Git for Ops",
    description: "A practical, day-wise Git tutorial for students and professionals building foundational-to-advanced Git skills.",
    tech: ["Git"],
  },
  {
    repo: "MLOPS",
    name: "MLOps",
    description: "Work-in-progress exploration of MLOps practices and tooling.",
    tech: ["Python", "Jupyter"],
  },
  {
    repo: "linuxStarter",
    name: "Linux Starter",
    description: "A foundational guide to the Linux command line for students and beginners.",
    tech: ["Linux", "Bash"],
  },
  {
    repo: "vehicle-ui-dashboard",
    name: "Vehicle UI Dashboard",
    description: "A component-driven React + Nx monorepo simulating a vehicle dashboard — speedometer, fuel gauge, turn signals, media controls — with a full CI/CD pipeline to GitHub Pages.",
    tech: ["React", "TypeScript", "Nx", "Storybook"],
    demo: "https://kala-techies.github.io/vehicle-ui-dashboard/",
    featured: true,
  },
  {
    repo: "cricbuzz_clone",
    name: "Cricbuzz Clone",
    description: "A front-end clone of the Cricbuzz interface, built with vanilla HTML, CSS, and JavaScript.",
    tech: ["JavaScript", "HTML", "CSS"],
  },
  {
    repo: "PythonForOps",
    name: "Python for Ops",
    description: "Python fundamentals aimed at operations professionals — automation, scripting, and efficient system management.",
    tech: ["Python"],
  },
];

export type PersonalProject = {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  highlights: string[];
  status: string;
};

export const personalProjects: PersonalProject[] = [
  {
    name: "OfflineMoMAI",
    tagline: "A fully offline AI workspace for Android",
    description:
      "Started as an offline AI meeting assistant — record or import a meeting, transcribe it on-device with whisper.cpp, and generate a summary and Minutes of Meeting with an on-device LLM (llama.cpp, Qwen2.5-1.5B). Grew into a broader private workspace: chat with your own documents via a hybrid vector + keyword retrieval engine, an offline speech translator across nine Indian languages, a full offline PDF toolkit (compress, merge, split, OCR, redaction), and a resume builder that tailors against a job description — all without a single upload. The only network call in the app is the one-time model download on first run.",
    tech: ["Flutter", "Dart", "whisper.cpp", "llama.cpp", "Riverpod", "sqflite", "Clean Architecture"],
    highlights: [
      "On-device speech-to-text and LLM inference — no cloud, no accounts",
      "Hybrid vector + keyword retrieval engine with confidence-scored citations",
      "Offline PDF suite: compress, merge, split, OCR, redaction, password protection",
      "Resume builder with JD-tailored, review-gated AI rewrite suggestions",
    ],
    status: "Actively developed · private repository",
  },
  {
    name: "AP EC Voter Search",
    tagline: "Offline voter-roll lookup, built in Flutter",
    description:
      "A Flutter mobile app for searching electoral-roll data entirely on-device — importing voter-roll CSV exports, running OCR against scanned roll pages, and indexing everything into a local SQLite store for fast lookup with no server round-trip.",
    tech: ["Flutter", "Dart", "SQLite", "CSV Parsing", "OCR"],
    highlights: [
      "CSV ingestion into a local, searchable SQLite index",
      "OCR pipeline for scanned roll pages",
      "Fully offline lookup — no server dependency",
    ],
    status: "Independent project",
  },
];

export type Achievement = {
  title: string;
  detail: string;
};

export const achievements: Achievement[] = [
  {
    title: "18+ open-source repositories",
    detail: "Maintaining repos covering Azure, Kubernetes, Terraform, and CI/CD — sharing real-world DevOps implementations with the community.",
  },
  {
    title: "Best Associate Award — Cognizant",
    detail: "Recognized for driving automation initiatives that significantly reduced manual effort across the account.",
  },
  {
    title: "40% fewer deployment errors, 60% less manual provisioning",
    detail: "Delivered through Terraform IaC automation and reusable Azure DevOps / GitHub Actions pipelines.",
  },
  {
    title: "40% reduction in manual audit tracking",
    detail: "Automated PR compliance audit reporting with Python.",
  },
];

export type EducationEntry = {
  institution: string;
  degree: string;
  period: string;
};

export const education: EducationEntry[] = [
  { institution: "Acharya Nagarjuna University", degree: "M.Sc in Computer Science (Pursuing)", period: "2026 – 2028" },
  { institution: "Sri Krishnadevaraya University", degree: "Master of Business Administration (MBA)", period: "2019 – 2021" },
  { institution: "Rayalaseema University", degree: "B.Com (Computer Applications)", period: "2015 – 2018" },
];
