-- Services, References (testimonials) and Case Studies.
-- Run once in the Supabase SQL Editor.

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text default 'wrench',
  tags text[] default '{}',
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  company text,
  quote text not null,
  photo_url text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  summary text,
  problem text not null,
  solution text not null,
  result text not null,
  tools text[] default '{}',
  image_url text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.case_studies enable row level security;

drop policy if exists "public read services" on public.services;
drop policy if exists "admin all services" on public.services;
drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "admin all testimonials" on public.testimonials;
drop policy if exists "public read case_studies" on public.case_studies;
drop policy if exists "admin all case_studies" on public.case_studies;

create policy "public read services" on public.services for select using (true);
create policy "admin all services" on public.services for all using (auth.role() = 'authenticated');
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "admin all testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "public read case_studies" on public.case_studies for select using (true);
create policy "admin all case_studies" on public.case_studies for all using (auth.role() = 'authenticated');

-- Starter services (only inserted when the table is empty). Edit them later in Admin > Services.
insert into public.services (title, description, icon, tags, sort_order)
select * from (values
  ('IT Support & Troubleshooting', 'Hardware and software diagnosis, remote support and day-to-day help for users.', 'headphones', array['Windows','Linux','AnyDesk','TeamViewer'], 1),
  ('Network Setup & Maintenance', 'LAN/WAN setup, cabling, routers and switches, Wi-Fi coverage and connectivity fixes.', 'network', array['LAN','WAN','TP-Link','Cisco'], 2),
  ('CCTV Installation', 'Camera planning, installation and DVR/NVR configuration for homes and offices.', 'camera', array['CCTV','DVR/NVR'], 3),
  ('System Deployment & Virtualization', 'OS installation, workstation rollouts and virtual machines with VMware and Hyper-V.', 'rocket', array['VMware','Hyper-V','Windows'], 4)
) as v(title, description, icon, tags, sort_order)
where not exists (select 1 from public.services);
