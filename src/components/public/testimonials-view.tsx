"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import type { TestimonialRow } from "@/lib/supabase/extra-queries";

export function TestimonialsView({ items }: { items: TestimonialRow[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const t = items[i] ?? items[0];
  if (!t) return null;
  const initials = t.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <section id="references" className="container py-24">
      <SectionHeader eyebrow="References" title={<>What Colleagues <span className="text-gradient">Say</span></>} />
      <div
        className="relative mx-auto mt-12 max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Quote className="absolute -top-6 left-4 h-14 w-14 text-primary/15" />
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12"
          >
            <blockquote className="text-lg leading-relaxed sm:text-xl">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              {t.photo_url ? (
                <Image src={t.photo_url} alt={t.name} width={52} height={52} className="h-[52px] w-[52px] rounded-full object-cover" />
              ) : (
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">{initials}</span>
              )}
              <span className="text-left">
                <span className="block font-semibold">{t.name}</span>
                <span className="block text-sm text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" · ")}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {items.map((x, n) => (
              <button key={x.id} onClick={() => setI(n)} aria-label={`Show reference ${n + 1}`} className="h-2.5 rounded-full bg-primary transition-all" style={{ width: n === i ? 28 : 10, opacity: n === i ? 1 : 0.25 }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
