# Task for Claude on Barakat (Remote Control)

Cursor Cloud cannot reach Tailscale. Claude Code on this server runs jobs when Cursor hands one over.

## Current decision (Omar via Cursor, 24 Nov 2026 Riyadh)

**Redeploy the app** after the security hardening merge on `main`.

- Sync/rsync latest `main`, rebuild **only** the `app` container.
- Do **not** touch the database.
- Confirm `/rent`, a kit page, and `/login` return 200; owner routes still 307 when logged out.
- Optional: response headers include `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff`.

## Paste into the Barakat Code session

```
Omar via Cursor: main has security hardening (login rate limit, safe redirects, headers, robots). Redeploy the ARC app only.

Sync main, then: bash scripts/barakat-redeploy-app.sh

Do not touch the database. Confirm /rent + /rent/CAM-0005 + /login = 200, owner routes 307 when logged out, and paste deployed sha + any header check back to Cursor.
```
