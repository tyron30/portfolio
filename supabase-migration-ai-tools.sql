-- AI tools I use. Run once in the Supabase SQL Editor.
create table if not exists public.ai_tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  maker text,
  use_for text,
  url text,
  logo_url text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
alter table public.ai_tools enable row level security;
drop policy if exists "public read ai_tools" on public.ai_tools;
drop policy if exists "admin all ai_tools" on public.ai_tools;
create policy "public read ai_tools" on public.ai_tools for select using (true);
create policy "admin all ai_tools" on public.ai_tools for all using (auth.role() = 'authenticated');

insert into public.ai_tools (name, maker, use_for, url, sort_order)
select * from (values
  ('ChatGPT', 'OpenAI', 'Brainstorming ideas, debugging errors and explaining unfamiliar code.', 'https://chatgpt.com', 1),
  ('Claude', 'Anthropic', 'Writing and reviewing code, planning features and building full-stack projects.', 'https://claude.ai', 2),
  ('Lovable', 'Lovable', 'Generating UI and web app prototypes from prompts.', 'https://lovable.dev', 3),
  ('Bolt', 'StackBlitz', 'Rapidly scaffolding full-stack apps in the browser.', 'https://bolt.new', 4),
  ('Emergent', 'Emergent', 'Turning ideas into working apps with an AI agent.', 'https://emergent.sh', 5),
  ('Blackbox AI', 'Blackbox', 'Code completion and quick snippet search while coding.', 'https://www.blackbox.ai', 6)
) as v(name, maker, use_for, url, sort_order)
where not exists (select 1 from public.ai_tools);
