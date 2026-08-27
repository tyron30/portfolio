"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035, delayChildren: 0.1 },
  },
};

const child = {
  hidden: { opacity: 0, y: 24, rotateX: -50 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring" as const, damping: 14, stiffness: 130 },
  },
};

interface SplitTextProps {
  text: string;
  className?: string;
}

/** Animates each character in on load, staggered — used for the Hero's giant headline instead of a flat fade. */
export function SplitText({ text, className }: SplitTextProps) {
  return (
    <motion.span
      style={{ display: "inline-block", perspective: 400 }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      aria-label={text}
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block" }} aria-hidden="true">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
