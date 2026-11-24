# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:05 AM Riyadh time, by Cursor.

## Now: Security hardening for public launch

Phase 2 (zones, Arabic, hero, kits) is live on Barakat @ `689b761`. This branch hardens auth, headers, robots, and rate limits before the official domain.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1–4, 6–9 | Bookable kit + zones + Arabic + hero | Done (live) | |
| 5 | WhatsApp confirmation | Partly built | Number unset. |
| 10 | Website security hardening | In progress | Login rate limit, safe redirects, CSP/frame/nosniff, robots/noindex staff, rent IP/phone limits tightened. |

## Open work

Security hardening PR → merge → Barakat redeploy.

## Next up, in order

1. Redeploy security build on Barakat; smoke `/rent` + `/login`.
2. Owner alert / email on new hold.
3. Domain → HTTPS (`docs/HOSTING-BACKEND-PLAN.md`).

## Waiting on the user

- Paste Barakat redeploy after merge.
- Business name, WhatsApp, domain when ready.

## Known problems

- IP / login rate limits are still in-process (per container).
- CSP allows `'unsafe-inline'` / `'unsafe-eval'` until nonces are wired for Next.
- Build should pass without a database after PR #5.

## Log

- 24 Nov, 4:00 AM Riyadh: Kit pages live @ `689b761`.
- 24 Nov, 4:05 AM Riyadh: Security pass — open-redirect fix, PIN attempt cap, security headers, robots, rent rate-limit harden, unit tests (`npm test`).
