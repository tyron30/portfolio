import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Server Components, Server Actions,
 * and Route Handlers. Reads/writes auth cookies via Next's cookies() API.
 *
 * Deliberately untyped (no <Database> generic) — see src/types/supabase.ts
 * for why. Run `npx supabase gen types` and re-add `<Database>` here once
 * you have real generated types, for actual query type-safety.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no write access.
            // Safe to ignore — middleware handles session refresh.
          }
        },
      },
    }
  );
}
