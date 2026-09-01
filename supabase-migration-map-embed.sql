-- Replaces manual lat/lng entry with a pasted Google Maps embed code —
-- much easier for the admin: just copy the iframe from Google Maps'
-- "Share > Embed a map" option and paste the whole thing in.
alter table public.contact_info
  add column if not exists map_embed_code text;
