"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;
/** Never draw more than this many segments; each then stands for several places. */
const MAX_SEGMENTS = 40;

interface CapacityGaugeProps {
  sold: number;
  total: number;
  unit: "places" | "équipes";
  /** Colours follow the ticket: light ticket → ink text, dark ticket → paper text. */
  dark?: boolean;
  className?: string;
}

/**
 * Registration level of a pass, drawn as a segmented bar. When the ticket
 * comes into view the segments draw in one after the other, then the sold
 * ones light up orange. Numbers are real (0 until registrations open).
 */
export function CapacityGauge({ sold, total, unit, dark = false, className = "" }: CapacityGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  const taken = Math.min(Math.max(sold, 0), total);
  const left = total - taken;
  const segments = Math.min(total, MAX_SEGMENTS);
  const perSegment = total / segments;
  // Round up: as soon as one place is taken, at least one segment lights up.
  const lit = Math.ceil(taken / perSegment);
  const full = left === 0;
  const muted = dark ? "text-mist" : "text-smoke";
  const empty = dark ? "bg-paper/25" : "bg-ink/20";

  return (
    <div ref={ref} className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="type-meta">
          <span className="font-medium">{taken}</span> / {total} {unit}
        </p>
        <p className={`type-meta ${full ? "text-signal" : muted}`}>
          {full ? "Complet" : `${left} ${left > 1 ? "restantes" : "restante"}`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label={`Inscriptions : ${taken} ${taken > 1 ? unit : unit.slice(0, -1)} sur ${total}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={taken}
        className="mt-2 flex h-2.5 gap-[2px]"
      >
        {Array.from({ length: segments }, (_, i) => {
          const isLit = i < lit;
          return (
            <motion.span
              key={i}
              data-reveal=""
              className={`h-full flex-1 origin-bottom rounded-[1px] ${isLit ? "bg-signal" : empty}`}
              initial={reduce ? false : { scaleY: 0, opacity: 0 }}
              animate={on ? { scaleY: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.35, delay: i * (0.6 / segments) + (isLit ? 0.4 : 0), ease: EASE }}
            />
          );
        })}
      </div>
    </div>
  );
}
