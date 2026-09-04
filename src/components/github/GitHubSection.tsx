import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { profile, ossProjectsFallback } from "../../data/profile";
import { useGitHubRepos, fallbackAsRepoShape, type GitHubRepo } from "../../hooks/useGitHubRepos";

const USERNAME = "kala-techies";

export function GitHubSection() {
  const { repos, stats, loading } = useGitHubRepos(USERNAME);

  const displayRepos: GitHubRepo[] = repos && repos.length > 0
    ? repos.filter((r) => ossProjectsFallback.some((f) => f.repo === r.name)).slice(0, 8)
    : ossProjectsFallback.map(fallbackAsRepoShape);

  const repoList = displayRepos.length > 0 ? displayRepos : ossProjectsFallback.map(fallbackAsRepoShape);

  return (
    <Section
      id="github"
      eyebrow="Open Source"
      title="Live from GitHub"
      description="Pulled directly from the GitHub API at page load — teaching repos and hands-on projects covering Azure, Terraform, and CI/CD."
      className="border-t border-border"
    >
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-surface/50 px-6 py-5">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 font-mono text-sm text-ink hover:text-cyan"
          >
            <span className="text-cyan">@</span>{USERNAME}
          </a>
          <div className="h-4 w-px bg-border" />
          <Stat label="Public repos" value={stats?.publicRepos ?? 25} loading={loading} />
          <Stat label="Followers" value={stats?.followers ?? 30} loading={loading} />
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="ml-auto rounded-full border border-border-hover px-4 py-2 text-xs font-medium text-ink-dim transition-colors hover:border-cyan hover:text-cyan"
          >
            View full profile →
          </a>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {repoList.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 0.04}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col rounded-xl border border-border bg-surface/40 p-5 transition-all hover:-translate-y-1 hover:border-cyan/60"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-mono text-sm font-medium text-ink group-hover:text-cyan">
                  {repo.name}
                </h3>
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-1 font-mono text-xs text-ink-faint">
                    ★ {repo.stargazers_count}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-ink-dim">
                {repo.description ?? "—"}
              </p>
              <div className="mt-4 flex items-center justify-between">
                {repo.language && (
                  <span className="font-mono text-[11px] text-ink-faint">{repo.language}</span>
                )}
                {repo.homepage && (
                  <span className="font-mono text-[11px] text-cyan">Live demo →</span>
                )}
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Stat({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-lg font-semibold text-ink">
        {loading ? "…" : value}
      </span>
      <span className="text-xs text-ink-faint">{label}</span>
    </div>
  );
}
