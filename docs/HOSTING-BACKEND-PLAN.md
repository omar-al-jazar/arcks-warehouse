# ARC hosting & backend plan

Written 24 Nov 2026 (Riyadh); revised same day to put **domain + official public website** first — that was always the product intent; the first draft wrongly treated “hosting” as only hardening the existing LAN/Tailscale stack.

Assumes live Barakat Mac Pro + Tailscale + Docker Compose self-hosted Supabase (migrations through **0013** on `main`; live apply may still be pending).

## Now (baseline)

| Piece | Where it lives |
|---|---|
| Next.js app | Docker `app` on Barakat (`:3001`) |
| Postgres / Auth / Kong / Storage | Same compose stack on Barakat |
| Public `/rent` + owner desk | Same origin; **no custom domain / public DNS yet** |
| Ops | Claude Code on Barakat (Tailscale); Cursor Cloud cannot join the tailnet |

Risks today: no official hostname for customers, single machine, no automated offsite Postgres backup, deploy folder may not be a git checkout (sha in `.deployed-from-sha`), IP rate-limit is in-process only.

---

## Months 0–3 — official site on a real domain, then harden

Goal: customers reach ARC on **your domain over HTTPS**, while Barakat stays recoverable.

### A. Domain & official website (do this first)

1. **Buy the domain** (prefer `.sa` if the brand is Saudi-facing; otherwise a clear `.com` you control long-term).
2. **DNS**
   - `A`/`AAAA` (or CNAME) for `www` and apex → the public edge (Barakat’s public IP **only if** you accept exposing it, or a small fronting VPS / Cloudflare proxy).
   - Optional: `rent.` or keep everything on apex/`www` with `/rent` as the booking path (current app).
3. **TLS**
   - Terminate HTTPS with Caddy or nginx (Let’s Encrypt) on the edge.
   - Force HTTPS; HSTS once stable.
4. **What “official website” means in this codebase**
   - The public face is already `/rent` (hero, catalog, kit pages, Arabic).
   - Replace `[YOUR BRAND]` with the real name once chosen.
   - Optional thin marketing home at `/` that points into `/rent` — only if you want a brand page separate from the gear list; not required to go live.
5. **Split public vs staff access**
   - Public: domain → `/rent` (and maybe `/`).
   - Staff (`/owner`, `/manager`, `/login`): keep on Tailscale hostname **or** the same domain behind auth (already PIN/passkey). Prefer not advertising `/owner` in marketing.
6. **Env / Auth follow-through**
   - Set `WEBAUTHN_RP_ID` / `WEBAUTHN_RP_ORIGINS` (and any public URL envs) to the real domain before passkeys are used from that host.
   - Confirm cookies/`sameSite` still work on the apex + `www` choice you pick (pick one canonical host and redirect the other).

### B. Harden the machine behind the domain

1. **Backups** — nightly encrypted `pg_dump` offsite; monthly restore drill.
2. **Deploy hygiene** — live tree is a real `git` checkout of `main` (or rsync from one); only path is pull → migrate → rebuild app.
3. **Observability** — uptime check on `https://your.domain/rent`; disk/Postgres alerts to Omar.
4. **Secrets** — `.env` out of offsite dumps; rotate service-role once; never expose service role on the public internet.
5. **Product backend (small)** — owner alert/email on new hold; durable rate-limit store.

Out of scope for 0–3: multi-region, Kubernetes, full managed-Supabase cutover, card capture.

---

## Months 3–5 — scale behind the official site

Goal: the **domain stays stable** while the backend behind it can move without a customer-visible rewrite.

1. **Edge stays; origin may move**
   - DNS still points at Cloudflare / VPS / Barakat as you choose.
   - If Barakat should not face the public internet: fronting VPS or Cloudflare Tunnel → private origin on Tailscale.
2. **Split read path** if `/rent` load hurts checkout — replica for catalog/availability; holds still write primary.
3. **Managed Postgres decision** if disk/UPS risk grows — move DB only; app keeps talking over private network.
4. **Media** — kit photos in Storage + CDN on the same domain or a `cdn.` host.
5. **Payments** (optional) — after confirm, Moyasar/HyperPay webhook → booking status; hold stays free.
6. **Arabic inventory** — `name_ar` / bilingual kit contents when you need them on the official site.

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
