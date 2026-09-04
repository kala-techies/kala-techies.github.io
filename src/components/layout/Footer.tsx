import { profile } from "../../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-ink-faint sm:flex-row sm:justify-between sm:px-8 lg:px-10">
        <p>© {new Date().getFullYear()} {profile.name}. Built with React, Three.js, and Tailwind CSS.</p>
        <div className="flex gap-6">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink transition-colors">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-ink transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
