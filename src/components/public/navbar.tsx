"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
  { id: "projects", label: "Projects" },
  { id: "gallery", label: "Gallery" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

interface NavbarProps {
  fullName: string;
  resumeUrl?: string | null;
}

export function Navbar({ fullName, resumeUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || mobileOpen ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="#" className="font-display text-lg font-bold text-gradient">
          {fullName || "Portfolio"}
        </Link>

        <nav className="glass hidden items-center gap-0.5 rounded-full px-2 py-1.5 lg:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {resumeUrl && (
            <Button asChild variant="gradient" size="sm">
              <a href={resumeUrl} download>
                <Download className="h-4 w-4" /> Resume
              </a>
            </Button>
          )}
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer: fits the screen height and scrolls if the phone is short */}
      <div
        className={cn(
          "border-t border-border bg-background/95 backdrop-blur transition-[max-height] duration-300 lg:hidden",
          mobileOpen ? "max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain" : "max-h-0 overflow-hidden"
        )}
      >
        <nav className="flex flex-col gap-1 p-4 pb-8">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className={cn(
                "rounded-lg px-3 py-3 text-left text-sm font-medium hover:bg-accent",
                activeSection === s.id ? "bg-accent text-foreground" : "text-foreground/80"
              )}
            >
              {s.label}
            </button>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              download
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/30"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
