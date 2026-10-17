-- Simplify equipment categories down to camera / lighting / grip.
--
-- Postgres enums can't drop individual values, so this swaps equipment.category
-- onto a brand new, smaller enum type. Any cable/audio/other equipment (and its
-- checkout history) is deleted first — this warehouse only tracks these 3
-- categories going forward.
--
-- Run this once against the running stack, same as 0001_init.sql:
--   docker compose exec db psql -U postgres -d postgres -f -  < supabase/migrations/0002_simplify_equipment_categories.sql

delete from public.checkout_items
where equipment_id in (
  select id from public.equipment where category in ('cable', 'audio', 'other')
);

delete from public.equipment where category in ('cable', 'audio', 'other');

alter table public.equipment alter column category drop default;

alter type public.equipment_category rename to equipment_category_old;
create type public.equipment_category as enum ('camera', 'lighting', 'grip');

alter table public.equipment
  alter column category type public.equipment_category
  using category::text::public.equipment_category;

alter table public.equipment alter column category set default 'camera';

drop type public.equipment_category_old;
