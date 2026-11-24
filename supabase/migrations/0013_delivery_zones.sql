-- Riyadh delivery zones with per-zone fees.
-- bookings.delivery_zone_id snapshots which zone was chosen at reserve time.
-- rental_settings.delivery_fee_sar stays as a fallback when a zone fee is null.

create table public.delivery_zones (
  id serial primary key,
  slug text not null unique,
  name_en text not null,
  name_ar text not null,
  fee_sar numeric(10, 2),
  sort_order integer not null default 0,
  active boolean not null default true,
  constraint delivery_zones_fee_nonnegative check (fee_sar is null or fee_sar >= 0)
);

alter table public.delivery_zones enable row level security;

create policy "Staff can read delivery zones"
on public.delivery_zones for select
to authenticated
using ( true );

create policy "Owner can update delivery zones"
on public.delivery_zones for update
to authenticated
using ( (select public.is_owner()) )
with check ( (select public.is_owner()) );

-- Public site reads zones through the service role (same as rental_settings).

insert into public.delivery_zones (slug, name_en, name_ar, fee_sar, sort_order) values
  ('center', 'Central Riyadh', 'وسط الرياض', 100, 10),
  ('north',  'North Riyadh',   'شمال الرياض', 150, 20),
  ('east',   'East Riyadh',    'شرق الرياض', 150, 30),
  ('west',   'West Riyadh',    'غرب الرياض', 150, 40),
  ('south',  'South Riyadh',   'جنوب الرياض', 175, 50);

alter table public.bookings
  add column delivery_zone_id integer references public.delivery_zones (id);
