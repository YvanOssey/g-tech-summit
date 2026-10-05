"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * A figure that counts up from zero the first time it scrolls into view.
 * The server renders the final value, so the number is right without JavaScript.
 */
export function CountUp({ value, pad = 2, className = "" }: { value: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();
  const format = (n: number) => String(Math.round(n)).padStart(pad, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || !inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.25, 1, 0.5, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
    // format is stable for a given pad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
