import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { profile } from "../../data/profile";

const CHANNELS = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: "mail" as const,
  },
  {
    label: "LinkedIn",
    value: "/in/shaik-kalandar",
    href: profile.linkedin,
    icon: "linkedin" as const,
  },
  {
    label: "GitHub",
    value: "@kala-techies",
    href: profile.github,
    icon: "github" as const,
  },
];

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's talk infrastructure"
      description="Open to CloudOps and DevOps roles, and always happy to talk Azure, Terraform, or Kubernetes."
      className="border-t border-border"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {CHANNELS.map((channel, i) => (
          <Reveal key={channel.label} delay={i * 0.06}>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex h-full flex-col justify-between rounded-xl border border-border bg-surface/50 p-6 transition-all hover:-translate-y-1 hover:border-cyan/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-hover text-ink-dim group-hover:border-cyan group-hover:text-cyan">
                <ChannelIcon icon={channel.icon} className="h-4 w-4" />
              </span>
              <div className="mt-6">
                <p className="text-xs uppercase tracking-widest text-ink-faint">{channel.label}</p>
                <p className="mt-1 font-mono text-sm text-ink group-hover:text-cyan">{channel.value}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ChannelIcon({ icon, className }: { icon: "mail" | "linkedin" | "github"; className?: string }) {
  if (icon === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.4" />
        <path d="m3.5 6 8.5 6.5L20.5 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
