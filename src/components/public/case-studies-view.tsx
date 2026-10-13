"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import type { CaseStudyRow } from "@/lib/supabase/extra-queries";

export function CaseStudiesView({ items }: { items: CaseStudyRow[] }) {
  const [i, setI] = useState(0);
  const cs = items[i] ?? items[0];
  if (!cs) return null;

  const steps = [
    { label: "The problem", text: cs.problem, Icon: AlertTriangle, tone: "text-amber-600 bg-amber-500/10" },
    { label: "What I did", text: cs.solution, Icon: Wrench, tone: "text-primary bg-primary/10" },
    { label: "The result", text: cs.result, Icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-500/10" },
  ];

  return (
    <section id="case-studies" className="container py-24">
      <SectionHeader eyebrow="Case studies" title={<>Problems I <span className="text-gradient">Solved</span></>} subtitle="Real situations: the problem, what I did, and what changed." />

      {items.length > 1 && (
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {items.map((c, n) => (
            <button key={c.id} onClick={() => setI(n)} className="relative rounded-full px-4 py-1.5 text-sm font-medium">
              {n === i && <motion.span layoutId="cs-tab" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              <span className={`relative ${n === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{c.title}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={cs.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="mx-auto mt-10 max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <h3 className="font-display text-2xl font-bold">{cs.title}</h3>
              {cs.summary && <p className="mt-2 text-muted-foreground">{cs.summary}</p>}
              {!!cs.tools?.length && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cs.tools.map((t) => (
                    <span key={t} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{t}</span>
                  ))}
                </div>
              )}
            </div>
            {cs.image_url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:w-72">
                <Image src={cs.image_url} alt={cs.title} fill className="object-cover" />
              </div>
            )}
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-3">
            <motion.div
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-[16%] right-[16%] top-6 hidden h-0.5 origin-left bg-gradient-to-r from-amber-400 via-primary to-emerald-500 md:block"
            />
            {steps.map((s, n) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + n * 0.15 }}
                className="relative rounded-2xl bg-muted/50 p-5 pt-8"
              >
                <span className={`absolute -top-1 left-5 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-4 border-card ${s.tone}`}>
                  <s.Icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
