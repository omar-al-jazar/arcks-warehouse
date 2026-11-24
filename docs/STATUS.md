# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 3:55 AM Riyadh time, by Cursor.

## Now: Phase 2 live on Barakat (pending kit 500 fix redeploy)

Zones + Arabic + hero were redeployed on Barakat; kit pages `/rent/[barcode]` returned **500** because `RentCopy` (with functions) was passed into client `KitBooking`. Fix on this branch: pass `locale` only.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Fixing | Index `/rent` 200; kit 500 until redeploy of this fix. |
| 2 | "What arrives" list | Done | |
| 3 | Price + zone delivery | Done (code/live DB) | Zones present after 0013. |
| 4 | Reserve 24h hold | Done | |
| 5 | WhatsApp confirmation | Partly built | Number unset. |
| 6 | Owner stock calendar | Done | |
| 7 | Riyadh zone fees | Done | |
| 8 | Arabic UI on `/rent` | Done (live) | |
| 9 | Animated `/rent` hero | Done (live) | |

## Open work

Kit-booking props fix → merge → Barakat redeploy only.

## Next up, in order

1. Barakat redeploy after this fix; confirm kit pages 200.
2. Owner alert / email on new hold.
3. Domain → HTTPS official site (`docs/HOSTING-BACKEND-PLAN.md`).

## Waiting on the user

- After merge: paste `docs/BARAKAT-CLAUDE-TASK.md` into Barakat Claude.
- Business name + first bookable kit; business WhatsApp when ready.

## Known problems

- Build should pass without a database after PR #5.
- IP rate-limit is in-process only.
- Barakat deploy folder may not be a git checkout; sha in `.deployed-from-sha`.
- Never pass objects containing functions from Server Components into Client Components.

## Log

- 24 Nov, 3:15 AM Riyadh: Redeploy @ `e9975b5` (`/rent` 200).
- 24 Nov, 3:25–3:35 AM: Zones/Arabic/hero + hosting plan (domain first).
- 24 Nov, ~3:50 AM: Barakat new build live; `/rent` 200, kit pages 500 (copy functions → client).
- 24 Nov, 3:55 AM Riyadh: Fix — `KitBooking` takes `locale` only; resolves `rentCopy` client-side.
