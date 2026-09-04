import { Reveal } from "../Reveal";
import { profile, ossProjectsFallback } from "../../data/profile";
import { useGitHubRepos, fallbackAsRepoShape, type GitHubRepo } from "../../hooks/useGitHubRepos";

const USERNAME = "kala-techies";

export function GitHubSection() {
  const { repos, stats, loading } = useGitHubRepos(USERNAME);

  const displayRepos: GitHubRepo[] =
    repos && repos.length > 0
      ? repos.filter((r) => ossProjectsFallback.some((f) => f.repo === r.name)).slice(0, 4)
      : ossProjectsFallback.map(fallbackAsRepoShape);

  const repoList = displayRepos.length > 0 ? displayRepos : ossProjectsFallback.map(fallbackAsRepoShape);

  return (
    <section id="github" className="mx-auto max-w-5xl px-6 pb-20 sm:px-8">
      <Reveal>
        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-10">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-ink-faint hover:text-cyan"
          >
            @{USERNAME} · {loading ? "…" : (stats?.publicRepos ?? 25)} public repos
          </a>
          <div className="flex flex-wrap gap-2">
            {repoList.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border-hover px-3 py-1.5 font-mono text-[11px] text-ink-dim transition-colors hover:border-cyan hover:text-cyan"
              >
                {repo.name}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
