"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";

interface RevealTextProps {
  /** Lines are revealed one after another; words inside a line rise together. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Reveal when scrolled into view instead of on mount. */
  inView?: boolean;
}

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * Typographic reveal: each line slides up from behind its own baseline mask.
 * Reserved for a few key headlines — not a generic entrance effect.
 */
export function RevealText({ lines, as: Tag = "h2", className, delay = 0, inView = false }: RevealTextProps) {
  const reduce = useReducedMotion();
  const label = lines.join(" ");

  if (reduce) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const trigger = inView
    ? { whileInView: "shown", viewport: { once: true, amount: 0.6 } }
    : { animate: "shown" };

  return (
    <Tag className={className} aria-label={label}>
      <motion.span className="block" initial="hidden" {...trigger} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <motion.span
              className="block"
              variants={{
                hidden: { y: "105%" },
                shown: { y: "0%", transition: { duration: 0.9, ease: EASE, delay: delay + i * 0.09 } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
