-- Kit contents for the public "What arrives" list.
-- Each equipment row stores zero or more {label, qty} items as jsonb.
-- Empty array is valid: the piece itself is still shown as ×1 on the
-- public kit page until a follow-up renders these rows.

alter table public.equipment
  add column kit_contents jsonb not null default '[]'::jsonb;

alter table public.equipment
  add constraint equipment_kit_contents_is_array
  check (jsonb_typeof(kit_contents) = 'array');
