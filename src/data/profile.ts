export const profile = {
  name: "Shaik Kalandar",
  title: "Cloud & DevOps Engineer",
  positioning: "Building, operating, and automating reliable cloud infrastructure.",
  email: "shaik.kalandar20@gmail.com",
  github: "https://github.com/kala-techies",
  linkedin: "https://www.linkedin.com/in/shaik-kalandar",
  employers: ["AB InBev", "Daimler Trucks", "Cognizant"],
};

export type Recommendation = {
  name: string;
  title: string;
  text: string;
};

// LinkedIn — Deiva and Ana specifically, per direct request. Trimmed to
// their most relevant sentences without changing meaning.
export const recommendations: Recommendation[] = [
  {
    name: "Ana Paula Malta",
    title: "Managed Kalandar directly, AB InBev",
    text: "A committed professional, always looking to learn something that goes beyond his role. Responsible for more than 50% of the Azure services configuration, ensuring SLA compliance throughout. A proactive professional with a sense of ownership.",
  },
  {
    name: "Deiva Ganesh",
    title: "Client Partner, Healthcare & Life Sciences",
    text: "Worked as an Azure Admin during the IUHP pilot, migrating Facets applications from on-premises and owning the Network Pricer component. Great initiative, commitment, and troubleshooting skills — helping drive a successful go-live.",
  },
];

export type Recognition = {
  work: string;
  quote: string;
  name: string;
};

// Generalized from internal appreciation — ticket numbers, resource
// names, and contact details deliberately omitted.
export const recognitions: Recognition[] = [
  {
    work: "Led an infrastructure migration and decommissioning effort to completion.",
    quote: "Thank you for the effort here!",
    name: "Renan Tieghi Pepi, Cloud Tech Lead",
  },
  {
    work: "Fast-turnaround fix for a production issue under time pressure.",
    quote: "We really appreciate it.",
    name: "Manjunath K S, SAP Service Manager",
  },
];

export type Project = {
  name: string;
  tagline: string;
};

export const projects: Project[] = [
  { name: "OfflineMoM", tagline: "Offline-first meeting and document workspace." },
  { name: "AP EC Voter Search", tagline: "Flutter, SQLite, and OCR — offline electoral-roll lookup." },
  { name: "AI / RAG Exploration", tagline: "On-device inference and retrieval, independently explored." },
];
