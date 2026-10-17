-- Tighten write policies so they actually match the app's intent.
--
-- Prior state (0001_init.sql): checkout_orders/checkout_items had
-- insert/update policies of `using (true) with check (true)` for any
-- authenticated user, and equipment's update policy was the same — meaning
-- any signed-in staff member could write directly to these tables via the
-- REST API, bypassing create_checkout()/return_by_barcode() entirely (e.g.
-- fabricate an order attributed to someone else, or flip equipment status
-- without going through the availability check), and any staff member
-- (not just the owner) could edit equipment name/category/description
-- directly, despite the code comments claiming owner-only editing was
-- "backed up at the DB level" (it wasn't — the policy was `using(true)`).
--
-- Fix: make create_checkout/return_by_barcode SECURITY DEFINER (the
-- standard Supabase pattern for "some writes should only happen through a
-- controlled RPC") so they keep working once direct table writes are
-- locked down, then drop the permissive insert/update policies on
-- checkout_orders/checkout_items entirely (RLS enabled + no permissive
-- policy for authenticated = denied by default for direct writes), and
-- restrict equipment's update policy to owner-only, matching what the
-- code comment always claimed.
--
-- Run e.g.:
--   docker compose exec -T db psql -U postgres -d postgres < supabase/migrations/0002_tighten_write_policies.sql

-- ---------------------------------------------------------------------------
-- RPCs — SECURITY DEFINER so they can write to checkout_orders/checkout_items
-- (and flip equipment.status) even though direct authenticated writes to
-- those tables/columns are no longer permitted by RLS below. This is the
-- standard Supabase pattern: lock down the tables, let a narrow, audited
-- RPC be the only door in. `set search_path = public` is required on any
-- SECURITY DEFINER function to avoid search-path-hijacking (a caller
-- creating objects earlier in their search_path that shadow ones this
-- function relies on) — without it a malicious `search_path` set by the
-- caller could redirect unqualified references inside the function body.
-- ---------------------------------------------------------------------------
create or replace function public.create_checkout(
  p_project_name text,
  p_renter_name text,
  p_due_date timestamptz,
  p_equipment_ids bigint[]
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
  v_equipment_id bigint;
  v_status public.equipment_status;
begin
  if p_equipment_ids is null or array_length(p_equipment_ids, 1) is null then
    raise exception 'No equipment selected';
  end if;

  insert into public.checkout_orders (project_name, renter_name, checked_out_by, due_date)
  values (p_project_name, p_renter_name, (select auth.uid()), p_due_date)
  returning id into v_order_id;

  foreach v_equipment_id in array p_equipment_ids loop
    select status into v_status from public.equipment where id = v_equipment_id for update;

    if v_status is null then
      raise exception 'Equipment % not found', v_equipment_id;
    end if;
    if v_status <> 'available' then
      raise exception 'Equipment % is not available', v_equipment_id;
    end if;

    insert into public.checkout_items (order_id, equipment_id) values (v_order_id, v_equipment_id);
    update public.equipment set status = 'checked_out' where id = v_equipment_id;
  end loop;

  return v_order_id;
end;
$$;

create or replace function public.return_by_barcode(p_barcode text)
returns table (item_name text, project_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_equipment_id bigint;
  v_status public.equipment_status;
  v_item_name text;
  v_checkout_item_id bigint;
  v_order_id bigint;
  v_project_name text;
  v_remaining int;
begin
  select id, status, name into v_equipment_id, v_status, v_item_name
  from public.equipment where barcode = p_barcode;

  if v_equipment_id is null then
    raise exception 'No equipment found for barcode "%"', p_barcode;
  end if;
  if v_status <> 'checked_out' then
    raise exception '"%" is not currently checked out', v_item_name;
  end if;

  select id, order_id into v_checkout_item_id, v_order_id
  from public.checkout_items
  where equipment_id = v_equipment_id and returned_at is null
  limit 1;

  if v_checkout_item_id is null then
    raise exception 'Could not find an active checkout record for "%"', v_item_name;
  end if;

  update public.checkout_items
    set returned_at = now(), returned_by = (select auth.uid())
    where id = v_checkout_item_id;
  update public.equipment set status = 'available' where id = v_equipment_id;

  select count(*) into v_remaining from public.checkout_items
  where order_id = v_order_id and returned_at is null;

  if v_remaining = 0 then
    update public.checkout_orders set status = 'completed', returned_at = now() where id = v_order_id;
  end if;

  select co.project_name into v_project_name from public.checkout_orders co where co.id = v_order_id;

  return query select v_item_name, v_project_name;
end;
$$;

grant execute on function public.create_checkout(text, text, timestamptz, bigint[]) to authenticated;
grant execute on function public.return_by_barcode(text) to authenticated;

-- ---------------------------------------------------------------------------
-- checkout_orders / checkout_items — remove the permissive direct-write
-- policies. With RLS enabled and no permissive insert/update policy left
-- for `authenticated`, direct writes are denied by default; the RPCs above
-- (now SECURITY DEFINER) remain the only way to create/update these rows.
-- ---------------------------------------------------------------------------
drop policy if exists "Staff can create orders" on public.checkout_orders;
drop policy if exists "Staff can update orders" on public.checkout_orders;

drop policy if exists "Staff can create checkout items" on public.checkout_items;
drop policy if exists "Staff can update checkout items" on public.checkout_items;

-- ---------------------------------------------------------------------------
-- checkout_items.returned_by — who actually processed the return, set by
-- return_by_barcode() below.
-- ---------------------------------------------------------------------------
alter table public.checkout_items add column returned_by uuid references public.profiles (id);

-- ---------------------------------------------------------------------------
-- equipment — owner-only updates. This now actually matches what the app UI
-- always claimed (only the owner can edit name/category/description); it's
-- genuinely enforced at the DB level, not just hidden in the UI.
-- create_checkout()/return_by_barcode()'s internal equipment.status flips are
-- unaffected: they run as the function owner under SECURITY DEFINER, which
-- bypasses RLS entirely.
-- ---------------------------------------------------------------------------
drop policy if exists "Staff can update equipment" on public.equipment;

create policy "Owner can update equipment"
on public.equipment for update
to authenticated
using ( (select public.is_owner()) )
with check ( (select public.is_owner()) );
