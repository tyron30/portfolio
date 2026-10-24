"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Download, Mail, Github, Linkedin, Facebook, Instagram, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { SplitText } from "@/components/motion/split-text";
import { TiltLayer } from "@/components/public/tilt-layer";

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

  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section ref={sectionRef} id="hero" className="relative isolate overflow-x-clip pb-14 pt-28 text-foreground sm:pt-32">

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center"
      >
        <div className="relative w-full text-center">
          <motion.div style={reduce ? undefined : { y: textY }}>
            <h1 className="relative z-0 select-none font-display text-5xl font-bold uppercase leading-[0.92] sm:text-7xl md:text-8xl lg:text-9xl">
              <SplitText text={line1} className="block text-foreground" />
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="text-gradient text-shimmer block whitespace-nowrap pb-1 text-[2.1rem] leading-none min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
              >
                {line2}
              </motion.span>
            </h1>
          </motion.div>

          {/* Photo: centered block pulled up to overlap the bottom of the headline. Hover fades it
              to reveal the full text underneath. The tilt, glow and rings add depth around it. */}
          <motion.div
            variants={itemVariants}
            className="group relative z-10 mx-auto -mt-[10px] aspect-[3/4] w-56 sm:-mt-[30px] sm:w-80 md:-mt-[50px] md:w-[26rem] lg:-mt-[60px] lg:w-[29rem]"
          >
            {/* soft blue light behind the portrait */}
            <div className="pointer-events-none absolute left-1/2 top-[45%] -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl" />

            {/* holographic rings (centering wrapper is plain; the inner element rotates) */}
            {!reduce && (
              <>
                <div className="pointer-events-none absolute left-1/2 top-[48%] -z-10 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="relative h-full w-full rounded-full border border-dashed border-cyan-400/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_#22d3ee]" />
                  </motion.div>
                </div>
                <div className="pointer-events-none absolute left-1/2 top-[48%] -z-10 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    className="relative h-full w-full rounded-full border border-blue-400/25"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
                  >
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" />
                  </motion.div>
                </div>
              </>
            )}

            {/* light pool under the portrait so it feels grounded, not floating */}
            <div className="pointer-events-none absolute -bottom-2 left-1/2 -z-10 h-16 w-[85%] -translate-x-1/2 rounded-[100%] bg-cyan-400/35 blur-2xl" />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -z-10 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <motion.div className="h-full w-full" style={reduce ? undefined : { y: photoY }}>
              <TiltLayer className="relative h-full w-full">
                {about?.profile_image_url ? (
                  <Image
                    src={about.profile_image_url}
                    alt={fullName}
                    fill
                    priority
                    sizes="(max-width: 768px) 70vw, 464px"
                    style={{
                      WebkitMaskImage: "radial-gradient(ellipse 72% 88% at 50% 38%, #000 58%, rgba(0,0,0,0.6) 74%, transparent 100%)",
                      maskImage: "radial-gradient(ellipse 72% 88% at 50% 38%, #000 58%, rgba(0,0,0,0.6) 74%, transparent 100%)",
                    }}
                    className="object-contain object-top transition-opacity duration-500 group-hover:opacity-30"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground">
                    {fullName.charAt(0)}
                  </div>
                )}
              </TiltLayer>
            </motion.div>

            <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Hover to read full text
            </span>
          </motion.div>
        </div>

        {about?.headline && (
          <motion.p variants={itemVariants} className="mt-8 max-w-md text-lg font-medium text-muted-foreground">
            {about.headline} — support, networks, and systems that just work.
          </motion.p>
        )}

        <motion.div
          variants={itemVariants}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur"
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
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-card/50 text-foreground backdrop-blur hover:bg-accent hover:text-foreground"
            >
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-foreground/75 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-[0_0_16px_hsl(var(--primary)/0.35)]"
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
