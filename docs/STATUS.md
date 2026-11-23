# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 2:44 AM Riyadh time, by Cursor.

## Now: Phase 1, one bookable kit

A customer finds a kit, picks dates, sees the full price, and reserves it with a 24-hour hold. The one number that matters is the time from landing on the site to a held reservation.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/[barcode]`. Availability uses `stockBlocks`. Live DB: all 140 pieces have `day_rate_sar` (min 40, max 3800, avg 364). |
| 2 | "What arrives" list | Done | `kit_contents` column live; public page lists contents when set. |
| 3 | Price: days × day rate + delivery + 15% VAT | Done | Quote columns on `bookings`. Delivery fee still unset. |
| 4 | Reserve holds the gear for 24 hours | Done | `bookings` table + overlap constraint live. Rate-limit (#11). Expired labels (#12). |
| 5 | WhatsApp and email confirmation | Partly built | Button opens Settings number (#10). `business_whatsapp` still unset. |
| 6 | Owner's stock calendar | Done | Owner → Calendar / Bookings. |
| 7 | Riyadh delivery with a real fee | Done | `rental_settings` row exists; `delivery_fee_sar` unset (skipped). |

## Open work

None waiting on review. Live schema **0007–0012** applied on Barakat (24 Nov). App redeploy from `main` handed to Barakat Claude (`scripts/barakat-redeploy-app.sh`).

## Next up, in order

1. Confirm Barakat app redeploy (Before/After HTTP + HEAD sha).
2. Owner alert / email on new hold (deferred).
3. Per-zone delivery, Arabic UI, animated hero — deferred on purpose.

## Waiting on the user

- Paste the redeploy message in `docs/BARAKAT-CLAUDE-TASK.md` into the **barakat** Claude Code session (or approve if already sent).
- Send the business name and the first bookable kit when ready.
- Set delivery fee / business WhatsApp later if you want those paths live.

## Known problems

- Build should pass without a database after PR #5.
- IP rate-limit is in-process only.
- Tracker canvas cannot load remote images; use repo `docs/tracker-shots/` or chat artifacts.
- Barakat app HTTP 200 but may still be Sep 16 code until redeploy.

## Log

- 23 Nov: public kit page and 24-hour holds. PR #1 merged.
- 24 Nov: PRs #2–#16 merged. Tracker shots + competitive rates migration. Barakat Claude apply script.
- 24 Nov, 2:44 AM Riyadh: Barakat applied **0007–0012**. Before: 140 equipment, no bookings/rental_settings. After: bookings + rental_settings live; 140/140 rates set (40–3800, avg 364); camera 26 / lighting 78 / grip 36; delivery fee and WhatsApp left empty; app HTTP 200.

- 24 Nov, ~2:48 AM Riyadh: Omar approved app redeploy from main; script + Barakat Claude task updated.
