@AGENTS.md
@docs/STATUS.md

# ARC

Film-equipment rental and warehouse app for a rental house in Riyadh. One database serves two parts:

- Staff app: `/manager` (checkout, return, add gear) and `/owner` (inventory, orders, bookings, staff, settings).
- Public rental site: `/rent` (gear list) and `/rent/[barcode]` (kit page with dates, price and a 10-minute hold).

Stack: Next.js 16 (App Router, Server Actions), React 19, shadcn/ui on Base UI, Tailwind 4, zod 4, and self-hosted Supabase (Postgres, Auth, Kong, Storage) from `docker-compose.yml`.

`docs/STATUS.md` is the handoff between Cursor and Claude Code. Check it against GitHub before you start, and update it in the same pull request as your work. To pick up the next task, the user types `/continue`.

## Rules

- Server Actions check the role with `authorize()` (`lib/auth/session.ts`), validate input with a zod schema from `lib/schemas/` through `parseForm` or `parseInput` (`lib/validation.ts`), and show only safe messages (`lib/errors.ts`, `lib/supabase/errors.ts`).
- Read environment variables only through `lib/env.ts`.
- Schema changes go in a new numbered file in `supabase/migrations/`. Never edit a migration that may already be applied. Keep `lib/supabase/types.ts` in step.
- Staff code uses the signed-in client, `createClient()`. Public visitors get no anon policies: public reads and holds go through `createAdminClient()` in server-only code (`lib/rent/catalog.ts`, `app/actions/rent-actions.ts`).
- Price on the server from stored rates with `quote()` in `lib/rent/dates.ts`. Never trust an amount from a form.
- "Today" and rental dates are Riyadh dates; use `lib/rent/dates.ts`. Money is SAR, VAT 15%.

## Check your work

```bash
npm run lint
npx next typegen && npx tsc --noEmit
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000 NEXT_PUBLIC_SUPABASE_ANON_KEY=build-time-placeholder npx next build
```

The build uses the same placeholders as the `Dockerfile`, so it must pass without a database. Cloud sessions can't reach the user's database, so say exactly what you could not test. `README.md` covers the full local stack.

## Git

- One branch and one pull request per task, from `main` of `omar-al-jazar/arcks-warehouse`. One commit per logical change.
- Don't push to `main` or merge a pull request unless the user asks.

## Reporting to the user

Keep it short and plain. Lead with what happened, use at most 5 numbered points, give times in Riyadh time, and end with one next action the user can do in under 2 minutes.
