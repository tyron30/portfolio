-- Adds a "skills" tag array to Experience entries, so each job can display
-- emphasized skill/tool badges on the public timeline (e.g. "PC Troubleshooting",
-- "User Support", "LAN Maintenance").
alter table public.experience
  add column if not exists skills text[] default '{}';
