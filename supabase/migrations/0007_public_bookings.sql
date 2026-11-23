-- Customer date holds for the public rental site.
-- A booking does not check gear out. Staff checkout stays on checkout_orders.
-- A date is taken when a live booking overlaps it. Expired holds are cancelled
-- by the app before a new reserve, and the exclusion constraint stops two
-- live reserves from landing on the same days.

alter table public.equipment
  add column day_rate_sar numeric(10, 2),
  add column public_description text;

create type public.booking_status as enum ('held', 'confirmed', 'out', 'returned', 'cancelled');
create type public.booking_fulfilment as enum ('delivery', 'collect');

create table public.bookings (
  id bigint generated always as identity primary key,
  equipment_id bigint not null references public.equipment (id) on delete restrict,
  start_date date not null,
  end_date date not null,
  fulfilment public.booking_fulfilment not null,
  status public.booking_status not null default 'held',
  held_until timestamptz,
  customer_name text not null,
  customer_phone text not null,
  created_at timestamptz not null default now(),
  constraint bookings_range check (end_date > start_date)
);

create extension if not exists btree_gist;

alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    equipment_id with =,
    daterange(start_date, end_date, '[)') with &&
  )
  where (status in ('held', 'confirmed', 'out'));

create index bookings_equipment_idx on public.bookings using btree (equipment_id);

alter table public.bookings enable row level security;
-- No client policies. The public site writes through the service role.
