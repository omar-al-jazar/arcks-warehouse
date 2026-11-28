# ARC status

The only handoff between Cursor and Claude Code (the old `LOCAL-HANDOFF.md` and `BARAKAT-CLAUDE-TASK.md` are gone). Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 27 Nov 2026, 9:10 PM Riyadh time, by Claude.

## Now: idle, 4 of 7 photos fixed (`claude/photos-4`)

`https://arcfilmrental.com` serves `/rent` through the Cloudflare tunnel (`arc-rent` → Barakat `127.0.0.1:3001`). Porkbun NS → Cloudflare (`ace` / `haley`).

**Shop (merged in #32):** signed-out `/` → `/rent`; full-viewport hero (Lighting Equipment lockup, one Arabic headline, CTA smooth-scrolls to `#camera`); three chapter screens (camera / lighting / grip); full list at `/rent/gear`; logo PNGs in `public/lighting-*.png`; `presentPublicGear` + `kitRank` prefer kit/package leads. Hold copy/code is 10 minutes.

**Live DB (Barakat only, not a migration):** kit id `130` = **Grip package** (Stingers, clamps, and flags.). Deploy folder is **not** a git checkout — rsync, then `docker compose build app && up -d --no-deps app` (use `--no-cache` if COPY layers look stale).

| Area | Status |
|---|---|
| Phase 1–2 + security + Arabic/Thmanyah | Live |
| Shop hero + chapters + logo lockup | Merged (#32, `d2f640c`); live |
| Junk photo filter | Merged (#33); live |
| Chapter leads with a photo | Merged (#34); live |
| CI (lint, tsc, tests, build) | Merged (#35, `8ce8f32`); runs on every PR and push to `main` |
| Grip package rename (id 130) | Live in Barakat Postgres |
| Photos for LGT-0080, GRP-0018, GRP-0031, CAM-0019 | Live in Barakat Postgres (hotlinked vendor images) |
| Brag video | `brag-output/brag.mp4` on `main` |
| Official domain / HTTPS | `arcfilmrental.com` live via Cloudflare tunnel |
| Meta / copy brand string | `[YOUR BRAND]` is the hero brand and every public page title (`lib/rent/i18n.ts`) |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

1. Real photos for the last 3 pieces: GRP-0005 Grip package (own bundle), LGT-0079 Barkan (`/equipment/barkan.jpg` does not exist), LGT-0081 "Pipelight Pank 88" (real product name unclear). CAM-0019 uses a DZOFilm family shot; swap for a photo of the actual kit. Then chapter polish.
2. Replace `[YOUR BRAND]` in meta/copy once the public name is final (logo files are in `public/`).
3. Owner alert / email on new hold.
4. PCA gaps: durable rate limits (both limiters are in-process `Map`s), reserve idempotency, decimal money, audit trail.
5. Hosting gaps (see `docs/HOSTING-BACKEND-PLAN.md`): HSTS, nightly offsite backup, uptime check, fix `scripts/barakat-redeploy-app.sh`.

## Next up, in order

1. Omar's own photos for the 3 pieces above; chapter polish.
2. Brand string + WhatsApp when Omar supplies them.
3. Owner email on hold; then PCA and hosting hardening.

## Waiting on the user

- Confirm public brand string (logo PNGs are in the repo).
- WhatsApp business number when ready.

## Known problems

- Login limiter shared-bucket risk behind `tailscale serve` if no per-client IP. Clear: `docker compose restart app` on Barakat.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is **not** a git checkout — rsync from a Tailscale machine, then rebuild app. `scripts/barakat-redeploy-app.sh` `git pull` fails until that is fixed.
- `npm run lint` may still flag an unescaped apostrophe in `components/rent/kit-booking.tsx`.
- Cloud agents cannot reach Barakat Tailscale; deploy/verify from Omar’s laptop (`ssh barakat`).
- `WEBAUTHN_RP_ID` / `WEBAUTHN_RP_ORIGINS` on Barakat's `.env` not checked against `arcfilmrental.com`.

## Log

- 24 Nov, 4:18 AM: Security live @ `d559aef`.
- 24 Nov, 4:38 AM: #28 merged (`7719ed7`).
- 24 Nov, 12:12 PM Riyadh: Rsync `7719ed7` → Barakat; rebuild; `/` `/login` `/rent` `/rent/CAM-0005` 200; `data-locale=ar`. Domain purchased (hostname TBD).
- 24 Nov, 1:46 PM Riyadh: `/` for a signed-out visitor redirects to `/rent`. Staff sign-in stays at `/login`.
- 24 Nov, 2:05 PM Riyadh: `/rent` gear is a product grid (picture, English name, day rate). Barcode rows are gone. Admin link points at the current `/login`.
- 24 Nov, 2:30 PM Riyadh: Each category is a full-screen chapter. Pieces slide sideways as large posters, photo first.
- 24 Nov, 2:28 PM Riyadh: A new reserve holds the dates for 10 minutes. Confirm still clears the clock. Live kit page shows ١٠ دقائق.
- 24 Nov, evening: Cloudflare tunnel + Porkbun NS → CF; domain live.
- 25 Nov, ~6:20 PM Riyadh: Hero (lockup + Arabic + smooth `#camera` CTA) + **Grip package** rename deployed to Barakat via rsync/`--no-cache` rebuild. GitHub still behind.
- 26 Nov, 10:05 PM Riyadh: STATUS rewritten for Claude handoff. Uncommitted shop files remain on `cursor/public-home-is-shop`.
- 26 Nov, 10:05 PM Riyadh: #32 merged (`d2f640c`).
- 26 Nov, 10:31 PM Riyadh: Shop and stock search now skip `.ico`/`.svg`/`.gif`, logo, icon, diagram and spinner URLs (`lib/photo-url.ts`). Found 7 bad pieces by scanning all 67 live kit pages.
- 26 Nov, ~10:40 PM Riyadh: #33 deployed (rsync without deletes; app rebuilt). Grip chapter went blank: its lead had only the junk GIF.
- 26 Nov, 10:55 PM Riyadh: #34 each chapter leads with its top piece that has a photo; deployed.
- 26 Nov, 11:10 PM Riyadh: CI added (lint, tsc, `npm test`, placeholder build) on PRs and `main`.
- 27 Nov, 4:29 PM Riyadh: #35 merged (`8ce8f32`); first CI run green.
- 27 Nov, 7:55 PM Riyadh: Docs drift check. Removed the stale Cursor/Barakat handoff docs; hosting plan status refreshed.
- 27 Nov, 9:10 PM Riyadh: PR #31 closed. Live DB photos set for LGT-0080 (Antari), GRP-0018 (Matthews flag), GRP-0031 (bounce board, replaces trampoline), CAM-0019 (DZO family shot). All 4 kit pages show them; image URLs return 200.
