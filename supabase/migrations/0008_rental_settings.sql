-- House-wide rental settings. One row, planted here.
-- delivery_fee_sar stays null until the owner sets a price.
--
-- The public site does not write this table. Date holds are inserted on
-- public.bookings with the service role. There is no anon write policy.

create table public.rental_settings (
  id boolean primary key default true,
  delivery_fee_sar numeric(10, 2),
  constraint rental_settings_singleton check (id),
  constraint rental_settings_fee_nonnegative check (delivery_fee_sar is null or delivery_fee_sar >= 0)
);

insert into public.rental_settings (id) values (true);

alter table public.rental_settings enable row level security;

-- Same readers as bookings: any signed-in staff member. Anonymous visitors
-- are not in `authenticated`, so they cannot select this row.
create policy "Staff can read rental settings"
on public.rental_settings for select
to authenticated
using ( true );

-- The owner settings form updates delivery_fee_sar through the signed-in
-- client (`where id = true`). No insert or delete policy: this migration
-- is the only place the row is created.
create policy "Owner can update rental settings"
on public.rental_settings for update
to authenticated
using ( (select public.is_owner()) )
with check ( (select public.is_owner()) );

-- 0007 enabled RLS on bookings and added no policies, so signed-in staff
-- could not list holds and the owner could not confirm one. Reads match
-- the other staff tables. Inserts stay on the service role. Only the owner
-- may change a hold from the desk.
create policy "Staff can read bookings"
on public.bookings for select
to authenticated
using ( true );

create policy "Owner can update bookings"
on public.bookings for update
to authenticated
using ( (select public.is_owner()) )
with check ( (select public.is_owner()) );
