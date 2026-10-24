"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";
import type { AiToolRow } from "@/lib/supabase/ai-tools-queries";

const HUES = [221, 262, 199, 172, 330, 24];

function Logo({ tool, i }: { tool: AiToolRow; i: number }) {
  if (tool.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tool.logo_url} alt={tool.name} className="max-h-full max-w-full object-contain" loading="lazy" />
      </span>
    );
  }
  const h = HUES[i % HUES.length];
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-md"
      style={{ background: `linear-gradient(135deg, hsl(${h} 80% 55%), hsl(${(h ?? 0) + 30} 80% 42%))` }}
    >
      {tool.name.charAt(0).toUpperCase()}
    </div>
  );
}

export function AiToolsView({ items }: { items: AiToolRow[] }) {
  return (
    <section id="ai-tools" className="container py-24">
      <SectionHeader
        eyebrow="My workflow"
        title={<>AI Tools I <span className="text-gradient">Build With</span></>}
        subtitle="I use AI assistants to move faster, then review, test and own every line that ships."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => {
          const Wrapper = t.url ? motion.a : motion.div;
          const linkProps = t.url ? { href: t.url, target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <Wrapper
              key={t.id}
              {...linkProps}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="spot group relative flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10"
            >
              <Logo tool={t} i={i} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-semibold">{t.name}</h3>
                  {t.url && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />}
                </div>
                {t.maker && <p className="text-xs text-muted-foreground">{t.maker}</p>}
                {t.use_for && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.use_for}</p>}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
}
