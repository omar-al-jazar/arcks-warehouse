#!/usr/bin/env bash
# Apply ARC rental migrations 0008–0012 on the live Barakat Supabase Postgres.
# Safe to re-run: skips objects/columns that already exist; 0012 only fills null rates.
#
# Run on barakat, from the arcks-warehouse (or arcks-warehouse-shadcn) compose root:
#   bash scripts/barakat-apply-migrations.sh
#
# Or from anywhere on barakat if the repo lives at ~/arcks-warehouse-shadcn:
#   bash ~/arcks-warehouse-shadcn/scripts/barakat-apply-migrations.sh

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
    if [[ -f "$d/supabase/migrations/0008_rental_settings.sql" && -f "$d/docker-compose.yml" ]]; then
      echo "$d"
      return 0
    fi
  done
  return 1
}

REPO="$(find_repo)" || {
  echo "Could not find the ARC compose repo (needs supabase/migrations/0008_* and docker-compose.yml)." >&2
  exit 1
}
cd "$REPO"
echo "Repo: $REPO"

if ! docker compose ps db --status running --quiet 2>/dev/null | grep -q .; then
  # Older compose may not support --status
  if ! docker compose ps db 2>/dev/null | grep -qE 'running|Up'; then
    echo "Postgres service 'db' is not running in this compose project." >&2
    docker compose ps >&2 || true
    exit 1
  fi
fi

psql() {
  docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 "$@"
}

apply_sql_file() {
  local file="$1"
  echo "→ $file"
  docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=0 <"$file" \
    | tee /tmp/arc-migrate-last.out
}

echo "=== Before ==="
psql -c "select count(*) as equipment from public.equipment;" || true
psql -c "select count(*) as with_rate from public.equipment where day_rate_sar is not null;" 2>/dev/null || echo "(day_rate_sar column may be missing still)"
psql -c "select to_regclass('public.rental_settings') as rental_settings;" || true

MIG="$REPO/supabase/migrations"
for f in \
  0008_rental_settings.sql \
  0009_booking_quote.sql \
  0010_business_whatsapp.sql \
  0011_kit_contents.sql \
  0012_competitive_day_rates.sql
do
  apply_sql_file "$MIG/$f" || true
done

# Soft re-apply of rate fill in case 0012 ran before equipment rows existed
echo "→ re-run competitive rates fill (nulls only)"
docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=0 <"$MIG/0012_competitive_day_rates.sql" || true

echo "=== After ==="
psql -c "\d public.rental_settings" || true
psql -c "select column_name from information_schema.columns where table_schema='public' and table_name='bookings' and column_name in ('day_rate_sar','delivery_fee_sar','vat_sar','total_sar') order by 1;"
psql -c "select column_name from information_schema.columns where table_schema='public' and table_name='equipment' and column_name in ('kit_contents','day_rate_sar') order by 1;"
psql -c "select count(*) as equipment, count(day_rate_sar) as with_rate, round(avg(day_rate_sar)::numeric,0) as avg_rate from public.equipment;"
psql -c "select barcode, name, category, day_rate_sar from public.equipment where day_rate_sar is not null order by day_rate_sar desc nulls last limit 15;"

echo "Done. Delivery fee and business WhatsApp were intentionally left unset."
echo "Reply in chat with the After section above so Cursor can update STATUS."
