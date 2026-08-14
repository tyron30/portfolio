-- Adds a second, independent image field to About — used specifically by
-- the "Hello, I'm..." section, separate from profile_image_url (which
-- powers the Hero). Lets the admin upload a different photo for each spot.
alter table public.about
  add column if not exists about_image_url text;
