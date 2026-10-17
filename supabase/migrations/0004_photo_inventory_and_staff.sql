-- Photo-based equipment intake + multi-manager staff accounts.
--
-- 1. equipment gets serial_number + image_url, and a per-category barcode
--    generator so the photo-add flow can mint a barcode without a human
--    typing one.
-- 2. equipment insert is opened up to any authenticated staff (owner AND
--    manager), since managers now add gear via the photo flow too.
-- 3. profiles gets an email column so the owner can create additional named
--    manager accounts (each with their own PIN) instead of everyone sharing
--    one manager@gearroom.local login. Backfilled from auth.users for the
--    two accounts scripts/seed.ts already created.
--
-- Run this once against the running stack, same as the earlier migrations.

-- ---------------------------------------------------------------------------
-- equipment: serial number + display image
-- ---------------------------------------------------------------------------
alter table public.equipment add column serial_number text;
alter table public.equipment add column image_url text;

-- ---------------------------------------------------------------------------
-- equipment: auto-generated barcodes (CAM-0001 / LGT-0001 / GRP-0001), so the
-- photo-add flow doesn't need a human to invent one. Sequences start after
-- however many items already exist in each category, to stay clear of any
-- barcodes already in use.
-- ---------------------------------------------------------------------------
create sequence public.camera_barcode_seq;
create sequence public.lighting_barcode_seq;
create sequence public.grip_barcode_seq;

select setval('public.camera_barcode_seq', (select count(*) from public.equipment where category = 'camera') + 1, false);
select setval('public.lighting_barcode_seq', (select count(*) from public.equipment where category = 'lighting') + 1, false);
select setval('public.grip_barcode_seq', (select count(*) from public.equipment where category = 'grip') + 1, false);

create or replace function public.next_equipment_barcode(p_category public.equipment_category)
returns text
language plpgsql
as $$
declare
  v_prefix text;
  v_next bigint;
begin
  case p_category
    when 'camera' then
      v_prefix := 'CAM';
      v_next := nextval('public.camera_barcode_seq');
    when 'lighting' then
      v_prefix := 'LGT';
      v_next := nextval('public.lighting_barcode_seq');
    when 'grip' then
      v_prefix := 'GRP';
      v_next := nextval('public.grip_barcode_seq');
  end case;

  return v_prefix || '-' || lpad(v_next::text, 4, '0');
end;
$$;

grant execute on function public.next_equipment_barcode(public.equipment_category) to authenticated;

-- ---------------------------------------------------------------------------
-- equipment: managers can now add gear too (previously owner-only), since
-- the photo-add flow is available to both roles.
-- ---------------------------------------------------------------------------
drop policy "Only owner can add equipment" on public.equipment;

create policy "Staff can add equipment"
on public.equipment for insert
to authenticated
with check ( true );

-- Deleting equipment stays owner-only — unchanged.

-- ---------------------------------------------------------------------------
-- profiles: named accounts for multiple managers, each with their own PIN.
-- ---------------------------------------------------------------------------
alter table public.profiles add column email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id;
alter table public.profiles alter column email set not null;
alter table public.profiles add constraint profiles_email_key unique (email);
