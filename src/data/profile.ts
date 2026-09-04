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

export type ClientProject = {
  name: string;
  client: string;
  points: string[];
  tech: string[];
  impact: string[];
};

export const clientProjects: ClientProject[] = [
  {
    name: "AKS Deployment & Azure DevOps Pipelines Using Terraform",
    client: "IUHP",
    points: [
      "Provisioned AKS clusters, VNETs, Subnets, NSGs, Private Endpoints, Storage Accounts, and Key Vault using Terraform for consistency and repeatability across environments.",
      "Built Azure DevOps Pipelines to automate AKS deployments with rolling updates and zero-downtime releases, using variable groups and pipeline templates for environment-specific config.",
      "Integrated Azure Key Vault with AKS via the CSI Secret Store driver for secure secrets injection; enforced RBAC and Pod Security Standards across the cluster.",
      "Configured Azure Load Balancer and Ingress Controller to route traffic to microservices running in AKS.",
      "Set up Azure Monitor and Log Analytics for end-to-end observability.",
    ],
    tech: ["AKS", "Terraform", "Azure DevOps", "Key Vault", "CSI Secret Store", "Ingress"],
    impact: ["40% reduction in deployment errors", "Improved availability via AKS auto-scaling"],
  },
  {
    name: "AWS Cloud & DevOps Automation",
    client: "CareFirst",
    points: [
      "Provisioned AWS infrastructure — EC2, VPC, Application Load Balancer, and PrivateLink — using Terraform for consistent, repeatable deployments.",
      "Configured IAM policies, AWS Network Firewall, NACLs, and Security Groups for least-privilege access and network segmentation.",
      "Implemented hub-and-spoke network architecture using VPC Peering (regional/global/cross-account) and Transit Gateway for centralized connectivity.",
      "Integrated CloudWatch and SNS for observability and metric-based alerting.",
      "Collaborated with onshore teams on knowledge transfer and hand-off demos across DEV, SIT, UAT, and on-prem.",
    ],
    tech: ["AWS", "EC2", "VPC", "Terraform", "CloudWatch", "SNS", "Transit Gateway"],
    impact: ["30% improvement in deployment efficiency via automated CI/CD"],
  },
  {
    name: "Cloud Migration: On-Premises to Azure",
    client: "Baycare",
    points: [
      "Led migration of on-premises workloads to Azure — assessed dependencies, created migration plans, and coordinated cross-functional teams to minimize business disruption.",
      "Provisioned Azure VMs, installed SQL Server, and restored on-prem databases to Azure using Azure NetApp Files for secure backup and restoration.",
      "Established Private Endpoints between Azure Storage Accounts and VMs for secure data transfer and regulatory compliance; automated provisioning with Terraform.",
      "Managed infrastructure and application deployment pipelines using Azure DevOps.",
      "Engaged Microsoft Support and IAM teams to resolve critical blockers; provided post-production support.",
    ],
    tech: ["Azure VMs", "SQL Server", "Azure NetApp Files", "Terraform", "Azure DevOps", "Private Endpoints"],
    impact: ["75% reduction in manual deployment intervention"],
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
