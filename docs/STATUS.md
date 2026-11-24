# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:38 AM Riyadh time, by Cursor.

## Now: Arabic-default merged — redeploy Barakat

`#28` merged @ `7719ed7`. Public `/rent` defaults to Arabic (gear names English). Thmanyah self-hosted. Brag at `brag-output/brag.mp4`. **Barakat still on `d559aef` until redeploy.**

| Area | Status |
|---|---|
| Phase 1–2 product (kits, zones, Arabic, hero) | Live (older SHA) |
| Security hardening (#25) | Live @ `d559aef` |
| Arabic default + Thmanyah (#28) | On `main` @ `7719ed7` — **not live on Barakat yet** |
| Brag video | `brag-output/brag.mp4` |
| Official domain / HTTPS | Planned; not started |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

Redeploy Barakat to `7719ed7` (Cloud/this session cannot SSH Tailscale without approval).

## Next up, in order

1. Redeploy Barakat → confirm `/rent` Arabic by default.
2. Owner alert / email on new hold.
3. Domain → DNS → HTTPS (`docs/HOSTING-BACKEND-PLAN.md`).
4. Production gaps from the PCA-style review: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- Redeploy (or approve SSH redeploy): `ssh barakat` then sync to `7719ed7` and run `bash scripts/barakat-redeploy-app.sh`.
- Domain / brand / WhatsApp when ready.

## Known problems

- Login limiter is an in-process map keyed on `X-Forwarded-For` or `X-Real-IP` (8 failures / 15 min). Staff via `tailscale serve` may share one bucket. Clear: `ssh barakat 'cd ~/arcks-warehouse-shadcn && docker compose restart app'`.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Barakat deploy folder is not a git checkout.

## Log

- 24 Nov, 4:00 AM Riyadh: Kits live @ `689b761`.
- 24 Nov, 4:05 AM: Security #25 merged (`d559aef`).
- 24 Nov, 4:18 AM: Security redeploy confirmed on Barakat.
- 24 Nov, 4:36 AM: Arabic + Thmanyah + brag committed (`12f6c2d`).
- 24 Nov, 4:38 AM: #28 merged (`7719ed7`). Redeploy pending.
