/**
 * Placeholder — replace by running, after linking your Supabase project:
 *
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
 *
 * This regenerates full, accurate types for every table/enum in database_schema.sql
 * (about, education, experience, projects, certificates, seminars, gallery,
 * tech_stack, social_links, contact_info, messages, resume, settings, etc.)
 * so every Supabase query in the app is type-safe end to end.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
