# AI Portfolio Management System — Phase 2 Setup

This is the initialized project skeleton: Next.js 15 + TypeScript + Tailwind + Shadcn config +
Supabase client/server/middleware + working admin auth (login/logout + protected `/admin` routes).

## 1. Install dependencies

```bash
npm install
```

## 2. Create your Supabase project

1. Go to https://supabase.com/dashboard → New Project.
2. In the SQL Editor, run `database_schema.sql` (from Phase 1) to create all tables, RLS policies, and triggers.
3. In **Authentication → Users**, manually create your one admin user (no public sign-up in this app).
4. Copy your Project URL and anon key from **Settings → API**.

## 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` at minimum.

## 4. Generate real Supabase types

```bash
npx supabase login
npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
```

This replaces the placeholder in `src/types/supabase.ts` with real, fully-typed tables.

## 5. Install shadcn/ui components (as needed per Phase 3)

```bash
npx shadcn@latest init      # already configured via components.json, this just confirms
npx shadcn@latest add button input label card dialog dropdown-menu toast
```

## 6. Run the dev server

```bash
npm run dev
```

- `/` → public site placeholder (built out in Phase 5)
- `/admin/login` → sign in with the admin user you created in step 2
- `/admin/dashboard` → protected route, redirects to login if not authenticated

## What's included in this phase

- ✅ Next.js 15 App Router project structure
- ✅ TypeScript strict mode
- ✅ Tailwind + design tokens (light/dark, glassmorphism utilities)
- ✅ Shadcn UI configured (`components.json`)
- ✅ Supabase browser client, server client, and middleware-based session refresh
- ✅ Admin-only auth: login Server Action, logout, protected route middleware
- ✅ TanStack Query + next-themes + sonner (toasts) providers wired into root layout

## Phase 3 — Reusable UI Component Library

Added under `src/components/`:

**`ui/`** (shadcn-style primitives)
- `button.tsx` — variants: default, gradient, outline, ghost, destructive, link, glass
- `input.tsx`, `textarea.tsx`, `label.tsx` — form primitives with built-in error styling
- `card.tsx` — Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter
- `badge.tsx` — variants: default, secondary, outline, success, warning, destructive (project status, featured tags, message status)
- `skeleton.tsx` — base Skeleton + SkeletonRow + SkeletonCard presets
- `dialog.tsx` — Radix-based modal primitive

**`shared/`** (composed, feature-facing components — used directly in Phase 4)
- `form-field.tsx` — Label + control + error message wrapper for every CRUD form
- `confirm-dialog.tsx` + `useConfirmDialog()` — one consistent delete-confirmation pattern app-wide
- `data-table.tsx` — generic TanStack Table wrapper with search, sort, and pagination; backs every admin list (Projects, Certificates, Education, Experience, Seminars, Gallery, Messages)
- `image-uploader.tsx` — uploads directly to a Supabase Storage bucket (profile/gallery/projects/certificates/seminars/resume/logos/misc), returns a public URL
- `empty-state.tsx`, `page-header.tsx`, `stat-card.tsx` — layout building blocks for admin pages and the dashboard

All components are typed, accessible (visible focus rings, `aria-invalid`, `aria-label`s), and dark-mode ready via the CSS variables from Phase 2.

Install the new deps before running:
```bash
npm install
```

## Next: Phase 4

Build out the Admin CMS: every module (About, Education, Experience, Projects, Certificates,
Seminars, Gallery, Tech Stack, Social Links, Resume, Contact, Settings) gets a list page using
`DataTable`, and an add/edit form using `FormField` + `ImageUploader`, wired to Supabase via
TanStack Query mutations.
