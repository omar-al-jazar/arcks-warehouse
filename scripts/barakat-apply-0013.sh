#!/usr/bin/env bash
# Apply migration 0013 (delivery_zones) on Barakat's live Postgres.
# Run after 0007–0012 are already applied. Then redeploy the app.
#
# Usage on barakat:
#   bash scripts/barakat-apply-0013.sh

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
    if [[ -f "$d/supabase/migrations/0013_delivery_zones.sql" && -f "$d/docker-compose.yml" ]]; then
      echo "$d"
      return 0
    fi
  done
  return 1
}

REPO="$(find_repo)" || {
  echo "Could not find the ARC compose repo (needs 0013_delivery_zones.sql)." >&2
  exit 1
}
cd "$REPO"
echo "Repo: $REPO"

if ! docker compose ps db 2>/dev/null | grep -qE 'running|Up'; then
  echo "Postgres service 'db' is not running." >&2
  exit 1
fi

psql_stop() {
  docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"
}

echo "=== Before ==="
psql_stop -c "select to_regclass('public.delivery_zones') as delivery_zones;"
psql_stop -c "select count(*) as equipment from public.equipment;"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/arc-migrations}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/postgres-before-0013-$STAMP.sql"
echo "=== Backup ==="
docker compose exec -T db pg_dump -U postgres -d postgres --no-owner --no-acl >"$BACKUP_FILE"
[[ -s "$BACKUP_FILE" ]] || { echo "Backup empty — aborting." >&2; exit 1; }
ls -lh "$BACKUP_FILE"

echo "=== Apply 0013 ==="
psql_stop -f - <"$REPO/supabase/migrations/0013_delivery_zones.sql"

echo "=== After ==="
psql_stop -c "select slug, name_en, fee_sar from public.delivery_zones order by sort_order;"
psql_stop -c "select column_name from information_schema.columns where table_name='bookings' and column_name='delivery_zone_id';"

echo "Done. Redeploy the app next: bash scripts/barakat-redeploy-app.sh"
