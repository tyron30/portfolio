import { getAbout, getTechStack } from "@/lib/supabase/public-queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`marquee-track ${reverse ? "marquee-rev" : ""}`}>
        {loop.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="mx-2 inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground/80 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two counter-scrolling rows: key skills (top) and tech stack names (bottom). Pure CMS data. */
export async function SkillsMarquee() {
  const [about, tech] = await Promise.all([getAbout(), getTechStack()]);
  const skills: string[] = ((about as any)?.key_skills ?? []).filter(Boolean);
  const tools: string[] = ((tech as any[]) ?? []).map((t) => t.name).filter(Boolean);
  if (!skills.length && !tools.length) return null;
  return (
    <section aria-label="Skills and technologies" className="space-y-3 py-10">
      {skills.length > 0 && <Row items={skills.length < 6 ? [...skills, ...skills] : skills} />}
      {tools.length > 0 && <Row items={tools.length < 6 ? [...tools, ...tools] : tools} reverse />}
    </section>
  );
}
