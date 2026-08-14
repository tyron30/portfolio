/**
 * Placeholder — replace by running, after linking your Supabase project:
 *
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
 *
 * This regenerates full, accurate types for every table/enum in database_schema.sql
 * (about, education, experience, projects, certificates, seminars, gallery,
 * tech_stack, social_links, contact_info, messages, resume, settings, etc.)
 * so every Supabase query in the app is type-safe end to end.
 *
 * Until then, this permissive fallback (any table name -> loose Row/Insert/Update
 * shapes) keeps builds from failing with "never" type errors, at the cost of
 * losing real type-checking on your Supabase queries in the meantime.
 */
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, any>;
        Insert: Record<string, any>;
        Update: Record<string, any>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
