"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

interface TechItem {
  id: string;
  name: string;
  icon_url?: string | null;
  category: string;
  proficiency?: number | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  tools: "Tools",
  languages: "Languages",
  frameworks: "Frameworks",
  library: "Library",
};

/** A single logo that spins continuously on its Y axis — like a slowly turning coin. */
function SpinningIcon({ tech, delay }: { tech: TechItem; delay: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ perspective: 400 }} className="h-12 w-12">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-12 w-12"
        >
          {tech.icon_url ? (
            <Image src={tech.icon_url} alt={tech.name} fill className="object-contain" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {tech.name.charAt(0)}
            </div>
          )}
        </motion.div>
      </div>
      <span className="text-center text-sm font-semibold">{tech.name}</span>
    </div>
  );
}

export function TechStackGrid({ items }: { items: TechItem[] }) {
  if (items.length === 0) return null;

  const grouped = items.reduce<Record<string, TechItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <section id="tech-stack" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Tech <span className="text-gradient">Stack</span>
        </h2>
      </Reveal>

      <div className="mt-16 space-y-10">
        {Object.entries(grouped).map(([category, techs], groupIndex) => (
          <Reveal key={category} delay={Math.min(groupIndex * 0.1, 0.3)}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {CATEGORY_LABEL[category] ?? category}
            </h3>
            <Card className="border-primary/15 p-6">
              <div className="flex flex-wrap gap-x-10 gap-y-6">
                {techs.map((tech, i) => (
                  <SpinningIcon key={tech.id} tech={tech} delay={i * 0.15} />
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
