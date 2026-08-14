"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail, Github, Linkedin, Facebook, Instagram, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { RotatingBadge } from "@/components/public/rotating-badge";

interface HeroProps {
  about: {
    full_name: string;
    role_tag?: string | null;
    headline?: string | null;
    profile_image_url?: string | null;
  } | null;
  resumeUrl?: string | null;
  socialLinks: { platform: string; url: string }[];
}

const PLATFORM_ICON: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

/** Formats a role like "IT Specialist" into "I'M AN\nIT SPECIALIST" for the giant two-line hero statement. */
function formatRoleStatement(role: string): [string, string] {
  const startsWithVowel = /^[aeiou]/i.test(role.trim());
  const article = startsWithVowel ? "I'M AN" : "I'M A";
  return [article, role.toUpperCase()];
}

export function Hero({ about, resumeUrl, socialLinks }: HeroProps) {
  const fullName = about?.full_name ?? "Your Name";
  const rawRole = about?.role_tag?.trim() || about?.headline?.trim() || "IT Specialist";
  const role = rawRole.length > 24 ? rawRole.slice(0, 24).trim() : rawRole;
  const [line1, line2] = formatRoleStatement(role);

  return (
    // No forced min-h-screen here anymore — that was reserving a full
    // viewport's height regardless of content, leaving a lot of dead empty
    // space below a shorter composition. Natural height + top padding for
    // the fixed navbar keeps everything compact, matching the reference's
    // one-screen fit.
    <section id="hero" className="relative overflow-x-clip pb-10 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] bg-[length:32px_32px] opacity-[0.05]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container flex flex-col items-center text-center"
      >
        {/* Wrapper height matches the (now much larger) photo closely, so
            there's no leftover gap before the badge/pill/buttons below. */}
        <div className="relative w-full min-h-[380px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px]">
          <motion.h1
            variants={itemVariants}
            className="relative z-20 mix-blend-difference select-none font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
          >
            <span className="block">{line1}</span>
            <span className="block">{line2}</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="absolute left-1/2 top-0 z-10 aspect-[3/4] w-64 -translate-x-1/2 sm:w-80 md:w-[26rem] lg:w-[29rem]"
          >
            {/* Orange geometric accent shape */}
            <div className="absolute -left-3 top-1/2 -z-10 h-24 w-24 -translate-y-1/2 rotate-45 rounded-2xl bg-primary/80 sm:h-32 sm:w-32" />

            <div className="relative h-full w-full">
              {about?.profile_image_url ? (
                <Image
                  src={about.profile_image_url}
                  alt={fullName}
                  fill
                  priority
                  sizes="(max-width: 768px) 70vw, 464px"
                  className="object-contain object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground">
                  {fullName.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative z-10 mt-3 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-background shadow-lg sm:h-20 sm:w-20">
            <RotatingBadge text="CERTIFIED IT SPECIALIST • NETWORK & SYSTEMS • " size={62} />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Open to opportunities
        </motion.div>

        <motion.div variants={itemVariants} className="mt-5 flex flex-wrap justify-center gap-3">
          {resumeUrl && (
            <Magnetic>
              <Button asChild variant="gradient" size="lg">
                <a href={resumeUrl} download>
                  <Download className="h-4 w-4" /> Download Resume
                </a>
              </Button>
            </Magnetic>
          )}
          <Magnetic>
            <Button asChild variant="outline" size="lg">
              <a href="#contact">
                <Mail className="h-4 w-4" /> Contact Me
              </a>
            </Button>
          </Magnetic>
        </motion.div>

        {socialLinks.length > 0 && (
          <motion.div variants={itemVariants} className="mt-5 flex justify-center gap-3">
            {socialLinks.map((link) => {
              const Icon = PLATFORM_ICON[link.platform] ?? Globe;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                  aria-label={link.platform}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
