-- Adds a short "role tag" field to About, separate from the longer
-- descriptive `headline`. The Hero's giant statement ("I'M AN ___") needs a
-- short phrase (e.g. "IT Specialist") — reusing the longer headline caused
-- it to overflow into 3 lines and get covered by the photo.
alter table public.about
  add column if not exists role_tag text;
