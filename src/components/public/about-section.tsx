import Image from "next/image";
import { Cake, MapPin, Mail, Phone, Sparkles, Award, Briefcase } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { TiltLayer } from "@/components/public/tilt-layer";

interface AboutSectionProps {
  about: {
    full_name: string;
    birthdate?: string | null;
    bio?: string | null;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    profile_image_url?: string | null;
    about_image_url?: string | null;
    key_skills?: string[] | null;
    years_experience?: number | null;
    projects_completed?: number | null;
  } | null;
  certificatesCount?: number;
}

function ageFrom(d?: string | null): number | null {
  if (!d) return null;
  const mdy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(d.trim());
  const b = mdy ? new Date(Number(mdy[3]), Number(mdy[1]) - 1, Number(mdy[2])) : new Date(d);
  if (isNaN(b.getTime())) return null;
  const n = new Date();
  let a = n.getFullYear() - b.getFullYear();
  const m = n.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--;
  return a > 0 && a < 120 ? a : null;
}

/** Splits the bio into a short lead sentence plus a few scannable highlights. */
function splitBio(bio?: string | null): { lead: string; points: string[] } {
  const parts = (bio ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  const [lead = "", ...rest] = parts;
  return { lead, points: rest.slice(0, 4) };
}

const FADE =
  "radial-gradient(ellipse 74% 90% at 50% 36%, #000 56%, rgba(0,0,0,0.6) 74%, transparent 100%)";

export function AboutSection({ about, certificatesCount = 0 }: AboutSectionProps) {
  if (!about) return null;

  const firstName = about.full_name.split(" ")[0] ?? about.full_name;
  const age = ageFrom(about.birthdate);
  const { lead, points } = splitBio(about.bio);
  const photo = (about.about_image_url || about.profile_image_url) as string | undefined;
  const years = about.years_experience ?? 0;

  const stats = [
    { value: years, label: "Years Experience" },
    { value: about.projects_completed ?? 0, label: "Projects Completed" },
    { value: certificatesCount, label: "Certifications" },
  ];

  const chips = [
    age !== null ? { icon: Cake, text: `${age} years old` } : null,
    about.location ? { icon: MapPin, text: about.location } : null,
    about.email ? { icon: Mail, text: about.email, href: `mailto:${about.email}` } : null,
    about.phone ? { icon: Phone, text: about.phone, href: `tel:${about.phone}` } : null,
  ].filter(Boolean) as { icon: typeof Cake; text: string; href?: string }[];

  return (
    <section id="about" className="relative py-24 text-foreground">
      <div className="container grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Hello,</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-6xl">
            I&apos;m <span className="text-gradient">{firstName}</span>
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

          {lead && <p className="mt-6 max-w-xl text-xl font-medium leading-snug text-foreground sm:text-2xl">{lead}</p>}

          {points.length > 0 && (
            <StaggerContainer className="mt-5 max-w-xl space-y-3">
              {points.map((p) => (
                <StaggerItem key={p}>
                  <div className="flex gap-3 text-base leading-relaxed text-muted-foreground">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {chips.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chips.map(({ icon: Icon, text, href }) => {
                const cls =
                  "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm text-foreground backdrop-blur transition hover:border-cyan-300/50 hover:text-foreground";
                return href ? (
                  <a key={text} href={href} className={cls}>
                    <Icon className="h-4 w-4 text-primary" /> {text}
                  </a>
                ) : (
                  <span key={text} className={cls}>
                    <Icon className="h-4 w-4 text-primary" /> {text}
                  </span>
                );
              })}
            </div>
          )}

          {!!about.key_skills?.length && (
            <div className="mt-6">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Key Skills</p>
              <StaggerContainer className="flex flex-wrap gap-2">
                {about.key_skills.map((skill) => (
                  <StaggerItem key={skill}>
                    <span className="inline-block rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                      {skill}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          <StaggerContainer className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="glass card-glow rounded-2xl p-4 text-center">
                  <AnimatedCounter
                    value={stat.value}
                    suffix="+"
                    className="text-gradient font-display text-3xl font-bold sm:text-4xl"
                  />
                  <p className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md">
          {/* glow + rings behind the portrait */}
          <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/25" />
          <div className="pointer-events-none absolute left-1/2 top-[46%] -z-10 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/25" />
          {/* light pool under the shoulders */}
          <div className="pointer-events-none absolute -bottom-1 left-1/2 -z-10 h-14 w-[80%] -translate-x-1/2 rounded-[100%] bg-cyan-400/30 blur-2xl" />
          <div className="pointer-events-none absolute bottom-3 left-1/2 -z-10 h-px w-[66%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <TiltLayer className="relative h-full w-full">
            {photo ? (
              <Image
                src={photo}
                alt={about.full_name}
                fill
                sizes="(max-width: 1024px) 80vw, 448px"
                style={{ WebkitMaskImage: FADE, maskImage: FADE }}
                className="object-contain object-top"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground">
                {firstName.charAt(0)}
              </div>
            )}
          </TiltLayer>

          {/* floating glass badges */}
          <div className="glass absolute -left-2 top-[18%] flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground sm:-left-6 sm:text-sm">
            <Briefcase className="h-4 w-4 text-primary" /> {years}+ yrs experience
          </div>
          <div className="glass absolute -right-2 bottom-[22%] flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground sm:-right-6 sm:text-sm">
            <Award className="h-4 w-4 text-primary" /> {certificatesCount}+ certifications
          </div>
        </Reveal>
      </div>
    </section>
  );
}
