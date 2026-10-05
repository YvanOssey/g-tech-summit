"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * A giant outlined word that slides sideways as the page scrolls past it —
 * a typographic transition between two bands. Decorative (aria-hidden).
 */
export function ScrollWord({ word, from = "8%", to = "-28%", className = "" }: { word: string; from?: string; to?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} aria-hidden="true" className={`overflow-hidden ${className}`}>
      <motion.p className="text-outline type-condensed text-poster whitespace-nowrap" style={{ x: reduce ? 0 : x }}>
        {word} · {word} · {word}
      </motion.p>
    </div>
  );
}
