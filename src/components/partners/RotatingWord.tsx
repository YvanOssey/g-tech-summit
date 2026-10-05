"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A word that changes every few seconds, rolling up from below its line.
 * Screen readers get the whole list once; reduced motion shows the first word.
 */
export function RotatingWord({ words, interval = 2200, className = "" }: { words: readonly string[]; interval?: number; className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, interval, words.length]);

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <span className="sr-only">{words.join(", ")}</span>
      {/* Reserve the width of the longest word so the line does not jump. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={words[i]}
          aria-hidden="true"
          className="col-start-1 row-start-1"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
