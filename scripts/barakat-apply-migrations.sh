#!/usr/bin/env bash
# Apply ARC public-rental migrations 0007–0012 on Barakat's live Postgres.
#
# Approved scope (Cursor, 24 Nov 2026): option 1
#   - Fresh dump backup first
#   - Each migration file as its own transaction; stop on first error
#   - Do NOT set delivery_fee_sar or business_whatsapp
#   - Do NOT deploy app code
#
# Usage on barakat, from the ARC compose root (or any cwd if the repo is findable):
#   bash scripts/barakat-apply-migrations.sh

set -euo pipefail

find_repo() {
  local candidates=(
    "${REPO_DIR:-}"
    "$PWD"
    "$HOME/arcks-warehouse-shadcn"
    "$HOME/arcks-warehouse"
    "$HOME/gearroom"
    "$HOME/warehouse-tracker"
  )
  local d
  for d in "${candidates[@]}"; do
    [[ -z "$d" ]] && continue
    if [[ -f "$d/supabase/migrations/0007_public_bookings.sql" && -f "$d/docker-compose.yml" ]]; then
      echo "$d"
      return 0
    fi
  done
  return 1
}

REPO="$(find_repo)" || {
  echo "Could not find the ARC compose repo (needs supabase/migrations/0007_* and docker-compose.yml)." >&2
  exit 1
}
cd "$REPO"
echo "Repo: $REPO"

if ! docker compose ps db 2>/dev/null | grep -qE 'running|Up'; then
  echo "Postgres service 'db' is not running in this compose project." >&2
  docker compose ps >&2 || true
  exit 1
fi

psql_stop() {
  docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"
}

echo "=== Before ==="
psql_stop -c "select to_regclass('public.bookings') as bookings, to_regclass('public.rental_settings') as rental_settings;"
psql_stop -c "select count(*) as equipment from public.equipment;"
psql_stop -c "select count(*) as with_rate from public.equipment where day_rate_sar is not null;" 2>/dev/null \
  || echo "(equipment.day_rate_sar missing — expected before 0007)"

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/arc-migrations}"
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/postgres-before-0007-0012-$STAMP.sql"
echo "=== Backup ==="
echo "Writing $BACKUP_FILE"
docker compose exec -T db pg_dump -U postgres -d postgres --no-owner --no-acl >"$BACKUP_FILE"
ls -lh "$BACKUP_FILE"
# Sanity: dump must be non-empty
[[ -s "$BACKUP_FILE" ]] || { echo "Backup file is empty — aborting." >&2; exit 1; }

MIG="$REPO/supabase/migrations"
FILES=(
  0007_public_bookings.sql
  0008_rental_settings.sql
  0009_booking_quote.sql
  0010_business_whatsapp.sql
  0011_kit_contents.sql
  0012_competitive_day_rates.sql
)

echo "=== Apply (stop on first error) ==="
for f in "${FILES[@]}"; do
  path="$MIG/$f"
  [[ -f "$path" ]] || { echo "Missing $path" >&2; exit 1; }
  echo "→ $f  (single transaction, ON_ERROR_STOP=1)"
  # One file = one transaction: BEGIN; \i …; COMMIT via psql -1 / --single-transaction
  docker compose exec -T db psql -U postgres -d postgres \
    -v ON_ERROR_STOP=1 \
    --single-transaction \
    <"$path"
  echo "  ok $f"
done

echo "=== After ==="
psql_stop -c "select to_regclass('public.bookings') as bookings, to_regclass('public.rental_settings') as rental_settings;"
psql_stop -c "\d public.rental_settings"
psql_stop -c "select column_name from information_schema.columns where table_schema='public' and table_name='bookings' and column_name in ('day_rate_sar','delivery_fee_sar','vat_sar','total_sar','held_until') order by 1;"
psql_stop -c "select column_name from information_schema.columns where table_schema='public' and table_name='equipment' and column_name in ('kit_contents','day_rate_sar','public_description') order by 1;"
psql_stop -c "select count(*) as equipment, count(day_rate_sar) as with_rate, round(avg(day_rate_sar)::numeric,0) as avg_rate from public.equipment;"
psql_stop -c "select barcode, name, category, day_rate_sar from public.equipment where day_rate_sar is not null order by day_rate_sar desc nulls last limit 15;"

echo "Done. Backup: $BACKUP_FILE"
echo "Delivery fee and business WhatsApp left unset. App image not redeployed."
echo "Paste the Before / After sections back to Cursor."
