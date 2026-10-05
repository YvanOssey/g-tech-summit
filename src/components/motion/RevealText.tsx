"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";

interface RevealTextProps {
  /** Lines are revealed one after another; words inside a line rise together. */
  lines: readonly ReactNode[];
  /** Accessible text — required when a line is not a plain string. */
  label?: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Reveal when scrolled into view instead of on mount. */
  inView?: boolean;
  id?: string;
}

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * Typographic reveal: each line slides up from behind its own baseline mask.
 * Reserved for a few key headlines — not a generic entrance effect.
 * Reduced motion: the CSS path is neutralised by the global media query, the
 * in-view path by <MotionConfig reducedMotion="user"> (see MotionProvider).
 */
export function RevealText({ lines, label: labelProp, as: Tag = "h2", className, delay = 0, inView = false, id }: RevealTextProps) {
  const label = labelProp ?? lines.filter((l): l is string => typeof l === "string").join(" ");

  // On-mount reveals run in CSS so the headline animates on first paint,
  // without waiting for hydration (and stays visible if JavaScript fails).
  if (!inView) {
    return (
      <Tag id={id} className={className} aria-label={label}>
        <span className="block" aria-hidden="true">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="reveal-line block" style={{ animationDelay: `${delay + i * 0.09}s` }}>
                {line}
              </span>
            </span>
          ))}
        </span>
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className} aria-label={label}>
      <motion.span className="block" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.6 }} aria-hidden="true">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <motion.span
              data-reveal=""
              className="block origin-bottom-left"
              variants={{
                hidden: { y: "110%", rotate: 4 },
                shown: { y: "0%", rotate: 0, transition: { duration: 1, ease: EASE, delay: delay + i * 0.1 } },
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
