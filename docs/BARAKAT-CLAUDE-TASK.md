# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code already runs on this machine via Remote Control — run the job below end-to-end without asking Omar for confirmation of each step. Do not change delivery fee or business WhatsApp.

## Do this

```bash
# Prefer the shadcn ARC app tree; fall back if the name differs
cd ~/arcks-warehouse-shadcn 2>/dev/null || cd ~/arcks-warehouse 2>/dev/null || cd ~/warehouse-tracker

git fetch origin main
git checkout main
git pull origin main

chmod +x scripts/barakat-apply-migrations.sh
bash scripts/barakat-apply-migrations.sh
```

## Then

1. Paste the script’s **After** section back into the Cursor chat (or commit nothing — Cursor only needs the counts).
2. If `db` is not running, start the compose stack that owns the live rental DB, wait until healthy, and re-run the script once.
3. Do not invent rates. Migration `0012` already encodes the competitive schedule.
4. Do not set `delivery_fee_sar` or `business_whatsapp`.

## Paste into the Barakat Code session

Copy everything in the block below as one message to the **barakat** Claude Code session (phone or claude.ai/code):

```
Read docs/BARAKAT-CLAUDE-TASK.md in this repo (or after git pull on main). Then run scripts/barakat-apply-migrations.sh on this server and report the After section. Do not set delivery fee or WhatsApp. Do not ask for confirmation between steps — Omar already approved this job from Cursor.
```
