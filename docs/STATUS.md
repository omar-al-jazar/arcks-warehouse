# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:36 AM Riyadh time, by Cursor.

## Now: Arabic-default + Thmanyah (PR open)

Branch `cursor/arabic-default-thmanyah-brag-e030`: public `/rent` defaults to Arabic (gear names stay English as stored). Thmanyah self-hosted. Primary brag at `brag-output/brag.mp4`.

| Area | Status |
|---|---|
| Phase 1–2 product (kits, zones, Arabic, hero) | Live @ `d559aef` |
| Security hardening (#25) | Live @ `d559aef` |
| Arabic default + Thmanyah + localized reserve/WhatsApp | PR — merge then redeploy |
| Brag video | `brag.mp4` + `brag.jpg` rendered (AR default); other tones via `render-all.sh` |
| Official domain / HTTPS | Planned; not started |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

Merge + redeploy Arabic/Thmanyah. Barakat still on `d559aef`.

## Next up, in order

1. Merge Arabic-default PR → redeploy Barakat.
2. Owner alert / email on new hold.
3. Domain → DNS → HTTPS (`docs/HOSTING-BACKEND-PLAN.md`).
4. Production gaps from the PCA-style review: durable rate limits, reserve idempotency, decimal money, audit trail, CI.

## Waiting on the user

- Merge the Arabic + Thmanyah PR (or say merge).
- Domain choice / brand string / WhatsApp number when ready.

## Known problems

- Login limiter is an in-process map keyed on `X-Forwarded-For` or `X-Real-IP` (8 failures / 15 min). Staff reach the app via `tailscale serve :8444` → `127.0.0.1:3001`. If that proxy does not pass a per-client IP, every staff login shares one bucket: 8 wrong PINs lock out all staff for 15 minutes. Clear instantly: `ssh barakat 'cd ~/arcks-warehouse-shadcn && docker compose restart app'`.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.
- Docker build can fail once on a transient Google Fonts fetch; rent pages now self-host Thmanyah so that path should be quieter for `/rent`.
- Barakat deploy folder is not a git checkout.

## Log

- 24 Nov, 4:00 AM Riyadh: Kits live @ `689b761`.
- 24 Nov, 4:05 AM: Security #25 merged (`d559aef`).
- 24 Nov, 4:10 AM: Hand off to local Cursor + Tailscale.
- 24 Nov, 4:18 AM Riyadh: Security redeploy confirmed.
- 24 Nov, 4:18 AM Riyadh: Login limiter risk recorded.
- 24 Nov, 4:36 AM Riyadh: Arabic default (`ar` cookie), Saudi-leaning copy, Thmanyah localFont on `/rent`, localized reserve errors + WhatsApp confirmation, metadata + kit day labels. Gear names / kit labels stay English from DB. Brag Remotion Root + all tones; primary `brag-output/brag.mp4` rendered.
