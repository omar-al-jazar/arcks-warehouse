# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 12:18 PM Riyadh time, by Cursor.

## Now: `arcfilmrental.com` — Caddy ready, DNS not pointed

Canonical host: `https://arcfilmrental.com` (`www` redirects). App stays Arabic on `/rent`.

Caddy on Barakat listens only on `192.168.100.13:80` and `:443` and proxies to `127.0.0.1:3001`. Firewall allows 80/443. Let’s Encrypt is waiting because Porkbun still parks the domain on `207.207.210.*`. No UPnP on the router, so 80/443 must be forwarded by hand to `192.168.100.13`.

| Area | Status |
|---|---|
| Phase 1–2 + security + Arabic/Thmanyah | Live @ `7719ed7` |
| Official domain | `arcfilmrental.com` on Porkbun — DNS not switched |
| HTTPS edge | Caddy container `arc-caddy` — cert pending DNS + port forward |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

1. Porkbun: delete parking records; `A` apex and `www` → `129.208.123.56`.
2. Router: forward TCP 80 and 443 to `192.168.100.13`.
3. Confirm `https://arcfilmrental.com/rent` returns Arabic.

## Next up, in order

1. Finish DNS + router forward (above).
2. Replace `[YOUR BRAND]` when the public name is final.
3. Owner alert / email on new hold.
4. PCA gaps: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- Sign in to Porkbun so DNS can be edited (no API key stored).
- Forward TCP 80 and 443 on the router (`192.168.100.1`) to `192.168.100.13`.

## Known problems

- Login limiter shared-bucket risk behind `tailscale serve` if no per-client IP. Clear: `docker compose restart app` on Barakat.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is **not** a git checkout — deploy via rsync from a Tailscale machine, then `docker compose build app && up -d --no-deps app`. Redeploy script’s `git pull` fails until that is fixed.

## Log

- 24 Nov, 4:18 AM: Security live @ `d559aef`.
- 24 Nov, 4:38 AM: #28 merged (`7719ed7`).
- 24 Nov, 12:12 PM Riyadh: Rsync `7719ed7` → Barakat; rebuild; `/` `/login` `/rent` `/rent/CAM-0005` 200; `data-locale=ar`.
- 24 Nov, 12:18 PM Riyadh: Domain is `arcfilmrental.com`. Caddy (`arc-caddy`) on `192.168.100.13:80/443` → app `:3001`. ufw allows 80/443. No UPnP. Porkbun still parking. Cert waits on A records to `129.208.123.56` plus router forward.
