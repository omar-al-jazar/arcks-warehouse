<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Cloud agents boot with Docker, the self-hosted Supabase services this app needs, and `npm run dev` on port 3001. Dependencies are installed already; do not reinstall them unless `package-lock.json` changed.

- App: http://127.0.0.1:3001
- API gateway (Kong): http://127.0.0.1:8100
- Postgres is only reachable inside Docker (`docker compose exec db psql -U postgres -d postgres`). Host port 5432 is not published.
- The first boot creates a local owner, `DEV_OWNER_EMAIL` in the gitignored `.env` (default `owner@arcks-warehouse.local`). The 6-digit PIN is `DEV_OWNER_PIN` in that same file. Sign in with the Owner toggle. The auth user must keep `app_metadata.role = owner`, or `/owner` redirects to `/manager`.
- Photo identification needs `GEMINI_API_KEY` and `EXA_API_KEY`. Sign-in, inventory, checkout, and return work without them.
- Do not start `ts-arcks-warehouse`. It needs `TS_AUTHKEY`.
- `volumes/db/data` is created by Postgres as a non-traversable directory. Next and ESLint fail if they cannot list it. The startup script makes those directories traversable (`chmod a+rx`). Do not chmod the files themselves.
- `npm run lint` reports an existing unescaped apostrophe in `components/rent/kit-booking.tsx`.
