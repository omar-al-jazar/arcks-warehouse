# ARC

A [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) rebuild of the film-equipment warehouse app — same checkout and inventory job, same Postgres schema, UI on Next.js 16. The product name is ARC. Runs on its own independent self-hosted Supabase stack (own Postgres, Auth, Kong, Storage), separate from the original app's stack.

## Running it locally

This project brings up its own full Supabase stack via Docker Compose, on ports chosen not to collide with a `warehouse-tracker` stack running on the same machine:

1. Copy the env template and generate real secrets:
   ```bash
   cp .env.example .env
   sh utils/generate-keys.sh --update-env
   ```
2. Edit `.env` and set `WEBAUTHN_RP_ID`/`WEBAUTHN_RP_ORIGINS` for your environment (see the comment block above those variables in `.env.example`).
3. Bring up the database first and apply the schema:
   ```bash
   docker compose up -d db
   # wait for `docker compose ps db` to show healthy, then:
   docker compose up -d   # starts auth/kong/rest/etc., which the later migrations depend on
   for f in supabase/migrations/*.sql; do
     docker compose exec -T db psql -U postgres -d postgres < "$f"
   done
   ```
4. Bring up the app:
   ```bash
   docker compose up -d app
   ```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result — **not** `:3000`, which is `warehouse-tracker`'s port.

## Ports

| Service | Port |
|---|---|
| App | `3001` |
| Kong (API gateway) | `8100` / `8543` (HTTPS) |
| Postgres | `5433` |
| Supavisor (pooler) | `6544` |

## Stack

Same self-hosted Supabase stack as `warehouse-tracker` (`docker-compose.yml` is the official Supabase self-hosting recipe plus an `app` service) — see that project's README for the underlying architecture (auth, RLS, checkout/return functions, barcode scanning). What differs here is the UI layer: shadcn/ui components (`components/ui/`) and Base UI primitives instead of hand-rolled "glass" styling, plus a more granular route structure (`app/manager/*`, `app/owner/*`) instead of single flat pages per role.
