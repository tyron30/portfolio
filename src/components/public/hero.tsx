"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Mail, Github, Linkedin, Facebook, Instagram, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
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
    <section id="hero" className="relative overflow-x-clip pb-10 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--foreground))_1px,transparent_0)] bg-[length:32px_32px] opacity-[0.05]" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center"
      >
        <div className="relative w-full text-center">
          <h1 className="relative z-0 select-none font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            <SplitText text={line1} className="block text-foreground" />
            <SplitText text={line2} className="text-gradient text-shimmer block" />
          </h1>

          {/* Photo: a normal block element centered with mx-auto (the one
              CSS centering technique that always works, regardless of the
              text above it), pulled up with a negative margin to overlap
              the bottom of the headline. Hover fades it to reveal the full
              text underneath — a built-in way to always read it in full. */}
          <motion.div
            variants={itemVariants}
            className="group relative z-10 mx-auto -mt-[150px] aspect-[3/4] w-64 sm:-mt-[200px] sm:w-80 md:-mt-[260px] md:w-[26rem] lg:-mt-[300px] lg:w-[29rem]"
          >
            <div className="relative h-full w-full">
              {about?.profile_image_url ? (
                <Image
                  src={about.profile_image_url}
                  alt={fullName}
                  fill
                  priority
                  sizes="(max-width: 768px) 70vw, 464px"
                  className="object-contain object-top transition-opacity duration-500 group-hover:opacity-30"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground">
                  {fullName.charAt(0)}
                </div>
              )}
            </div>
            <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Hover to read full text
            </span>
          </motion.div>
        </div>

        {about?.headline && (
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-md text-lg font-medium text-muted-foreground"
          >
            {about.headline} — support, networks, and systems that just work.
          </motion.p>
        )}

        <motion.div variants={itemVariants} className="relative z-10 mt-6 flex justify-center">
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
