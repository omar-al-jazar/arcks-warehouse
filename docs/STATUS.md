# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 1:52 AM Riyadh time, by Cursor.

## Now: Phase 1, one bookable kit

A customer finds a kit, picks dates, sees the full price, and reserves it with a 24-hour hold. The one number that matters is the time from landing on the site to a held reservation.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/[barcode]`. Shows `SAR [RATE]` until the piece has a day rate. |
| 2 | "What arrives" list | Done | Owner edits kit contents on Inventory → Edit (migration 0011). Public `/rent/[barcode]` lists `kit_contents` under “What arrives”; empty falls back to the piece ×1. |
| 3 | Price: days × day rate + delivery + 15% VAT | Done | The saved delivery fee prices the card, and each hold stores its quote (PR #3). |
| 4 | Reserve holds the gear for 24 hours | Done | Overlap constraint + IP/phone rate-limit (PR #11). Owner → Bookings shows expired holds as Expired and blocks Confirm (this PR). |
| 5 | WhatsApp and email confirmation | Partly built | After reserve, the button opens the business number from Owner → Settings (PR #10). Hidden when unset. No owner alert, no email. |
| 6 | Owner's stock calendar | Done | Owner → Calendar shows every piece across 14 Riyadh days. Owner → Bookings lists holds with Confirm and Cancel (PR #5). |
| 7 | Riyadh delivery with a real fee | Done | One flat fee, set in Owner → Settings (PR #3). |

## Open work

None waiting on review. PRs #2–#11 are merged to `main`.

## Next up, in order

1. Make `blocksFor` in `lib/rent/catalog.ts` call `stockBlocks` from `lib/rent/stock.ts`, so the kit page and the calendar share one blocking rule.

Not planned yet, on purpose: per-zone delivery fees, email, Arabic, an animated hero.

## Waiting on the user

- Set the delivery fee and business WhatsApp (Owner → Settings) and a day rate on at least one piece (Owner → Inventory → Edit).
- Send the business name, its WhatsApp number, and the first bookable kit.
- Apply migrations 0008–0011 to the live Supabase if not already applied.

## Known problems

- Build should pass without a database after PR #5 (`/rent` is dynamic). Re-check if prerender errors return.
- IP rate-limit is in-process only; multi-instance deploys share the phone limit via `bookings.created_at`, not the IP map.

## Log

- 23 Nov: public kit page and 24-hour holds (`2893bf8`). PR #1, rental settings and owner bookings, merged (`02efb32`).
- 24 Nov: PRs #2–#11 merged to `main`. Rate-limit on public reserve (#11). Expired holds labelled in Owner → Bookings (this branch).
