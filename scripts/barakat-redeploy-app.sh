#!/usr/bin/env bash
# Rebuild and restart the ARC Next.js app container from current main.
# Does not touch Postgres data, delivery fee, or WhatsApp.
#
# Approved (Omar via Cursor, 24 Nov 2026): redeploy app image so /rent
# matches GitHub main after migrations 0007–0012.
#
# Usage on barakat:
#   bash scripts/barakat-redeploy-app.sh

set -euo pipefail

find_repo() {
  local candidates=(
    "${REPO_DIR:-}"
    "$PWD"
    "$HOME/arcks-warehouse-shadcn"
    "$HOME/arcks-warehouse"
  )
  local d
  for d in "${candidates[@]}"; do
    [[ -z "$d" ]] && continue
    if [[ -f "$d/docker-compose.yml" ]] && grep -q 'arcks-warehouse-shadcn\|container_name: arcks-warehouse' "$d/docker-compose.yml" 2>/dev/null; then
      if [[ -f "$d/Dockerfile" ]]; then
        echo "$d"
        return 0
      fi
    fi
    if [[ -f "$d/docker-compose.yml" && -f "$d/Dockerfile" && -d "$d/app" ]]; then
      echo "$d"
      return 0
    fi
  done
  return 1
}

REPO="$(find_repo)" || {
  echo "Could not find the ARC app compose repo." >&2
  exit 1
}
cd "$REPO"
echo "Repo: $REPO"

echo "=== Git ==="
git fetch origin main
git checkout main
git pull origin main
echo "HEAD: $(git rev-parse --short HEAD) — $(git log -1 --oneline)"

echo "=== Before ==="
docker compose ps app 2>/dev/null || docker compose ps | grep -i app || true
curl -sS -o /dev/null -w "HTTP %{http_code} (localhost:3001)\n" http://127.0.0.1:3001/ || true
curl -sS -o /dev/null -w "HTTP %{http_code} (/rent)\n" http://127.0.0.1:3001/rent || true

echo "=== Build + up app ==="
# Rebuild only the app service; leave db and the rest running.
docker compose build app
docker compose up -d --no-deps app

echo "Waiting for app to answer…"
ok=0
for i in $(seq 1 60); do
  code="$(curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/rent 2>/dev/null || echo 000)"
  if [[ "$code" == "200" ]]; then
    ok=1
    break
  fi
  sleep 2
done

echo "=== After ==="
docker compose ps app 2>/dev/null || docker compose ps | grep -i app || true
docker compose images app 2>/dev/null || true
curl -sS -o /dev/null -w "HTTP %{http_code} (localhost:3001)\n" http://127.0.0.1:3001/ || true
curl -sS -o /dev/null -w "HTTP %{http_code} (/rent)\n" http://127.0.0.1:3001/rent || true
# Spot-check that a public kit page responds (barcode may vary)
sample="$(docker compose exec -T db psql -U postgres -d postgres -Atc "select barcode from public.equipment where day_rate_sar is not null order by day_rate_sar desc limit 1;" 2>/dev/null || true)"
if [[ -n "$sample" ]]; then
  curl -sS -o /dev/null -w "HTTP %{http_code} (/rent/${sample})\n" "http://127.0.0.1:3001/rent/${sample}" || true
  echo "Sample barcode: $sample"
fi

if [[ "$ok" != "1" ]]; then
  echo "App did not return HTTP 200 on /rent within ~2 minutes." >&2
  docker compose logs --tail=80 app >&2 || true
  exit 1
fi

echo "Done. DB untouched. Delivery fee / WhatsApp untouched."
echo "Paste Before / After (and HEAD sha) back to Cursor."
