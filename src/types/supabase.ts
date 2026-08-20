/**
 * Placeholder — not currently used by any Supabase client (see
 * lib/supabase/server.ts, client.ts, public-client.ts, which are all
 * untyped for now to avoid type-generation mismatches).
 *
 * For real type-safety on your Supabase queries, run this after linking
 * your Supabase project:
 *
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
 *
 * Then re-add `<Database>` as the generic type argument on each of the
 * three createClient functions in lib/supabase/.
 */
export type Database = Record<string, unknown>;
