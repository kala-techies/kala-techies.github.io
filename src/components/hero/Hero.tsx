import { motion } from "framer-motion";
import { profile, heroTechNodes } from "../../data/profile";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void" />

      <div className="relative mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <p className="font-mono text-sm tracking-widest text-cyan uppercase">
            Cloud &amp; DevOps Engineer
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-dim">
            I design, automate, and secure cloud infrastructure on{" "}
            <span className="text-ink">Azure</span> and <span className="text-ink">AWS</span> —
            Terraform for the build, Kubernetes for the run, and CI/CD pipelines that make
            deployments boring in the best way.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#engineering"
              className="rounded-full bg-cyan px-6 py-3 text-sm font-medium text-void transition-transform hover:scale-[1.03]"
            >
              Explore the Engineering
            </a>
            <a
              href="#resume"
              className="rounded-full border border-border-hover px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-cyan hover:text-cyan"
            >
              View Resume
            </a>
          </div>

          <div className="mt-10 flex items-center gap-5 text-ink-faint">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="hover:text-ink transition-colors">
              <GitHubIcon />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="hover:text-ink transition-colors">
              <LinkedInIcon />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Send an email" className="hover:text-ink transition-colors">
              <MailIcon />
            </a>
            <span className="font-mono text-xs text-ink-faint">{profile.location}</span>
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {heroTechNodes.map((node) => (
              <span
                key={node}
                className="rounded-full border border-border-hover bg-surface/50 px-3 py-1.5 font-mono text-xs text-ink-dim backdrop-blur-sm"
              >
                {node}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-border-hover p-1.5">
          <span className="h-1.5 w-1 animate-pulse-slow rounded-full bg-cyan" />
        </div>
      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.4" />
      <path d="m3.5 6 8.5 6.5L20.5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
