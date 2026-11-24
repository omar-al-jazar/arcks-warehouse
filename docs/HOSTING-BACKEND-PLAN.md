# ARC hosting & backend plan

Written 24 Nov 2026 (Riyadh). Assumes live Barakat Mac Pro + Tailscale + Docker Compose self-hosted Supabase (current state after migrations 0007–0012 and app redeploy).

## Now (baseline)

| Piece | Where it lives |
|---|---|
| Next.js app | Docker `app` on Barakat (`:3001`) |
| Postgres / Auth / Kong / Storage | Same compose stack on Barakat |
| Public `/rent` + owner desk | Same origin through reverse proxy / LAN |
| Ops | Claude Code on Barakat (Tailscale); Cursor Cloud cannot join the tailnet |

Risks today: single machine, no automated offsite backup of Postgres, deploy folder is not a git checkout (sha in `.deployed-from-sha`), IP rate-limit is in-process only.

---

## Months 0–3 — harden what you have

Goal: keep Barakat as the source of truth, make failure recoverable, and stop manual-only deploys from being the only path.

1. **Backups**
   - Nightly `pg_dump` to encrypted offsite (S3-compatible or another Mac on Tailscale).
   - Monthly restore drill into a throwaway compose project.
2. **Deploy hygiene**
   - Make the live folder a real `git` checkout of `main`, or a rsync from a bare clone, so redeploy always matches a SHA.
   - Keep `scripts/barakat-redeploy-app.sh` + one-file migration apply scripts; document “pull → migrate → rebuild app” as the only path.
3. **Observability**
   - App + Postgres disk/health checks with a simple alert (email or WhatsApp to Omar).
   - Retain app logs 14 days; surface 5xx and failed reserves.
4. **Secrets**
   - Confirm `.env` is not in backups that leave the machine; rotate service-role key once.
5. **Product backend (small)**
   - Owner alert/email on new hold (nodemailer already in deps).
   - Persist rate-limit counters (Redis or Postgres) so multi-replica later does not reset.
   - Keep delivery zones + WhatsApp settings owner-editable (no hardcodes).

Out of scope for 0–3: multi-region, Kubernetes, managed Supabase migration, payment capture.

---

## Months 3–5 — scale the backend without rewriting the product

Goal: separate “public rental traffic” from “warehouse desk” so a busy `/rent` day cannot take down checkout.

1. **Split read path (optional first step)**
   - Read replica or nightly logical replica for public catalog + availability if Postgres CPU becomes the bottleneck.
   - Holds still write to primary via service role.
2. **Managed Postgres decision**
   - If Barakat disk/UPS risk grows: move **only Postgres** to a managed provider in a nearby region (or keep self-host but on a second always-on box). Keep Auth/Kong colocated with the app until Auth migration is planned.
3. **App hosting**
   - Either stay on Barakat behind Caddy/nginx with TLS, or put the Next.js app on a small VPS / container host that talks to Postgres over a private network (Tailscale or VPC). Prefer one hop, not edge serverless — Server Actions + service role expect a stable Node process.
4. **Media**
   - Kit photos in Supabase Storage (or object storage) with CDN; stop relying on ad-hoc external image hosts.
5. **Payments (if you start collecting)**
   - Hold remains free; add a confirmed-booking payment step (Moyasar / HyperPay) with webhook → `bookings` status. Do not put card data in Postgres.
6. **Arabic / zones ops**
   - Bilingual `equipment.name_ar` / `kit_contents` when inventory editing needs it.
   - Zone fee history only if accountants ask; until then snapshot on the booking row is enough.

---

## Decision gates

| Signal | Action |
|---|---|
| One restore drill fails | Fix backup before any new feature |
| `/rent` latency or 5xx spikes on Barakat | Move app or add read replica (3–5 plan) |
| Need public HTTPS hostname | Terminate TLS on Barakat or fronting VPS; keep service role off the public internet |
| Second rental house / second city | New `delivery_zones` rows + settings tenant — do **not** fork the DB |

## Explicit non-goals through month 5

- Rewriting off Next.js / Supabase
- Realtime multiplayer inventory UI
- Full marketplace / multi-vendor
- Replacing Tailscale access for staff with a complex VPN product
