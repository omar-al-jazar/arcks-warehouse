# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code on this server runs jobs when Cursor hands one over.

## Current decision (Omar via Cursor, 24 Nov 2026 Riyadh)

**Apply migration 0013** (delivery zones), then **redeploy the app** from `main`.

- Backup, then apply only `0013_delivery_zones.sql`.
- Do **not** change WhatsApp or re-touch 0007–0012.
- Rebuild/restart **only** the `app` container after the migration.
- Report Before/After: `delivery_zones` rows + fees, `/rent` HTTP, git/deploy sha.

## Run

```bash
cd ~/arcks-warehouse-shadcn 2>/dev/null || cd ~/arcks-warehouse

# Pull latest main into whatever deploy path you use, then:
chmod +x scripts/barakat-apply-0013.sh scripts/barakat-redeploy-app.sh
bash scripts/barakat-apply-0013.sh
bash scripts/barakat-redeploy-app.sh
```

## Paste into the Barakat Code session

```
Omar via Cursor: apply migration 0013 (Riyadh delivery zones), then redeploy the ARC app from main.

git pull / sync main, then:
bash scripts/barakat-apply-0013.sh
bash scripts/barakat-redeploy-app.sh

Do not touch WhatsApp or older migrations. Paste Before/After zone rows, HTTP checks for /rent, and the deployed sha back to Cursor. Read docs/BARAKAT-CLAUDE-TASK.md if you need the brief.
```
