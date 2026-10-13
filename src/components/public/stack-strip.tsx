"use client";

import { motion } from "framer-motion";

const STACK = ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase · Postgres & RLS", "Vercel", "Groq AI chatbot"];

export function StackStrip() {
  return (
    <section className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Built & run by me</p>
        <p className="mt-3 text-lg font-medium">This portfolio is a full system I designed, built and deploy myself.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {STACK.map((s, i) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-full border border-border bg-background px-4 py-1.5 text-sm"
            >
              {s}
            </motion.span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Content is managed through my own admin panel and the chatbot answers from the same database.</p>
      </motion.div>
    </section>
  );
}
