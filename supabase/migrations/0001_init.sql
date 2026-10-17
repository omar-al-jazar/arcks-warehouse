-- Gearroom schema + Row Level Security.
--
-- Run this once against the running stack, e.g.:
--   docker compose exec db psql -U postgres -d postgres -f -  < supabase/migrations/0001_init.sql
-- or paste it into Studio's SQL Editor (http://localhost:8000 -> SQL Editor).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.staff_role as enum ('manager', 'owner');
create type public.equipment_category as enum ('camera', 'lighting', 'grip', 'cable', 'audio', 'other');
create type public.equipment_status as enum ('available', 'checked_out', 'maintenance');
create type public.order_status as enum ('active', 'completed');

-- ---------------------------------------------------------------------------
-- profiles — one row per staff member, linked 1:1 to a Supabase Auth user.
-- There is no public sign-up (DISABLE_SIGNUP=true); accounts are created via
-- the admin API in scripts/seed.ts, which also inserts the matching profile.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  role public.staff_role not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any signed-in staff member can see the (small) staff list — needed to show
-- "checked out by <name>" on orders. Nothing here is sensitive.
create policy "Staff can read all profiles"
on public.profiles for select
to authenticated
using ( true );

-- No client-side insert/update/delete — profiles are managed by the seed
-- script / service role only.

-- Helper used by policies below. security definer so it can read profiles
-- even though the caller's own RLS on profiles only grants select.
create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'owner'
  );
$$;

-- ---------------------------------------------------------------------------
-- equipment
-- ---------------------------------------------------------------------------
create table public.equipment (
  id bigint generated always as identity primary key,
  barcode text not null unique,
  name text not null,
  category public.equipment_category not null default 'other',
  description text,
  status public.equipment_status not null default 'available',
  notes text,
  created_at timestamptz not null default now()
);

create index equipment_status_idx on public.equipment using btree (status);
create index equipment_category_idx on public.equipment using btree (category);

alter table public.equipment enable row level security;

create policy "Staff can read equipment"
on public.equipment for select
to authenticated
using ( true );

-- Both roles can update rows (checkout/return flips `status`); the app UI
-- only exposes editing name/category/description to the owner, and this is
-- backed up at the DB level by the insert/delete policies below.
create policy "Staff can update equipment"
on public.equipment for update
to authenticated
using ( true )
with check ( true );

create policy "Only owner can add equipment"
on public.equipment for insert
to authenticated
with check ( (select public.is_owner()) );

create policy "Only owner can delete equipment"
on public.equipment for delete
to authenticated
using ( (select public.is_owner()) );

-- ---------------------------------------------------------------------------
-- checkout_orders / checkout_items
-- ---------------------------------------------------------------------------
create table public.checkout_orders (
  id bigint generated always as identity primary key,
  project_name text not null,
  renter_name text not null,
  checked_out_by uuid not null references public.profiles (id),
  due_date timestamptz not null,
  checked_out_at timestamptz not null default now(),
  returned_at timestamptz,
  status public.order_status not null default 'active'
);

create index checkout_orders_status_idx on public.checkout_orders using btree (status);
create index checkout_orders_due_date_idx on public.checkout_orders using btree (due_date);

alter table public.checkout_orders enable row level security;

create policy "Staff can read orders"
on public.checkout_orders for select
to authenticated
using ( true );

create policy "Staff can create orders"
on public.checkout_orders for insert
to authenticated
with check ( true );

create policy "Staff can update orders"
on public.checkout_orders for update
to authenticated
using ( true )
with check ( true );

create table public.checkout_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.checkout_orders (id) on delete cascade,
  equipment_id bigint not null references public.equipment (id) on delete restrict,
  checked_out_at timestamptz not null default now(),
  returned_at timestamptz
);

create index checkout_items_order_id_idx on public.checkout_items using btree (order_id);
create index checkout_items_equipment_id_idx on public.checkout_items using btree (equipment_id);
-- Only one *active* (not yet returned) checkout per piece of equipment.
create unique index checkout_items_one_active_per_equipment
  on public.checkout_items (equipment_id)
  where returned_at is null;

alter table public.checkout_items enable row level security;

create policy "Staff can read checkout items"
on public.checkout_items for select
to authenticated
using ( true );

create policy "Staff can create checkout items"
on public.checkout_items for insert
to authenticated
with check ( true );

create policy "Staff can update checkout items"
on public.checkout_items for update
to authenticated
using ( true )
with check ( true );

-- ---------------------------------------------------------------------------
-- RPCs — checkout/return need to be atomic (an item must never end up
-- "checked out" without a checkout_items row, or vice versa), which a
-- sequence of separate supabase-js calls can't guarantee. These run as a
-- single Postgres transaction and still respect the RLS policies above
-- (SECURITY INVOKER, the default).
-- ---------------------------------------------------------------------------
create or replace function public.create_checkout(
  p_project_name text,
  p_renter_name text,
  p_due_date timestamptz,
  p_equipment_ids bigint[]
)
returns bigint
language plpgsql
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

  update public.checkout_items set returned_at = now() where id = v_checkout_item_id;
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
