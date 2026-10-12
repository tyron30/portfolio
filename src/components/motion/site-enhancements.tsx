"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Site-wide polish, mounted once in the public layout:
 *  - intro preloader (once per tab session)
 *  - scroll progress bar
 *  - animated aurora + dot-grid background
 *  - cursor ring that grows over interactive elements (mouse devices only)
 *  - spotlight glow that follows the pointer on every `.glass` / `.spot` card
 */
export function SiteEnhancements({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(true);
  const [fine, setFine] = useState(false);

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TD";

  // Intro: show once per tab session
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
    } catch {}
    if (seen || reduce) {
      setIntro(false);
      return;
    }
    const t = setTimeout(() => {
      setIntro(false);
      try {
        sessionStorage.setItem("intro-seen", "1");
      } catch {}
    }, 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  // Cursor ring + spotlight vars
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setFine(isFine);
    if (!isFine || reduce) return;

    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      raf = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const card = t?.closest?.(".glass, .spot") as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      const hot = !!t?.closest?.("a, button, [role='button'], input, textarea, select, label");
      ring.current?.setAttribute("data-hot", hot ? "1" : "0");
    };
    const onLeave = () => ring.current?.setAttribute("data-hide", "1");
    const onEnter = () => ring.current?.removeAttribute("data-hide");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [reduce]);

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-primary via-indigo-500 to-sky-400"
      />

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-dots absolute inset-0 opacity-[0.5]" />
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
      </div>

      {/* Cursor ring */}
      {fine && !reduce && <div ref={ring} aria-hidden className="cursor-ring" />}

      {/* Intro */}
      <AnimatePresence>
        {intro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-white"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="font-display text-7xl font-bold sm:text-8xl"
            >
              {initials}
              <span className="text-primary">.</span>
            </motion.div>
            <div className="mt-6 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-xs uppercase tracking-[0.35em]"
            >
              {name}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
