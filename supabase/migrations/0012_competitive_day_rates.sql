-- Competitive Riyadh day rates for pieces that still have no day_rate_sar.
-- Benchmarks (ex-VAT, public listings Nov 2026):
--   Film on Ground: Alexa 35 package ~4,500/day; SkyPanel kit ~3,200/day
--   QSM Rent: Alexa Mini LF ready-to-shoot from ~4,999/day
--   CineGraph: SkyPanel S60 kit 500/day; Sony FX6 body 690/day; a7S III 263/day
--   Khadoom / Estajer: Aputure 600d ~290–316/day; SkyPanel S60 ~350/day
-- ARC sits a step under those package quotes so a hold looks fair on first visit.
-- Does not touch rows that already have a rate. Delivery fee / WhatsApp left alone.

update public.equipment
set day_rate_sar = case
  when name ~* 'alexa[[:space:]]*35' then 4200
  when name ~* 'mini[[:space:]]*lf|alexa[[:space:]]*mini[[:space:]]*lf' then 3800
  when name ~* 'alexa[[:space:]]*mini|amira' then 2500
  when name ~* 'venice|burano' then 4500
  when name ~* 'fx6' then 650
  when name ~* 'fx3|fx30' then 420
  when name ~* 'a7s[[:space:]]*iii|a7s3' then 250
  when name ~* 'a7[[:space:]]*iv|a7iv|a7m4' then 180
  when name ~* 'inspire[[:space:]]*3' then 2500
  when name ~* 'mavic' then 450
  when name ~* 'skypanel[[:space:]]*s120' then 2800
  when name ~* 'skypanel[[:space:]]*s60|skypanel' then 400
  when name ~* 'aputure[[:space:]]*(ls[[:space:]]*)?1200|storm[[:space:]]*1200' then 600
  when name ~* 'aputure[[:space:]]*(ls[[:space:]]*)?600|600d|600x' then 275
  when name ~* 'nova[[:space:]]*p600|p600c' then 400
  when name ~* 'amaran[[:space:]]*f22' then 180
  when name ~* 'astera|titan[[:space:]]*tube' then 350
  when name ~* 'kino[[:space:]]*flo' then 220
  when name ~* 'signature[[:space:]]*prime|master[[:space:]]*prime|cooke' then 900
  when name ~* 'c[- ]?stand|combo[[:space:]]*stand' then 40
  when name ~* 'butterfly|road[[:space:]]*rag|skylite|scrim' then 50
  when category = 'camera' then 900
  when category = 'lighting' then 250
  when category = 'grip' then 75
  else day_rate_sar
end
where day_rate_sar is null;
