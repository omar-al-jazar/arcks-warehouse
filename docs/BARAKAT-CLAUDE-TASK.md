# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code on this server runs the job below.

## Current decision (Omar via Cursor, 24 Nov 2026 Riyadh)

**Redeploy the ARC app** from GitHub `main` so `/rent` matches the code that already has kit contents, stockBlocks, rate-limit, WhatsApp wiring, etc.

- Pull `main`, rebuild + restart **only** the `app` container.
- Do **not** touch Postgres data, delivery fee, or business WhatsApp.
- Do **not** re-run migrations unless a check fails and Cursor asks.
- Report Before / After HTTP checks and the git HEAD sha.

Migrations **0007–0012** are already applied (140 rates live).

## Run

```bash
cd ~/arcks-warehouse-shadcn 2>/dev/null || cd ~/arcks-warehouse

git fetch origin main && git checkout main && git pull origin main
chmod +x scripts/barakat-redeploy-app.sh
bash scripts/barakat-redeploy-app.sh
```

## Paste into the Barakat Code session

```
Omar via Cursor: redeploy the ARC app on Barakat from current main.

git pull origin main, then run: bash scripts/barakat-redeploy-app.sh

Rebuild and restart only the app container. Do not touch the database, delivery fee, or WhatsApp. Paste Before/After HTTP checks and the git HEAD sha back to Cursor. Read docs/BARAKAT-CLAUDE-TASK.md if you need the brief.
```
