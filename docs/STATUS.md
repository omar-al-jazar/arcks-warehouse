# ARC status

The handoff between Cursor and Claude Code. Whoever finishes a task updates this file in the same pull request. GitHub is newer than this file: check open pull requests and unmerged branches before trusting it.

Last updated 24 Nov 2026, 4:10 AM Riyadh time, by Cursor Cloud.

## Now: Finish on Omar’s local Cursor (Tailscale)

Cloud cannot SSH to Barakat. **Next work runs on Omar’s machine** with Tailscale — see `docs/LOCAL-HANDOFF.md`.

| Area | Status |
|---|---|
| Phase 1–2 product (kits, zones, Arabic, hero) | Live on Barakat @ `689b761` |
| Security hardening (#25) | On `main` @ `d559aef` — **redeploy pending** |
| Official domain / HTTPS | Planned; not started |
| Business WhatsApp | Unset |
| Owner email on hold | Not built |

## Open work

1. Local agent: redeploy `d559aef`+ to Barakat and verify headers + kit HTTP 200.
2. Owner alert / email on new hold.
3. Domain → DNS → HTTPS (`docs/HOSTING-BACKEND-PLAN.md`).

## Waiting on the user

- Open this repo in **Cursor Desktop on a Tailscale machine** and paste the prompt in `docs/LOCAL-HANDOFF.md`.
- Domain choice / brand string / WhatsApp number when ready.

## Known problems

- Cloud agents cannot reach Tailscale; do not rely on Barakat Claude paste if local SSH works.
- IP / login rate limits are in-process per container.
- CSP still allows `'unsafe-inline'` / `'unsafe-eval'` until nonces.

## Log

- 24 Nov, 4:00 AM Riyadh: Kits live @ `689b761`.
- 24 Nov, 4:05 AM: Security #25 merged (`d559aef`).
- 24 Nov, 4:10 AM: Hand off to local Cursor + Tailscale (`docs/LOCAL-HANDOFF.md`).
