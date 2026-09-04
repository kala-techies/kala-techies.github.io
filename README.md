# Shaik Kalandar — Portfolio

Personal portfolio site, deployed at [kala-techies.github.io](https://kala-techies.github.io/).

A 3D, interactive portfolio for a Cloud & DevOps Engineer — built around a "cloud command center" hero scene, with content sourced entirely from resume and live GitHub data.

## Stack

- **React 19 + TypeScript + Vite** — app shell and build
- **Three.js + React Three Fiber + drei** — the hero constellation scene (lazy-loaded, WebGL-detected, skipped entirely for `prefers-reduced-motion`)
- **Tailwind CSS v4** — styling, via `@tailwindcss/vite`
- **Framer Motion** — scroll reveals and transitions
- **GitHub REST API** — live repo cards and stats in the GitHub section, with a static fallback if the API is unreachable

## Structure

```
src/
  data/profile.ts       # All resume/GitHub-sourced content lives here
  components/            # One folder per section
  hooks/                  # useGitHubRepos, useInView, useReducedMotion
```

To update content (experience, projects, skills, etc.), edit `src/data/profile.ts` — everything else reads from it.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run lint       # oxlint
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages via `actions/deploy-pages`. The repo's **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions** for this to work.
