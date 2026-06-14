# Planter Wax Tracker

A static React app for tracking Bee Swarm Simulator planter wax cooldowns. It is built with Vite, TypeScript, Tailwind CSS, and shadcn-style local components.

## How It Works

- `src/data/waxes.json` is the fixed master list of valid planter, field, and wax combinations.
- Every combo appears in the dashboard from the start and defaults to ready.
- A GitHub Gist file named `planter-wax-tracker.json` stores only non-ready combo state in a `states` array. Ready combos are omitted and restored by merging saved state with the master list.
- A growing combo records `started_at`; it is only a reminder and does not control availability.
- Harvesting a growing combo converts it to a cooldown entry with `activated_at`.
- Cooldowns last 36 days from `activated_at`.
- The app uses the GitHub Gist API to read and update the saved state file.
- The GitHub Personal Access Token and Gist ID are entered in the browser, stored in `localStorage`, and sent only to GitHub API requests. Leaving the Gist ID blank on setup creates a private Gist.

## Local Development

Use Node 22 or newer and pnpm 10 or newer. This repo includes `.node-version` with `22`, which matches the GitHub Pages workflow.

```sh
pnpm install
pnpm run dev
```

Useful checks:

```sh
pnpm run lint
pnpm run build
```

## Deployment

Deployment is handled by `.github/workflows/deploy.yml`. On pushes to `main`, GitHub Actions installs dependencies with pnpm, builds with:

```sh
pnpm run build
```

and publishes the generated `dist` artifact to GitHub Pages. In GitHub Actions, Vite derives the Pages base path from `GITHUB_REPOSITORY`.

## Data Shape

The Gist file should look like this:

```json
{
  "states": [
    {
      "id": "swirled-wax-blue-clay-planter-bamboo-field",
      "status": "cooldown",
      "activated_at": "2026-02-10T10:00:00.000Z",
      "started_at": null
    }
  ]
}
```

Valid `status` values saved to disk are `growing` and `cooldown`. Ready is derived by default from the master list.
