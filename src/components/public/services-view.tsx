"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, Camera, Cloud, Code2, Database, Headphones, Monitor, Network, Rocket, ShieldCheck, Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import type { ServiceRow } from "@/lib/supabase/extra-queries";

const ICONS: Record<string, LucideIcon> = {
  headphones: Headphones, network: Network, camera: Camera, rocket: Rocket, shield: ShieldCheck,
  code: Code2, database: Database, cloud: Cloud, wrench: Wrench, monitor: Monitor,
};

export function ServicesView({ items }: { items: ServiceRow[] }) {
  return (
    <section id="services" className="container py-24">
      <SectionHeader eyebrow="What I do" title={<>Services & <span className="text-gradient">Expertise</span></>} subtitle="Practical IT work I can take off your hands." />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => {
          const Icon = ICONS[s.icon ?? "wrench"] ?? Wrench;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="spot group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10"
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <h3 className="mt-5 text-lg font-semibold leading-snug">{s.title}</h3>
              {s.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>}
              {!!s.tags?.length && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Need IT help? Let&apos;s talk <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
