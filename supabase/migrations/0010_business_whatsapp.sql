-- Business WhatsApp for the public reserve button (customer wiring comes later).
-- Nullable: empty in Owner → Settings clears the number. Digits are stored
-- in wa.me form (e.g. 9665xxxxxxxx) by the owner action.

alter table public.rental_settings
  add column business_whatsapp text;
