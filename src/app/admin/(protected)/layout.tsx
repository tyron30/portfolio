import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { AdminSidebar } from "@/components/shared/admin-sidebar";
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
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar userEmail={user.email} logoutAction={logout} />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
