import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Use inside Client Components only (forms, realtime subscriptions, etc).
 *
 * Deliberately untyped (no <Database> generic) — see src/types/supabase.ts
 * for why. Run `npx supabase gen types` and re-add `<Database>` here once
 * you have real generated types, for actual query type-safety.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
