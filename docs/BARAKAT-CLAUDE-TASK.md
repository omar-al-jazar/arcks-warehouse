# Task for Claude on Barakat (Remote Control)

**Prefer local Cursor + SSH** (`docs/LOCAL-HANDOFF.md`). Use this paste only if Omar is not on a Tailscale machine.

## Pending (if still needed)

Redeploy security build from `main` (`d559aef` or newer). App only; no DB.

```
Omar: security hardening is on main. Redeploy app only.

Sync main → bash scripts/barakat-redeploy-app.sh

Confirm /rent + /rent/CAM-0005 + /login = 200, owner 307 logged out, X-Frame-Options DENY. Paste sha back.
```
