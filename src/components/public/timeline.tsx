import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CertificateButton } from "@/components/public/certificate-button";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description?: string | null;
  logoUrl?: string | null;
  tags?: string[] | null;
  isCurrent?: boolean;
  certificateUrl?: string | null;
}

interface TimelineProps {
  id: string;
  title: string;
  items: TimelineItem[];
  emptyLabel: string;
  /** Icon shown in each timeline node - e.g. GraduationCap for Education, Briefcase for Experience. */
  icon: LucideIcon;
}

/** Splits a multi-line description into bullet points; falls back to a plain sentence if it's just one line. */
function DescriptionBlock({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return <p className="mt-3 text-sm leading-relaxed text-foreground/80">{text}</p>;
  }

  return (
    <ul className="mt-3 space-y-2">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{line.replace(/^[-\u2022]\s*/, "")}</span>
        </li>
      ))}
    </ul>
  );
}

export function Timeline({ id, title, items, emptyLabel, icon: SectionIcon }: TimelineProps) {
  return (
    <section id={id} className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">{title}</h2>
      </Reveal>

      {items.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Gradient vertical line, fixed to the left - single column avoids
              the dead-space problem of a left/right alternating layout. */}
          <div className="absolute left-6 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-7" />

          <div className="space-y-6">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.08, 0.4)} y={16} className="relative pl-16 sm:pl-20">
                {/* Node with section icon */}
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 bg-background shadow-md sm:h-14 sm:w-14">
                  <SectionIcon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>

                <div className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                      {item.period}
                    </span>
                    {item.isCurrent && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-start gap-3">
                    {item.logoUrl && (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1 ring-1 ring-border [backdrop-filter:none] [isolation:isolate]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.logoUrl}
                          alt=""
                          width={44}
                          height={44}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold leading-snug">{item.title}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>

                  {item.description && <DescriptionBlock text={item.description} />}

                  {!!item.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.certificateUrl && (
                    <div className={`flex ${item.tags?.length ? "mt-4" : "mt-4 border-t border-border pt-4"}`}>
                      <CertificateButton url={item.certificateUrl} />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
