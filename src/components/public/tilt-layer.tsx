"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** Gives its children a subtle 3D tilt that follows the mouse (desktop only, off for reduced-motion). */
export function TiltLayer({ children, className, max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 110, damping: 16 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max * 0.7, -max * 0.7]), { stiffness: 110, damping: 16 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
