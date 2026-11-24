# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:00 AM Riyadh time, by Cursor.

## Now: Phase 2 live on Barakat

Zones, Arabic `/rent`, hero, and kit pages are live @ `689b761` (`.deployed-from-sha`; folder is not a git repo).

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/CAM-*` and sample kits HTTP 200 after props fix. |
| 2 | "What arrives" list | Done | |
| 3 | Price: days × day rate + zone delivery + 15% VAT | Done | Zones show EN/AR names; fees 100 / 150 / 175 SAR. |
| 4 | Reserve holds the gear for 24 hours | Done | |
| 5 | WhatsApp and email confirmation | Partly built | Button wired; `business_whatsapp` still unset. |
| 6 | Owner's stock calendar | Done | Owner routes 307 → login when unauthed. |
| 7 | Riyadh delivery zones | Done | 5 zones live; DB untouched this deploy. |
| 8 | Arabic UI on public rent | Done | Arabic renders on `/rent`. |
| 9 | Animated `/rent` hero | Done | |

## Open work

None. Barakat idle.

## Next up, in order

1. Owner alert / email on new hold.
2. Domain → HTTPS official site (`docs/HOSTING-BACKEND-PLAN.md`).
3. Set business WhatsApp when Omar wants that path live.

## Waiting on the user

- Business name + first bookable kit for a smoke hold.
- Domain purchase / DNS when ready for the official site.
- Business WhatsApp number when ready.

## Known problems

- Build should pass without a database after PR #5.
- IP rate-limit is in-process only.
- Barakat deploy folder is not a git checkout; sha lives in `.deployed-from-sha`.
- Never pass objects containing functions from Server Components into Client Components.

## Log

- 24 Nov, 3:15 AM Riyadh: First app redeploy @ `e9975b5` (`/rent` 200).
- 24 Nov, 3:25–3:35 AM: Zones/Arabic/hero + hosting plan (domain first).
- 24 Nov, ~3:50 AM: Zones build live; kit pages 500 (RentCopy functions → client).
- 24 Nov, 3:55 AM: Fix merged (#23) — `KitBooking` takes `locale` only.
- 24 Nov, 4:00 AM Riyadh: Redeploy @ `689b761` confirmed. `/rent` + kits 200; Arabic + zones visible; 0 app errors; DB untouched.
