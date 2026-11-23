# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 2:28 AM Riyadh time, by Cursor.

## Now: Phase 1, one bookable kit

A customer finds a kit, picks dates, sees the full price, and reserves it with a 24-hour hold. The one number that matters is the time from landing on the site to a held reservation.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/[barcode]`. Availability uses `stockBlocks`. Day rates: migration `0012` sets competitive Riyadh prices on unset rows (this PR). |
| 2 | "What arrives" list | Done | Owner edits kit contents; public page lists them. |
| 3 | Price: days × day rate + delivery + 15% VAT | Done | Quote stored on each hold (PR #3). Delivery fee left unset on purpose for now. |
| 4 | Reserve holds the gear for 24 hours | Done | Overlap + rate-limit (#11). Expired holds labelled (#12). |
| 5 | WhatsApp and email confirmation | Partly built | Button opens Settings number (#10). Business WhatsApp left unset on purpose for now. |
| 6 | Owner's stock calendar | Done | Owner → Calendar / Bookings. |
| 7 | Riyadh delivery with a real fee | Done | Settings field exists; fee not set yet (skipped). |

## Open work

None waiting on review once this PR merges. Live DB still needs migrations **0008–0012** applied on the Barakat / gearroom Supabase (cloud agents cannot reach Tailscale).

## Next up, in order

1. Apply `supabase/migrations/0008`–`0012` on the live Postgres (`docker compose exec -T db psql -U postgres -d postgres < file`).
2. Owner alert / email on new hold (deferred).
3. Per-zone delivery, Arabic UI, animated hero — deferred on purpose.

## Waiting on the user

- Open the **barakat** Claude Code session and paste the one message in `docs/BARAKAT-CLAUDE-TASK.md` (applies `0008`–`0012` via `scripts/barakat-apply-migrations.sh`). Cursor Cloud is outside Tailscale.
- Send the business name and the first bookable kit when ready.
- Set delivery fee / business WhatsApp later if you want those paths live.

## Known problems

- Build should pass without a database after PR #5.
- IP rate-limit is in-process only.
- Tracker canvas cannot load remote images; shots are embedded as data URLs in the Arabic tracker.

## Log

- 23 Nov: public kit page and 24-hour holds. PR #1 merged.
- 24 Nov: PRs #2–#13 merged. Tracker shots refreshed with Mini LF @ SAR 3,800 preview. Migration 0012 adds competitive day rates for unset rows (this branch).
- 24 Nov (later): Added `scripts/barakat-apply-migrations.sh` + `docs/BARAKAT-CLAUDE-TASK.md` for Claude Remote Control on Barakat to apply 0008–0012.
