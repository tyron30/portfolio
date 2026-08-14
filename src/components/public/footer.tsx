"use client";

import { ArrowUp, Github, Linkedin, Facebook, Instagram, Youtube, Globe } from "lucide-react";

interface FooterProps {
  fullName: string;
  socialLinks: { platform: string; url: string }[];
}

const PLATFORM_ICON: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

const QUICK_LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "contact", label: "Contact" },
];

export function Footer({ fullName, socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center gap-6 text-center">
        <p className="font-display text-lg font-bold text-gradient">{fullName}</p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {socialLinks.length > 0 && (
          <div className="flex gap-3">
            {socialLinks.map((link) => {
              const Icon = PLATFORM_ICON[link.platform] ?? Globe;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  aria-label={link.platform}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {fullName}. All rights reserved.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </footer>
  );
}
