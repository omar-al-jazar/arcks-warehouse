# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:18 AM Riyadh time, by Cursor.

## Now: Security build live on Barakat

Phase 2 and security hardening are live @ `d559aef` (`.deployed-from-sha`; folder is not a git repo).

| Area | Status |
|---|---|
| Phase 1–2 product (kits, zones, Arabic, hero) | Live |
| Security hardening (#25) | Live @ `d559aef` — headers, robots, open-redirect checks confirmed |
| Official domain / HTTPS | Planned; not started |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

None waiting on a redeploy. Barakat idle.

## Next up, in order

1. Owner alert / email on new hold.
2. Domain → DNS → HTTPS (`docs/HOSTING-BACKEND-PLAN.md`).
3. Production gaps from the PCA-style review: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- Domain choice / brand string / WhatsApp number when ready.
- Say which next item to build.

## Known problems

- Login limiter is an in-process map keyed on `X-Forwarded-For` or `X-Real-IP` (8 failures / 15 min). Staff reach the app via `tailscale serve :8444` → `127.0.0.1:3001`. If that proxy does not pass a per-client IP, every staff login shares one bucket: 8 wrong PINs lock out all staff for 15 minutes. Not tested (testing triggers the lockout). Clear instantly: `ssh barakat 'cd ~/arcks-warehouse-shadcn && docker compose restart app'`. Same shape applies to the public reserve IP cap.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Docker build can fail once on a transient Google Fonts fetch (`@vercel/turbopack-next` font loader); a retry succeeded. Cache or self-host the font if CI hits it.
- Barakat deploy folder is not a git checkout.

## Log

- 24 Nov, 4:00 AM Riyadh: Kits live @ `689b761`.
- 24 Nov, 4:05 AM: Security #25 merged (`d559aef`).
- 24 Nov, 4:10 AM: Hand off to local Cursor + Tailscale.
- 24 Nov, 4:18 AM Riyadh: Security redeploy confirmed. `/` `/login` `/rent` kits `/robots.txt` 200; owner/manager 307 → `/login?next=…`; CSP, nosniff, DENY, referrer, permissions-policy present; `X-Powered-By` absent; open redirects dropped; DB unchanged (5 zones, 140 equipment); 0 app errors. First image build failed on Google Fonts, retry succeeded.
- 24 Nov, 4:18 AM Riyadh: Login limiter risk recorded (shared bucket behind tailscale serve if no per-client IP). Restart `app` clears it. Not tested.
