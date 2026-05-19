# AGENTS.md

## Architecture

- Single-file SPA: `index.html` contains all CSS and JS inline (no bundler, no framework)
- Two API endpoints:
  - `api/auth.js` — authentication (login/logout/session check) with JWT in httpOnly cookies
  - `api/investments.js` — Vercel serverless function backed by Upstash Redis (protected)
- Data stored under Redis key `investments:data`
- UI language is Spanish throughout

## Running Locally

No dev server configured. To run locally you need Vercel CLI:

```bash
npx vercel dev
```

Opening `index.html` directly in a browser will **not** work — the `fetch('/api/investments')` calls require the Vercel dev server.

## Environment Variables

Required (set in Vercel dashboard or `.env.local`):

- `KV_REST_API_URL` — Upstash Redis REST URL
- `KV_REST_API_TOKEN` — Upstash Redis REST token
- `AUTH_USER` — login username
- `AUTH_PASS_HASH` — bcrypt hash of the password
- `AUTH_SECRET` — JWT signing secret

## No Tooling

There is no test suite, linter, formatter, type checker, or CI pipeline. Changes are verified by running the app manually.

## Key Patterns

- All data mutations go through `POST /api/investments` which replaces the entire dataset (not patch)
- Frontend caches data in `cachedData` variable; `refresh()` re-fetches from API
- IDs are `Date.now() + Math.random()` — not UUIDs
- ROI formula differs between per-row and per-platform; see `index.html` lines 530–535 vs 514–518
- Platform colors are hardcoded in both CSS variables and the `COLORS` JS object — keep in sync
