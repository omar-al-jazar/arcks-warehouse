# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 1:45 AM Riyadh time, by Cursor.

## Now: Phase 1, one bookable kit

A customer finds a kit, picks dates, sees the full price, and reserves it with a 24-hour hold. The one number that matters is the time from landing on the site to a held reservation.

| # | Step | Status | Where it stands |
|---|---|---|---|
| 1 | Kit page: photo, day rate, dates, live availability | Done | `/rent/[barcode]`. Shows `SAR [RATE]` until the piece has a day rate. |
| 2 | "What arrives" list | Partly built | Owner can edit kit contents (PR #8). Public kit page still shows the piece itself as ×1 until #3 merges, then a follow-up renders `kit_contents`. |
| 3 | Price: days × day rate + delivery + 15% VAT | In PR #3 | The saved delivery fee prices the card, and each hold stores its quote. |
| 4 | Reserve holds the gear for 24 hours | Done | A database constraint refuses overlapping holds. |
| 5 | WhatsApp and email confirmation | Partly built | Owner → Settings can save the business number (PR #6). After reserving, the button still opens the customer's own number. No owner alert, no email. |
| 6 | Owner's stock calendar | In PR #5 | Owner → Calendar shows every piece across 14 Riyadh days. Owner → Bookings lists holds with Confirm and Cancel. |
| 7 | Riyadh delivery with a real fee | In PR #3 | One flat fee, set in Owner → Settings. |

## Open work

- [PR #8](https://github.com/omar-al-jazar/arcks-warehouse/pull/8), `cursor/kit-contents-e030`: owner kit contents on Inventory → Edit, migration 0011. Public page not wired yet. Waiting for review.
- [PR #7](https://github.com/omar-al-jazar/arcks-warehouse/pull/7), `cursor/tracker-shots-e030`: screenshots for the Arabic live tracker. Waiting for review.
- [PR #6](https://github.com/omar-al-jazar/arcks-warehouse/pull/6), `cursor/business-whatsapp-e030`: business WhatsApp in Owner → Settings, migration 0010. Customer button not wired yet. Waiting for review.
- [PR #3](https://github.com/omar-al-jazar/arcks-warehouse/pull/3), `cursor/delivery-fee-quote-7f28`: delivery fee in public quotes, each hold stores its quote, migration 0009. Waiting for review.
- [PR #5](https://github.com/omar-al-jazar/arcks-warehouse/pull/5), `cursor/owner-stock-calendar-7f28`: Owner → Calendar, and `/rent` renders on every visit. Shares no files with PR #3. Waiting for review.
- [PR #2](https://github.com/omar-al-jazar/arcks-warehouse/pull/2), `cursor/cloud-agent-notes-9e65`: setup notes for Cursor cloud agents in `AGENTS.md`. Waiting for review.

## Next up, in order

These need open PRs merged first (they share files with #3 or depend on #6/#8).

1. After reserving, open WhatsApp to the business number from PR #6 (prefilled with the hold details). Hide the button while no number is set. Needs PR #3 and PR #6 merged first.
2. Render `kit_contents` under “What arrives” on the public kit page. Needs PR #3 and PR #8 merged first.
3. Rate-limit the public reserve form.
4. Show expired holds as expired in Owner → Bookings. Today they read "held" until the next reserve on that piece, although their dates open on time.
5. Once PR #3 and PR #5 have merged, make `blocksFor` in `lib/rent/catalog.ts` call `stockBlocks` from `lib/rent/stock.ts`, so the kit page and the calendar share one blocking rule.

Not planned yet, on purpose: per-zone delivery fees, email, Arabic, an animated hero.

## Waiting on the user

- Review and merge PR #3, #5, #6, #8, #7 and this handoff (PR #4), then PR #2.
- Set the delivery fee (Owner → Settings) and a day rate on at least one piece (Owner → Inventory → Edit).
- Send the business name, its WhatsApp number, and the first bookable kit.
- Apply migration 0008 to the live Supabase now; 0009 after #3; 0010 after #6; 0011 after #8.

## Known problems

- On `main`, `next build` fails without a database: `/rent` is prerendered at build time and queries Supabase. The Docker build fails the same way. PR #5 fixes it: the build passes with PR #5 alone, and with PRs #3, #4 and #5 merged together.

## Log

- 23 Nov: public kit page and 24-hour holds (`2893bf8`). PR #1, rental settings and owner bookings, merged (`02efb32`).
- 24 Nov: PR #3 (delivery fee), PR #4 (Claude Code handoff), PR #5 (stock calendar), PR #6 (business WhatsApp), PR #7 (tracker shots) and PR #8 (kit contents) opened.
