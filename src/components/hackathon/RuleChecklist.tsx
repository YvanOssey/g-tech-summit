"use client";

import { motion } from "motion/react";

const EASE = [0.25, 1, 0.5, 1] as const;

/** Rules that tick themselves off one by one as they scroll into view. */
export function RuleChecklist({ rules }: { rules: readonly string[] }) {
  return (
    <ol className="border-b border-rule-strong">
      {rules.map((r, i) => (
        <motion.li
          key={r}
          className="grid grid-cols-[2.5rem_1fr] items-start gap-4 border-t border-rule-strong py-5"
          initial="off"
          whileInView="on"
          viewport={{ once: true, amount: 0.8 }}
        >
          <span className="relative flex size-8 items-center justify-center rounded-pill border border-rule-strong">
            <motion.span
              className="absolute inset-0 rounded-pill bg-signal"
              variants={{ off: { scale: 0 }, on: { scale: 1, transition: { duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE } } }}
            />
            <svg viewBox="0 0 16 16" aria-hidden="true" className="relative size-4 text-ink">
              <motion.path
                d="M3 8.5l3.2 3.2L13 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                variants={{ off: { pathLength: 0 }, on: { pathLength: 1, transition: { duration: 0.45, delay: 0.3 + i * 0.05, ease: EASE } } }}
              />
            </svg>
          </span>
          <span className="pt-1 text-body">
            <span className="type-meta mr-3 text-muted">{String(i + 1).padStart(2, "0")}</span>
            {r}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
