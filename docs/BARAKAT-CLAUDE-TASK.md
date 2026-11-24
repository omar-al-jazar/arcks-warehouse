# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code on this server runs jobs when Cursor hands one over.

## Current decision (Omar via Cursor, 24 Nov 2026 Riyadh)

**Redeploy the app** from fixed `main` (kit page 500 fix).

Cause: Server Component passed `RentCopy` (includes functions) into client `KitBooking`. Fixed: pass `locale` only; resolve copy inside the client.

- Pull/sync latest `main`, then rebuild **only** the `app` container.
- Do **not** re-run migrations unless `/rent/[barcode]` still 500 for a DB reason.
- Confirm `/rent/CAM-0005` and `/rent/CAM-0010` return **200**.

## Run

```bash
cd ~/arcks-warehouse-shadcn 2>/dev/null || cd ~/arcks-warehouse

chmod +x scripts/barakat-redeploy-app.sh
bash scripts/barakat-redeploy-app.sh
```

## Paste into the Barakat Code session

```
Omar via Cursor: main is fixed for the kit page 500 (do not pass copy/functions into kit-booking — locale only).

Sync main, then: bash scripts/barakat-redeploy-app.sh

Rebuild/restart only the app. Confirm /rent/CAM-0005 and /rent/CAM-0010 return 200 (and /rent still 200). Paste HTTP checks + deployed sha back to Cursor.
```
