# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, by Cursor.

## Now: Phase 1, one bookable kit

A customer finds a kit, picks dates, sees the full price, and reserves it with a 24-hour hold. The one number that matters is the time from landing on the site to a held reservation.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/[barcode]`. Shows `SAR [RATE]` until the piece has a day rate. |
| 2 | "What arrives" list | Done | Owner edits kit contents on Inventory → Edit (migration 0011). Public `/rent/[barcode]` lists `kit_contents` under “What arrives”; empty falls back to the piece ×1. |
| 3 | Price: days × day rate + delivery + 15% VAT | Done | The saved delivery fee prices the card, and each hold stores its quote (PR #3). |
| 4 | Reserve holds the gear for 24 hours | Done | A database constraint refuses overlapping holds. |
| 5 | WhatsApp and email confirmation | Partly built | Owner → Settings can save the business number (PR #6). After reserving, the button still opens the customer's own number. No owner alert, no email. |
| 6 | Owner's stock calendar | Done | Owner → Calendar shows every piece across 14 Riyadh days. Owner → Bookings lists holds with Confirm and Cancel (PR #5). |
| 7 | Riyadh delivery with a real fee | Done | One flat fee, set in Owner → Settings (PR #3). |

## Open work

- [PR #7](https://github.com/omar-al-jazar/arcks-warehouse/pull/7), `cursor/tracker-shots-e030`: screenshots for the Arabic live tracker. Waiting for review.
- [PR #2](https://github.com/omar-al-jazar/arcks-warehouse/pull/2), `cursor/cloud-agent-notes-9e65`: setup notes for Cursor cloud agents in `AGENTS.md`. Waiting for review.

## Next up, in order

1. After reserving, open WhatsApp to the business number from PR #6 (prefilled with the hold details). Hide the button while no number is set.
2. Rate-limit the public reserve form.
3. Show expired holds as expired in Owner → Bookings. Today they read "held" until the next reserve on that piece, although their dates open on time.
4. Make `blocksFor` in `lib/rent/catalog.ts` call `stockBlocks` from `lib/rent/stock.ts`, so the kit page and the calendar share one blocking rule.

Not planned yet, on purpose: per-zone delivery fees, email, Arabic, an animated hero.

## Waiting on the user

- Review and merge remaining open PRs (#2, #7) and this public kit-contents follow-up.
- Set the delivery fee (Owner → Settings) and a day rate on at least one piece (Owner → Inventory → Edit).
- Send the business name, its WhatsApp number, and the first bookable kit.
- Apply migrations 0008–0011 to the live Supabase if not already applied.

## Known problems

- On older `main` builds, `next build` failed without a database because `/rent` was prerendered at build time. PR #5 fixed that; current `main` should build without a live Supabase.

## Log

- 23 Nov: public kit page and 24-hour holds (`2893bf8`). PR #1, rental settings and owner bookings, merged (`02efb32`).
- 24 Nov: PR #3 (delivery fee), PR #4 (Claude Code handoff), PR #5 (stock calendar), PR #6 (business WhatsApp), PR #7 (tracker shots) and PR #8 (kit contents) opened; #3, #4, #5, #6, #8 merged. Public “What arrives” now renders `kit_contents`.
