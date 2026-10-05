-- Per-category, per-status equipment counts for the owner dashboard.
--
-- Why: the dashboard used to download every equipment row and count them in
-- application code. Counting is the database's job — this returns at most one
-- row per (category, status), however large the inventory grows.
--
-- SECURITY INVOKER (stated explicitly even though it's the default): the
-- function runs with the caller's privileges, so equipment's SELECT policy
-- decides which rows get counted. That policy is named "Staff can read
-- equipment" but is `to authenticated using (true)` — any signed-in user.
-- That equals "staff" only because the owner creates every account and
-- signup is disabled (GOTRUE_DISABLE_SIGNUP=true); it is not enforced here.
--
-- Supabase's default privileges grant new functions in `public` to anon
-- explicitly, so revoking from PUBLIC alone is not enough — anon is revoked
-- by name, and only signed-in users may call it.
--
-- Run e.g.:
--   docker compose exec -T db psql -U postgres -d postgres < supabase/migrations/0006_equipment_status_counts.sql
-- To undo:
--   drop function public.equipment_status_counts();

create or replace function public.equipment_status_counts()
returns table (
  category public.equipment_category,
  status public.equipment_status,
  count integer
)
language sql
security invoker
stable
as $$
  select e.category, e.status, count(*)::integer
  from public.equipment e
  group by e.category, e.status;
$$;

revoke execute on function public.equipment_status_counts() from public, anon;
grant execute on function public.equipment_status_counts() to authenticated;
