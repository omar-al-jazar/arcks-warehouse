# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 26 Nov 2026, 10:05 PM Riyadh time, by Cursor (handoff to Claude).

## Now: public shop hero + chapters on GitHub (merge this PR, then `/continue` in Claude)

`https://arcfilmrental.com` serves `/rent` through the Cloudflare tunnel (`arc-rent` → Barakat `127.0.0.1:3001`). Porkbun NS → Cloudflare (`ace` / `haley`).

**This branch:** signed-out `/` → `/rent`; full-viewport hero (Lighting Equipment lockup, one Arabic headline, CTA smooth-scrolls to `#camera`); three chapter screens (camera / lighting / grip); full list at `/rent/gear`; logo PNGs in `public/lighting-*.png`; `presentPublicGear` + `kitRank` prefer kit/package leads. Hold copy/code is 10 minutes.

**Live DB (Barakat only, not a migration):** kit id `130` = **Grip package** (Stingers, clamps, and flags.). Deploy folder is **not** a git checkout — rsync, then `docker compose build app && up -d --no-deps app` (use `--no-cache` if COPY layers look stale).

| Area | Status |
|---|---|
| Phase 1–2 + security + Arabic/Thmanyah | Live |
| Shop hero + chapters + logo lockup | On this PR; already rsynced live |
| Grip package rename (id 130) | Live in Barakat Postgres |
| Brag video | `brag-output/brag.mp4` on `main` |
| Official domain / HTTPS | `arcfilmrental.com` live via Cloudflare tunnel |
| Meta / copy brand string | Still `[YOUR BRAND]` in places |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

1. Merge this PR, then type `/continue` in Claude Code.
2. Polish chapters / remaining bad equipment photos (DZOFilm `.ico`, Flag 1m SVG logo, Grip package processing.gif if still set, Bounce trampoline, Pipelight diagram, Barkan missing path).
3. Replace `[YOUR BRAND]` in meta/copy once the public name is final (logo files are in `public/`).
4. Owner alert / email on new hold.
5. PCA gaps: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Next up, in order

1. Merge this PR → `/continue` in Claude Code.
2. Chapter polish + photo cleanup for junk URLs.
3. Brand string + WhatsApp when Omar supplies them.
4. Owner email on hold; then PCA hardening.

## Waiting on the user

- Confirm public brand string (logo PNGs are in the repo).
- WhatsApp business number when ready.

## Known problems

- Login limiter shared-bucket risk behind `tailscale serve` if no per-client IP. Clear: `docker compose restart app` on Barakat.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is **not** a git checkout — rsync from a Tailscale machine, then rebuild app. `scripts/barakat-redeploy-app.sh` `git pull` fails until that is fixed.
- `npm run lint` may still flag an unescaped apostrophe in `components/rent/kit-booking.tsx`.
- Cloud agents cannot reach Barakat Tailscale; deploy/verify from Omar’s laptop (`ssh barakat`).

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
