import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Plain (cookie-free) Supabase client for PUBLIC READS ONLY.
 *
 * Why this exists: `lib/supabase/server.ts` calls Next's `cookies()`, which
 * — even though it's only there to support the admin auth session — forces
 * Next.js to treat every page that uses it as fully dynamic, opting the
 * whole page out of static rendering and ISR caching. The public portfolio
 * pages don't need auth at all (they only ever SELECT public, RLS-readable
 * rows), so they should use this client instead. That lets `revalidate = 60`
 * on the homepage actually do its job: the page gets statically generated
 * and cached, then quietly regenerated in the background every 60s, rather
 * than hitting Supabase fresh on every single visitor request.
 *
 * Never use this client for anything that needs the logged-in admin session
 * (writes, admin data) — use `lib/supabase/server.ts` for that.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
