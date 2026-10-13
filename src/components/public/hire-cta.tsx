"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Download } from "lucide-react";

/** Floating "Hire me" + "Resume" pills: appear after the hero and hide when the contact section is on screen. */
export function HireCta({ resumeUrl }: { resumeUrl?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = document.getElementById("contact");
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(([e]) => setAtContact(!!e?.isIntersecting), { threshold: 0.2 });
      io.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = scrolled && !atContact;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="fixed bottom-5 right-20 z-40 flex items-center gap-2 sm:right-24"
        >
          {resumeUrl && (
            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              aria-label="Download resume"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Resume</span>
            </motion.a>
          )}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.06 }}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/40"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <Briefcase className="h-4 w-4" /> Hire me
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
