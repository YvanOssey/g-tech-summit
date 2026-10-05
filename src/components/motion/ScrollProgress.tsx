"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin orange reading-progress rule along the top edge of the window. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-(--z-skip) h-0.5 origin-left bg-signal"
      style={{ scaleX }}
    />
  );
}
