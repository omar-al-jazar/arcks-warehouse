-- What a public reserve was quoted, priced by the server at reserve time
-- from equipment.day_rate_sar and rental_settings.delivery_fee_sar.
-- delivery_fee_sar is 0 for a collect booking. A column stays null when its
-- price was not set, and holds made before this migration have no quote.
--
-- Inserts stay on the service role. This migration adds no policies.

alter table public.bookings
  add column day_rate_sar numeric(10, 2),
  add column delivery_fee_sar numeric(10, 2),
  add column vat_sar numeric(10, 2),
  add column total_sar numeric(10, 2);
