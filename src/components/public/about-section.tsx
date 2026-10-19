import Image from "next/image";
import { Cake, MapPin, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { AnimatedCounter } from "@/components/motion/animated-counter";

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

export function AboutSection({ about, certificatesCount = 0 }: AboutSectionProps) {
  if (!about) return null;

  const firstName = about.full_name.split(" ")[0] ?? about.full_name;
  const age = ageFrom(about.birthdate);

  const stats = [
    { value: about.years_experience ?? 0, label: "Years Experience" },
    { value: about.projects_completed ?? 0, label: "Projects Completed" },
    { value: certificatesCount, label: "Certifications Earned" },
  ];

  return (
    <section id="about" className="bg-slate-950 py-24 text-neutral-50">
      <div className="container grid items-center gap-16 lg:grid-cols-[1fr_0.8fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Hello,</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            I&apos;m <span className="text-gradient">{firstName}</span>
          </h2>

          {about.bio && <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">{about.bio}</p>}

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-neutral-400">
            {age !== null && (
              <span className="flex items-center gap-1.5">
                <Cake className="h-4 w-4" /> {age} years old
              </span>
            )}
            {about.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {about.location}
              </span>
            )}
            {about.email && (
              <a href={`mailto:${about.email}`} className="flex items-center gap-1.5 hover:text-primary">
                <Mail className="h-4 w-4" /> {about.email}
              </a>
            )}
            {about.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" /> {about.phone}
              </span>
            )}
          </div>

          {!!about.key_skills?.length && (
            <div className="mt-6">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-500">Key Skills</p>
              <StaggerContainer className="flex flex-wrap gap-2">
                {about.key_skills.map((skill) => (
                  <StaggerItem key={skill}>
                    <span className="inline-block rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                      {skill}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          <StaggerContainer className="mt-8 space-y-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  <AnimatedCounter value={stat.value} suffix="+" className="text-xl font-bold text-neutral-50" />
                  <span className="text-neutral-400">{stat.label}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div
            className="absolute -right-8 -top-8 -z-10 h-40 w-40 opacity-40 sm:h-48 sm:w-48"
            style={{
              backgroundImage: "radial-gradient(hsl(var(--primary) / 0.5) 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="relative h-full w-full">
            {about.about_image_url || about.profile_image_url ? (
              <Image
                src={(about.about_image_url || about.profile_image_url) as string}
                alt={about.full_name}
                fill
                sizes="(max-width: 1024px) 80vw, 384px"
                className="object-contain object-bottom drop-shadow-2xl"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl font-bold text-neutral-500">
                {firstName.charAt(0)}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
