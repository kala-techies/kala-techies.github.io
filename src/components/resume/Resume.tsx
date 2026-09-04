import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { profile } from "../../data/profile";

export function Resume() {
  return (
    <Section
      id="resume"
      eyebrow="Resume"
      title="Everything on this page, in one file"
      description="This site is the long-form version of my resume — Experience, Skills, and Projects above mirror it section for section. Grab the original document for applications and ATS systems."
      className="border-t border-border"
    >
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-border bg-surface/50 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border-hover text-cyan">
              <DocIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-ink">{profile.name} — {profile.title}</p>
              <p className="mt-1 text-sm text-ink-faint">Updated · 3 years experience · Bangalore, India</p>
            </div>
          </div>

          <a
            href={profile.resumeDocx}
            download
            className="flex flex-shrink-0 items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-void transition-transform hover:scale-[1.03]"
          >
            <DownloadIcon className="h-4 w-4" />
            Download Resume (.docx)
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6M9 9h2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
