"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { AdminNav } from "@/components/shared/admin-nav";

interface AdminSidebarProps {
  userEmail?: string;
  logoutAction: () => void;
}

export function AdminSidebar({ userEmail, logoutAction }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — only shows below md, replaces the sidebar's
          normal spot with a hamburger button that opens the drawer. */}
      <div className="glass sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 md:hidden">
        <p className="font-display text-base font-bold text-gradient">Portfolio CMS</p>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Backdrop, closes the drawer on tap outside it */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {/* Sidebar: a fixed slide-in drawer on mobile, a normal static
          column on desktop (md:static overrides the fixed positioning). */}
      <aside
        className={`glass fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 transition-transform duration-300 md:static md:flex md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-gradient">Portfolio CMS</p>
            {userEmail && <p className="mt-1 truncate text-xs text-muted-foreground">{userEmail}</p>}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Closing on nav click means tapping a link on mobile also closes the drawer */}
        <div onClick={() => setOpen(false)} className="flex flex-1 flex-col overflow-y-auto">
          <AdminNav />
        </div>

        <form action={logoutAction} className="p-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground/80 transition-colors hover:border-primary/30 hover:bg-accent hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </aside>
    </>
  );
}
