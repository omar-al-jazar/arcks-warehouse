# ARC hosting & backend plan

Written 24 Nov 2026 (Riyadh); revised same day to put **domain + official public website** first. Status marks refreshed 27 Nov 2026.

Assumes live Barakat Mac Pro + Tailscale + Docker Compose self-hosted Supabase (migrations through **0013**).

## Now (baseline)

| Piece | Where it lives |
|---|---|
| Next.js app | Docker `app` on Barakat (`:3001`) |
| Postgres / Auth / Kong / Storage | Same compose stack on Barakat |
| Public `/rent` + owner desk | Same origin: `https://arcfilmrental.com` (Porkbun NS → Cloudflare → tunnel `arc-rent` → Barakat `127.0.0.1:3001`) |
| Ops | Claude Code on Omar's laptop over `ssh barakat` (Tailscale). Deploy = rsync (folder is not a git checkout) → `docker compose build app && up -d --no-deps app` |
| CI | GitHub Actions on every PR and push to `main`: lint, tsc, tests, placeholder build |

Risks today: single machine, no automated offsite Postgres backup, deploy folder is not a git checkout (sha in `.deployed-from-sha`), rate limits are in-process `Map`s that reset on restart.

---

## Months 0–3 — official site on a real domain, then harden

Goal: customers reach ARC on **your domain over HTTPS**, while Barakat stays recoverable.

### A. Domain & official website (do this first)

1. **Buy the domain** — **done**: `arcfilmrental.com` (24 Nov 2026).
2. **DNS** — **done** via Cloudflare Tunnel (no public IP exposed). The bullets below were the original options.
   - `A`/`AAAA` (or CNAME) for `www` and apex → the public edge (Barakat’s public IP **only if** you accept exposing it, or a small fronting VPS / Cloudflare proxy).
   - Optional: `rent.` or keep everything on apex/`www` with `/rent` as the booking path (current app).
3. **TLS** — **done** at Cloudflare's edge.
   - **Open:** no `Strict-Transport-Security` header yet (`lib/security/headers.ts`). Add once the host is final.
4. **What “official website” means in this codebase**
   - The public face is already `/rent` (hero, catalog, kit pages, Arabic).
   - **Open:** replace `[YOUR BRAND]` in `lib/rent/i18n.ts` (hero and every public page title, both locales).
   - **Done:** signed-out `/` redirects to `/rent` (`app/page.tsx`).
5. **Split public vs staff access**
   - Public: domain → `/rent` (and maybe `/`).
   - Staff (`/owner`, `/manager`, `/login`): keep on Tailscale hostname **or** the same domain behind auth (already PIN/passkey). Prefer not advertising `/owner` in marketing. **Done:** `app/robots.ts` disallows staff routes.
6. **Env / Auth follow-through**
   - Set `WEBAUTHN_RP_ID` / `WEBAUTHN_RP_ORIGINS` (wired in `docker-compose.yml` → GoTrue) to the real domain before passkeys are used from that host. **Unverified** on Barakat's `.env`.
   - Confirm cookies/`sameSite` still work on the apex + `www` choice you pick (pick one canonical host and redirect the other). **Open:** no apex vs `www` decision recorded.

### B. Harden the machine behind the domain

1. **Backups** — **open.** Nightly encrypted `pg_dump` offsite; monthly restore drill.
2. **Deploy hygiene** — **partly.** Today: rsync from a checkout of `main`, then rebuild. `scripts/barakat-redeploy-app.sh` still does `git pull` and fails on the non-git folder; fix the script or make the folder a checkout.
3. **Observability** — **open.** Uptime check on `https://arcfilmrental.com/rent`; disk/Postgres alerts to Omar.
4. **Secrets** — `.env` out of offsite dumps; rotate service-role once; never expose service role on the public internet.
5. **Product backend (small)** — **open:** owner alert/email on new hold; durable rate-limit store.

Out of scope for 0–3: multi-region, Kubernetes, full managed-Supabase cutover, card capture.

---

## Months 3–5 — scale behind the official site

Goal: the **domain stays stable** while the backend behind it can move without a customer-visible rewrite.

1. **Edge stays; origin may move**
   - DNS still points at Cloudflare / VPS / Barakat as you choose.
   - If Barakat should not face the public internet: fronting VPS or Cloudflare Tunnel → private origin on Tailscale. **Done early:** the Cloudflare Tunnel is live.
2. **Split read path** if `/rent` load hurts checkout — replica for catalog/availability; holds still write primary.
3. **Managed Postgres decision** if disk/UPS risk grows — move DB only; app keeps talking over private network.
4. **Media** — kit photos in Storage + CDN on the same domain or a `cdn.` host.
5. **Payments** (optional) — after confirm, Moyasar/HyperPay webhook → booking status; hold stays free.
6. **Arabic inventory** — `name_ar` / bilingual kit contents when you need them on the official site. (Today only delivery zones have `name_ar`.)

---

## Decision gates

| Signal | Action |
|---|---|
| Domain purchased | Wire DNS + TLS + brand string before ads or WhatsApp links go out |
| Passkeys fail on new host | Fix `WEBAUTHN_RP_*` to match the canonical hostname |
| Restore drill fails | Fix backup before marketing spend |
| `/rent` latency or 5xx on public domain | Move origin or add read replica (3–5) |
| Staff URLs showing up in search | robots/`noindex` on `/owner` `/manager` `/login` or keep staff Tailscale-only |

## Explicit non-goals through month 5

- Rewriting off Next.js / Supabase
- Realtime multiplayer inventory UI
- Full marketplace / multi-vendor
- Replacing Tailscale for staff with a heavy VPN product
