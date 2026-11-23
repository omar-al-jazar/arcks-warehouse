# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code on this server runs the job below.

## Decision (Omar via Cursor, 24 Nov 2026 Riyadh)

**Option 1 — approved.**

- Fresh `pg_dump` backup first.
- Apply migrations **0007 → 0012** in order.
- Each file is its own transaction; **stop on the first error** (no continuing after failures).
- Report Before and After counts.
- Do **not** set `delivery_fee_sar` or `business_whatsapp`.
- Do **not** deploy new app code (Sep 16 image stays until a separate deploy).

Options 2 (backup only) and 3 (wait) were rejected.

## Run

```bash
cd ~/arcks-warehouse-shadcn 2>/dev/null || cd ~/arcks-warehouse 2>/dev/null || cd ~/warehouse-tracker

git fetch origin main
git checkout main
git pull origin main

chmod +x scripts/barakat-apply-migrations.sh
bash scripts/barakat-apply-migrations.sh
```

If `db` is down, start that compose stack, wait until healthy, then run the script once. Do not invent rates; `0012` already encodes them.

## Paste into the Barakat Code session

```
Omar via Cursor chose option 1.

Apply migrations 0007 through 0012 in order on the live Barakat Postgres for ARC. Fresh pg_dump backup first. Each migration file as its own transaction; stop on the first error. Do not set delivery fee or business WhatsApp. Do not deploy app code.

git pull origin main, then run: bash scripts/barakat-apply-migrations.sh

Paste the Before and After sections back here (or into the Cursor chat). Read docs/BARAKAT-CLAUDE-TASK.md if you need the full brief.
```
