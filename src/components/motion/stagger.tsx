"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

/** Wraps a grid — animates its StaggerItem children in one after another as it scrolls into view. */
export function StaggerContainer({ children, className }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** One item inside a StaggerContainer — e.g. a single project or certificate card. */
export function StaggerItem({ children, className }: StaggerProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
