"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Award,
  Presentation,
  Wrench, Sparkles,
  Quote,
  Lightbulb,
  Images,
  Code2,
  Share2,
  FileText,
  Mail,
  Settings,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Profile",
    items: [
      { href: "/admin/about", label: "About", icon: User },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/ai-tools", label: "AI Tools", icon: Sparkles },
      { href: "/admin/case-studies", label: "Case Studies", icon: Lightbulb },
      { href: "/admin/testimonials", label: "References", icon: Quote },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/tech-stack", label: "Tech Stack", icon: Code2 },
      { href: "/admin/resume", label: "Resume", icon: FileText },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/social-links", label: "Social Links", icon: Share2 },
      { href: "/admin/contact", label: "Contact Info", icon: Mail },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 text-sm">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
                    isActive ? "font-medium text-primary" : "text-foreground/80 hover:bg-accent hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

