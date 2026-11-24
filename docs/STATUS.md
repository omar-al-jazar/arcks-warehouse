# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 12:12 PM Riyadh time, by Cursor.

## Now: Arabic live on Barakat — domain purchased (name TBD)

Barakat app @ `7719ed7` (rsync + rebuild; folder is still not a git checkout). `/rent` is Arabic by default (`data-locale=ar`, `dir=rtl`). Gear names stay English.

Omar bought the public domain (exact hostname not recorded yet). Next: DNS → TLS → brand string.

| Area | Status |
|---|---|
| Phase 1–2 + security + Arabic/Thmanyah | Live @ `7719ed7` |
| Brag video | `brag-output/brag.mp4` on `main` |
| Official domain / HTTPS | Domain purchased — DNS/TLS not started |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

Wire the new domain (DNS + HTTPS). Need the exact hostname from Omar.

## Next up, in order

1. Record domain name → Porkbun DNS → TLS edge → point at public edge per `docs/HOSTING-BACKEND-PLAN.md`.
2. Replace `[YOUR BRAND]` once brand string is final.
3. Owner alert / email on new hold.
4. PCA gaps: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- Paste the exact domain (e.g. `example.com`) and preferred apex vs `www`.
- WhatsApp business number when ready.

## Known problems

- Login limiter shared-bucket risk behind `tailscale serve` if no per-client IP. Clear: `docker compose restart app` on Barakat.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is **not** a git checkout — deploy via rsync from a Tailscale machine, then `docker compose build app && up -d --no-deps app`. Redeploy script’s `git pull` fails until that is fixed.

## Log

- 24 Nov, 4:18 AM: Security live @ `d559aef`.
- 24 Nov, 4:38 AM: #28 merged (`7719ed7`).
- 24 Nov, 12:12 PM Riyadh: Rsync `7719ed7` → Barakat; rebuild; `/` `/login` `/rent` `/rent/CAM-0005` 200; `data-locale=ar`. Domain purchased (hostname TBD).
