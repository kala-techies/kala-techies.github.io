import { profile, education } from "../../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center gap-4 text-sm text-ink-faint sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <div className="flex gap-6">
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="hover:text-ink transition-colors">Email</a>
          </div>
        </div>
        <p className="mt-6 font-mono text-[11px] text-ink-faint">
          {education.map((e) => e.degree).join(" · ")}
        </p>
      </div>
    </footer>
  );
}
