# Finish on Omar’s machine (Tailscale), not Cloud

Cursor **Cloud** agents cannot join Barakat’s Tailscale. Final deploy/verify steps must run from a Cursor session on a machine that can `ssh barakat` (Omar’s laptop, or any host already on the tailnet).

## Do this once locally

1. Open `omar-al-jazar/arcks-warehouse` in **Cursor Desktop** on a Tailscale-connected machine.
2. Confirm: `ssh barakat 'hostname'` (or your usual Barakat host alias) works.
3. Start a new agent (or continue) with the prompt below — no Barakat Claude paste required if SSH works.

## Prompt for the local agent

```
Continue ARC from docs/STATUS.md and docs/LOCAL-HANDOFF.md.

You have Tailscale/SSH to Barakat. Do NOT ask Omar to paste to Barakat Claude.

1. Redeploy security build (main @ d559aef or newer):
   - Sync ~/arcks-warehouse-shadcn (or REPO_DIR) to origin/main
   - bash scripts/barakat-redeploy-app.sh over SSH (or run on the server)
   - Confirm /rent, /rent/CAM-0005, /login = 200; owner routes 307 logged out
   - Check response headers: X-Frame-Options DENY, X-Content-Type-Options nosniff
   - Update .deployed-from-sha and docs/STATUS.md

2. Smoke: open a kit, pick dates + a Riyadh zone, reserve (or dry-run the quote UI). Note WhatsApp still unset.

3. Next product work in order unless Omar says otherwise:
   - Owner alert/email on new hold
   - Domain DNS + HTTPS per docs/HOSTING-BACKEND-PLAN.md (Porkbun account already has domains)
   - Business WhatsApp when Omar provides the number

Decide and merge without asking. Prefer SSH to Barakat over Remote Control paste.
```

## Still true

- Live Phase 2 UI is already on Barakat (kits/zones/Arabic/hero) @ `689b761` until this security redeploy.
- Security hardening is on `main` (`d559aef`) but **not** confirmed live until the local redeploy above.
- DB: 0013 zones applied; WhatsApp/delivery house fee optional.
