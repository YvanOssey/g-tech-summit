"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Day } from "@/content/programme";
import { DaySchedule } from "./DaySchedule";

const EASE = [0.25, 1, 0.5, 1] as const;

/** Day switcher: the indicator slides between days, the schedule slides in the direction of travel. */
export function DayTabs({ days }: { days: readonly Day[] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const day = days[active];

  function select(i: number) {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  }

  return (
    <div>
      <div role="tablist" aria-label="Jours" className="grid grid-cols-2 border border-ink">
        {days.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            id={`tab-${d.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${d.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = (i + (e.key === "ArrowRight" ? 1 : -1) + days.length) % days.length;
                select(next);
                document.getElementById(`tab-${days[next].id}`)?.focus();
              }
            }}
            className={`relative px-4 py-4 text-left transition-colors duration-(--duration-component) md:px-6 md:py-5 ${
              i === active ? "text-paper" : "text-ink hover:bg-grey-50"
            } ${i > 0 ? "border-l border-ink" : ""}`}
          >
            {i === active && (
              <motion.span
                layoutId="day-indicator"
                className="absolute inset-0 bg-ink"
                transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              />
            )}
            <span className="relative block">
              <span className={`type-meta block ${i === active ? "text-signal" : "text-grey-500"}`}>Jour {d.index}</span>
              <span className="type-condensed mt-1 block text-[clamp(1.375rem,1rem+1.5vw,2.25rem)] leading-none">
                {d.label}
              </span>
              <span className={`mt-2 hidden text-[0.9375rem] sm:block ${i === active ? "text-grey-400" : "text-grey-500"}`}>
                {d.theme}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={day.id}
            id={`panel-${day.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${day.id}`}
            custom={direction}
            initial={reduce ? false : { opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            <DaySchedule slots={day.slots} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
