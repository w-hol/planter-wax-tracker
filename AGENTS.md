# Planter Wax Tracker

## Project Shape

- Static GitHub Pages app built with React, TypeScript, Vite, Tailwind CSS, and Material 3-inspired local components.
- The app is always dark themed.
- There is no backend. Browser code reads and writes `planter-wax-tracker.json` inside a GitHub Gist through the GitHub Gist API.
- The GitHub Personal Access Token and Gist ID are supplied by the user in the setup screen, stored in `localStorage`, and must never be committed or hardcoded.

## Data Model

- `src/data/waxes.json` is the fixed master list of valid planter, field, and wax combinations.
- All master-list combos appear by default and are treated as ready when no saved state exists.
- The Gist file stores only non-ready state:

```json
{
  "states": [
    {
      "id": "combo-id",
      "status": "growing",
      "activated_at": null,
      "started_at": "2026-02-10T10:00:00.000Z"
    }
  ]
}
```

- Persisted statuses are `growing` and `cooldown`; ready is derived from the master list.
- Cooldowns last 36 days from harvest time (`activated_at`), not planting time.
- A growing planter is only a reminder. Harvesting it converts the combo to cooldown at the chosen harvest time.

## Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm run dev`
- Lint: `pnpm run lint`
- Build: `pnpm run build`

## Tooling And Deployment

- Use Node 22 or newer and pnpm 10 or newer. `.node-version` pins the preferred local Node line to `22`.
- Build output goes to `dist`, which is ignored locally and uploaded by GitHub Actions.
- `.github/workflows/deploy.yml` builds on pushes to `main` with `BASE_URL=/planter-wax-tracker/` and deploys the `dist` artifact to GitHub Pages.
