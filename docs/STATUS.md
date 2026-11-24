# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 1:46 PM Riyadh time, by Cursor.

## Now: `arcfilmrental.com` opens the rental catalog

Signed-out visitors who open `/` are sent to `/rent` (Arabic shop, gear names in English). Signed-in staff still land on `/owner` or `/manager`. Sign-in stays at `/login`, with no link from the shop.

`https://arcfilmrental.com` is already serving this app through the Cloudflare tunnel. The public name on the shop is still the placeholder `[YOUR BRAND]`.

| Area | Status |
|---|---|
| Phase 1–2 + security + Arabic/Thmanyah | Live @ `7719ed7` |
| Brag video | `brag-output/brag.mp4` on `main` |
| Official domain / HTTPS | `arcfilmrental.com` live via Cloudflare tunnel |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

1. Redeploy this homepage change to Barakat (rsync + rebuild app) so the live domain matches.
2. Replace `[YOUR BRAND]` once the public name and logo file are in the repo.

## Next up, in order

1. Redeploy so live `/` matches this branch, then replace `[YOUR BRAND]` with the real name and logo.
2. Owner alert / email on new hold.
3. PCA gaps: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- The logo file and the public name, so `[YOUR BRAND]` can come off the shop.
- WhatsApp business number when ready.

## Known problems

- Login limiter shared-bucket risk behind `tailscale serve` if no per-client IP. Clear: `docker compose restart app` on Barakat.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is **not** a git checkout — deploy via rsync from a Tailscale machine, then `docker compose build app && up -d --no-deps app`. Redeploy script’s `git pull` fails until that is fixed.

## Log

- 24 Nov, 4:18 AM: Security live @ `d559aef`.
- 24 Nov, 4:38 AM: #28 merged (`7719ed7`).
- 24 Nov, 12:12 PM Riyadh: Rsync `7719ed7` → Barakat; rebuild; `/` `/login` `/rent` `/rent/CAM-0005` 200; `data-locale=ar`. Domain purchased (hostname TBD).
- 24 Nov, 1:46 PM Riyadh: `/` for a signed-out visitor redirects to `/rent`. Staff sign-in stays at `/login`.
