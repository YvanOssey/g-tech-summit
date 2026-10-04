"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

const ITEM: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const TAGS = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  article: motion.article,
} as const;

type Tag = keyof typeof TAGS;

type Props = { as?: Tag; children: ReactNode } & Omit<HTMLMotionProps<"div">, "children">;

/**
 * Scroll reveals, used sparingly on groups of content (cards, panels, images) —
 * never on every element. Reduced motion is honoured globally by <MotionProvider>.
 */
export function Reveal({ as = "div", delay = 0, children, ...rest }: Props & { delay?: number }) {
  const M = TAGS[as] as typeof motion.div;
  return (
    <M
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{ hidden: ITEM.hidden, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Container whose <RevealItem> children appear one after another. */
export function RevealGroup({ as = "div", stagger = 0.08, children, ...rest }: Props & { stagger?: number }) {
  const M = TAGS[as] as typeof motion.div;
  return (
    <M
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function RevealItem({ as = "div", children, ...rest }: Props) {
  const M = TAGS[as] as typeof motion.div;
  return (
    <M variants={ITEM} {...rest}>
      {children}
    </M>
  );
}
