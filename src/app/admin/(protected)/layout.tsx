import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { AdminNav } from "@/components/shared/admin-nav";
import { PageTransition } from "@/components/shared/page-transition";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests, this guards direct Server Component renders too.
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="glass hidden w-64 shrink-0 flex-col border-r border-white/10 md:flex">
        <div className="p-6">
          <p className="font-display text-lg font-bold text-gradient">Portfolio CMS</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <AdminNav />
        <form action={logout} className="p-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
