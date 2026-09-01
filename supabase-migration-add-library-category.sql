-- Adds "Library" as a Tech Stack category option (for things like
-- Bootstrap, Tailwind CSS — CSS libraries rather than full frameworks).
ALTER TYPE tech_category ADD VALUE IF NOT EXISTS 'library';
