# AGENTS.md

## Architecture

- **Astro 5** with SSR output and Vercel adapter
- Middleware (`src/middleware/index.ts`) handles JWT auth, redirects to `/login` if not authenticated
- Data layer (`src/lib/db.ts`) loads/stores investments from Upstash Redis directly on server
- Pages:
  - `src/pages/login.astro` — login form (public)
  - `src/pages/index.astro` — main dashboard (protected, only accessible when authenticated)
- API routes at `src/pages/api/`:
  - `auth.ts` — login/logout
  - `investments.ts` — protected CRUD
- Data stored under Redis key `investments:data`
- UI language is Spanish throughout

## Running Locally

```bash
pnpm dev
```

Opens at `http://localhost:4321`

## Environment Variables

Required (set in `.env.local`):

- `KV_REST_API_URL` — Upstash Redis REST URL
- `KV_REST_API_TOKEN` — Upstash Redis REST token
- `AUTH_USER` — login username
- `AUTH_PASS_HASH` — bcrypt hash of the password
- `AUTH_SECRET` — JWT signing secret

## No Tooling

There is no test suite, linter, formatter, type checker, or CI pipeline. Changes are verified by running the app manually.

## Key Patterns

- Middleware verifies JWT cookie on every request, redirects to `/login` if no valid session
- Page loads data from Redis directly (server-side) when authenticated
- Client receives pre-rendered data via `define:vars`
- Data mutations POST to `/api/investments` which updates Redis
- IDs are `Date.now() + Math.random()` — not UUIDs
- ROI formula differs between per-row and per-platform; see `src/pages/index.astro`
- Platform colors are hardcoded in both CSS variables and the `COLORS` JS object — keep in sync