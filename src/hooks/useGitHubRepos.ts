import { useEffect, useState } from "react";
import { ossProjectsFallback, type OSSProject } from "../data/profile";

export type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  updated_at: string;
};

export type GitHubStats = {
  publicRepos: number;
  followers: number;
};

const FEATURED_ORDER = ossProjectsFallback.map((p) => p.repo);

function rankRepo(name: string) {
  const idx = FEATURED_ORDER.indexOf(name);
  return idx === -1 ? FEATURED_ORDER.length : idx;
}

export function useGitHubRepos(username: string) {
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [source, setSource] = useState<"live" | "fallback">("fallback");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [reposRes, userRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
          fetch(`https://api.github.com/users/${username}`),
        ]);
        if (!reposRes.ok || !userRes.ok) throw new Error("GitHub API error");
        const reposJson: GitHubRepo[] = await reposRes.json();
        const userJson = await userRes.json();

        if (cancelled) return;

        const nonForks = reposJson
          .filter((r) => !r.fork)
          .sort((a, b) => rankRepo(a.name) - rankRepo(b.name));

        setRepos(nonForks);
        setStats({ publicRepos: userJson.public_repos, followers: userJson.followers });
        setSource("live");
      } catch {
        if (cancelled) return;
        setRepos(null);
        setSource("fallback");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  return { repos, stats, source, loading };
}

export function fallbackAsRepoShape(project: OSSProject): GitHubRepo {
  return {
    name: project.repo,
    description: project.description,
    html_url: `https://github.com/kala-techies/${project.repo}`,
    homepage: project.demo ?? null,
    language: project.tech[0] ?? null,
    stargazers_count: 0,
    forks_count: 0,
    fork: false,
    updated_at: "",
  };
}
