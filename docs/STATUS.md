# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 3:25 AM Riyadh time, by Cursor.

## Now: Phase 2 surface — zones, Arabic, hero

Phase 1 (one bookable kit) is live on Barakat @ `e9975b5`. This branch adds Riyadh per-zone delivery, Arabic/English on `/rent`, and an animated hero. Needs migration **0013** + app redeploy on Barakat.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | Live `/rent` + kit pages. |
| 2 | "What arrives" list | Done | `kit_contents` when set. |
| 3 | Price: days × day rate + delivery + 15% VAT | Done | Zone fee when fulfilment is delivery; house fee is fallback. |
| 4 | Reserve holds the gear for 24 hours | Done | Rate-limit + expired labels. |
| 5 | WhatsApp and email confirmation | Partly built | Button wired; number still unset. |
| 6 | Owner's stock calendar | Done | |
| 7 | Riyadh delivery with a real fee | Done | Five zones seeded (center/north/east/west/south); owner edits fees. |
| 8 | Arabic UI on public rent | Done (code) | Cookie locale + RTL; gear names still English from DB. |
| 9 | Animated `/rent` hero | Done (code) | Full-bleed tungsten/daylight hero. |

## Open work

PR for zones + Arabic + hero + hosting plan. After merge: Barakat apply `0013` then redeploy app.

## Next up, in order

1. Apply **0013** on Barakat + redeploy (see `docs/BARAKAT-CLAUDE-TASK.md`).
2. Owner alert / email on new hold.
3. Execute 0–3 month hosting plan (`docs/HOSTING-BACKEND-PLAN.md`): backups, git deploy hygiene, health alerts.

## Waiting on the user

- Paste the Barakat task after this PR merges.
- Business name + first bookable kit for a live smoke hold.
- Business WhatsApp when you want that path live.

## Known problems

- Build should pass without a database after PR #5.
- IP rate-limit is in-process only.
- Tracker canvas cannot load remote images; use repo `docs/tracker-shots/` or chat artifacts.
- Barakat deploy folder is not a git checkout; sha lives in `.deployed-from-sha`.
- Until **0013** is applied, Owner → Settings zone form and delivery reserves that require zones will fail against live DB.

## Log

- 23 Nov: public kit page and 24-hour holds. PR #1 merged.
- 24 Nov: PRs #2–#16 merged. Tracker shots + competitive rates. Barakat apply + redeploy @ `e9975b5`.
- 24 Nov, 3:15 AM Riyadh: Redeploy confirmed (`/rent` 200).
- 24 Nov, 3:25 AM Riyadh: Built per-zone delivery (0013), Arabic `/rent`, animated hero, hosting/backend plan 0–3 and 3–5 months.
