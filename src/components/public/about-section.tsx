import Image from "next/image";
import { MapPin, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { AnimatedCounter } from "@/components/motion/animated-counter";

interface AboutSectionProps {
  about: {
    full_name: string;
    bio?: string | null;
    location?: string | null;
    email?: string | null;
    phone?: string | null;
    profile_image_url?: string | null;
    about_image_url?: string | null;
    years_experience?: number | null;
    projects_completed?: number | null;
  } | null;
  certificatesCount?: number;
}

export function AboutSection({ about, certificatesCount = 0 }: AboutSectionProps) {
  if (!about) return null;

  const firstName = about.full_name.split(" ")[0];

  const stats = [
    { value: about.years_experience ?? 0, label: "Years Experience" },
    { value: about.projects_completed ?? 0, label: "Projects Completed" },
    { value: certificatesCount, label: "Certifications Earned" },
  ];

  return (
    // Deliberately dark, regardless of the site's light theme — a
    // color-blocked contrast section, matching the reference's black
    // "Hello, I'm..." stats block against its cream hero.
    <section id="about" className="bg-neutral-950 py-24 text-neutral-50">
      <div className="container grid items-center gap-16 lg:grid-cols-[1fr_0.8fr]">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Hello,</p>
          <h2 className="mt-2 font-display text-4xl font-bold leading-tight sm:text-5xl">
            I&apos;m <span className="text-gradient">{firstName}</span>
          </h2>

          {about.bio && <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-400">{about.bio}</p>}

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-neutral-400">
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

          <StaggerContainer className="mt-10 space-y-4">
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
          {/* Decorative checkerboard dot pattern, echoing the reference's subtle background texture behind the photo */}
          <div
            className="absolute -right-8 -top-8 -z-10 h-40 w-40 opacity-40 sm:h-48 sm:w-48"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--primary) / 0.5) 1.5px, transparent 1.5px)",
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
