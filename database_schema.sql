-- =========================================================
-- AI Portfolio Management System — Database Schema
-- Target: Supabase (PostgreSQL)
-- =========================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------
create type project_status as enum ('draft', 'in_progress', 'completed', 'archived');
create type message_status as enum ('unread', 'read', 'archived');
create type tech_category as enum ('frontend', 'backend', 'database', 'tools', 'languages', 'frameworks');

-- ---------------------------------------------------------
-- SITE ADMIN (mirrors auth.users, admin-only, no public signup)
-- ---------------------------------------------------------
create table public.admin_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  title text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- ABOUT (singleton row)
-- ---------------------------------------------------------
create table public.about (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  headline text,
  bio text,
  location text,
  email text,
  phone text,
  profile_image_url text,
  years_experience int default 0,
  projects_completed int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- EDUCATION
-- ---------------------------------------------------------
create table public.education (
  id uuid primary key default uuid_generate_v4(),
  school_name text not null,
  school_logo_url text,
  degree text not null,
  course text,
  start_year int not null,
  end_year int,
  description text,
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_education_sort on public.education (sort_order) where deleted_at is null;

-- ---------------------------------------------------------
-- EXPERIENCE
-- ---------------------------------------------------------
create table public.experience (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  company_logo_url text,
  position text not null,
  start_date date not null,
  end_date date,
  is_current boolean default false,
  responsibilities text,
  achievements text,
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_experience_sort on public.experience (sort_order) where deleted_at is null;

-- ---------------------------------------------------------
-- PROJECTS + PROJECT IMAGES
-- ---------------------------------------------------------
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  github_url text,
  live_url text,
  video_url text,
  tech_tags text[] default '{}',
  is_featured boolean default false,
  status project_status default 'completed',
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_slug on public.projects (slug);
create index idx_projects_featured on public.projects (is_featured) where deleted_at is null;

create table public.project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
create index idx_project_images_project on public.project_images (project_id);

-- ---------------------------------------------------------
-- CERTIFICATES
-- ---------------------------------------------------------
create table public.certificates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  issuer text not null,
  description text,
  image_url text,
  pdf_url text,
  issue_date date,
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_certificates_issue_date on public.certificates (issue_date desc);

-- ---------------------------------------------------------
-- SEMINARS
-- ---------------------------------------------------------
create table public.seminars (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  organizer text not null,
  description text,
  seminar_date date,
  certificate_url text,
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- GALLERY
-- ---------------------------------------------------------
create table public.gallery (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  caption text,
  category text,
  sort_order int default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_gallery_category on public.gallery (category) where deleted_at is null;

-- ---------------------------------------------------------
-- TECH STACK
-- ---------------------------------------------------------
create table public.tech_stack (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon_url text,
  category tech_category not null,
  proficiency int check (proficiency between 1 and 100),
  sort_order int default 0,
  created_at timestamptz not null default now()
);
create index idx_tech_stack_category on public.tech_stack (category);

-- ---------------------------------------------------------
-- SOCIAL LINKS (singleton-ish, one row per platform)
-- ---------------------------------------------------------
create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null unique,   -- github, facebook, linkedin, instagram, youtube, tiktok, discord, email, website
  url text not null,
  icon_name text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- CONTACT INFO (singleton row) + MESSAGES (contact form submissions)
-- ---------------------------------------------------------
create table public.contact_info (
  id uuid primary key default uuid_generate_v4(),
  email text,
  phone text,
  address text,
  map_lat numeric,
  map_lng numeric,
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_name text not null,
  sender_email text not null,
  subject text,
  body text not null,
  status message_status default 'unread',
  created_at timestamptz not null default now()
);
create index idx_messages_status on public.messages (status);

-- ---------------------------------------------------------
-- RESUME (versioned, only latest is "active")
-- ---------------------------------------------------------
create table public.resume (
  id uuid primary key default uuid_generate_v4(),
  file_url text not null,
  file_name text not null,
  is_active boolean default true,
  uploaded_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- SETTINGS (key-value site settings: SEO defaults, theme, etc.)
-- ---------------------------------------------------------
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- Public: read-only on published content.
-- Admin (authenticated, matching admin_profile.id): full CRUD.
-- =========================================================

alter table public.about enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.certificates enable row level security;
alter table public.seminars enable row level security;
alter table public.gallery enable row level security;
alter table public.tech_stack enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_info enable row level security;
alter table public.messages enable row level security;
alter table public.resume enable row level security;
alter table public.settings enable row level security;

-- Public read policies (only non-deleted rows)
create policy "public read about" on public.about for select using (true);
create policy "public read education" on public.education for select using (deleted_at is null);
create policy "public read experience" on public.experience for select using (deleted_at is null);
create policy "public read projects" on public.projects for select using (deleted_at is null);
create policy "public read project_images" on public.project_images for select using (true);
create policy "public read certificates" on public.certificates for select using (deleted_at is null);
create policy "public read seminars" on public.seminars for select using (deleted_at is null);
create policy "public read gallery" on public.gallery for select using (deleted_at is null);
create policy "public read tech_stack" on public.tech_stack for select using (true);
create policy "public read social_links" on public.social_links for select using (is_active = true);
create policy "public read contact_info" on public.contact_info for select using (true);
create policy "public read resume" on public.resume for select using (is_active = true);
create policy "public insert messages" on public.messages for insert with check (true);

-- Admin full-access policies (authenticated users only — single admin model)
create policy "admin all about" on public.about for all using (auth.role() = 'authenticated');
create policy "admin all education" on public.education for all using (auth.role() = 'authenticated');
create policy "admin all experience" on public.experience for all using (auth.role() = 'authenticated');
create policy "admin all projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "admin all project_images" on public.project_images for all using (auth.role() = 'authenticated');
create policy "admin all certificates" on public.certificates for all using (auth.role() = 'authenticated');
create policy "admin all seminars" on public.seminars for all using (auth.role() = 'authenticated');
create policy "admin all gallery" on public.gallery for all using (auth.role() = 'authenticated');
create policy "admin all tech_stack" on public.tech_stack for all using (auth.role() = 'authenticated');
create policy "admin all social_links" on public.social_links for all using (auth.role() = 'authenticated');
create policy "admin all contact_info" on public.contact_info for all using (auth.role() = 'authenticated');
create policy "admin all messages" on public.messages for all using (auth.role() = 'authenticated');
create policy "admin all resume" on public.resume for all using (auth.role() = 'authenticated');
create policy "admin all settings" on public.settings for all using (auth.role() = 'authenticated');

-- =========================================================
-- updated_at auto-touch trigger (reused across tables)
-- =========================================================
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_about_updated before update on public.about for each row execute function public.touch_updated_at();
create trigger trg_education_updated before update on public.education for each row execute function public.touch_updated_at();
create trigger trg_experience_updated before update on public.experience for each row execute function public.touch_updated_at();
create trigger trg_projects_updated before update on public.projects for each row execute function public.touch_updated_at();
create trigger trg_certificates_updated before update on public.certificates for each row execute function public.touch_updated_at();
create trigger trg_seminars_updated before update on public.seminars for each row execute function public.touch_updated_at();
create trigger trg_social_links_updated before update on public.social_links for each row execute function public.touch_updated_at();
create trigger trg_settings_updated before update on public.settings for each row execute function public.touch_updated_at();
