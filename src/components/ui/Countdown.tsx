"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/** Doors open: Friday 18 December 2026, 08:00 in Abidjan (UTC+0). */
const START = Date.UTC(2026, 11, 18, 8, 0, 0);
/** End of day 2 */
const END = Date.UTC(2026, 11, 19, 19, 0, 0);

type Phase = "before" | "live" | "over";

function compute(now: number) {
  if (now >= END) return { phase: "over" as Phase, parts: null };
  if (now >= START) return { phase: "live" as Phase, parts: null };
  let s = Math.floor((START - now) / 1000);
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes * 60;
  return { phase: "before" as Phase, parts: { days, hours, minutes, seconds } };
}

const UNITS = [
  { key: "days", label: "Jours", short: "J" },
  { key: "hours", label: "Heures", short: "H" },
  { key: "minutes", label: "Minutes", short: "Min" },
  { key: "seconds", label: "Secondes", short: "Sec" },
] as const;

/** One value that rolls downwards when it changes. */
function Rolling({ value, pad }: { value: number; pad: boolean }) {
  const text = pad ? String(value).padStart(2, "0") : String(value);
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

interface CountdownProps {
  size?: "md" | "lg";
  className?: string;
}

/**
 * Live countdown to the opening of the doors. Rendered on the client only
 * (the server cannot know the visitor's current time); reserves its space meanwhile.
 */
export function Countdown({ size = "md", className = "" }: CountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const state = now === null ? null : compute(now);
  const big = size === "lg";

  if (state?.phase === "over") return null;

  if (state?.phase === "live") {
    return (
      <p className={`flex items-center gap-3 font-semibold ${className}`}>
        <span aria-hidden="true" className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-mark opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-mark" />
        </span>
        G-TECH SUMMER est en cours
      </p>
    );
  }

  const parts = state?.parts;
  const label = parts
    ? `${parts.days} jours, ${parts.hours} heures, ${parts.minutes} minutes avant l’ouverture`
    : "Compte à rebours";

  return (
    <div className={className}>
      <span className="sr-only" aria-live="off">
        {label}
      </span>
      <ol aria-hidden="true" className={`grid grid-cols-4 ${big ? "gap-3 md:gap-4" : "gap-2"}`}>
        {UNITS.map((u) => (
          <li
            key={u.key}
            className={`flex min-w-0 flex-col items-start rounded-2xl bg-surface ${big ? "px-3 py-3.5 sm:px-4 sm:py-4 md:py-5" : "px-2.5 py-2.5 sm:px-3"}`}
          >
            <span
              className={`type-condensed leading-none ${big ? "text-[clamp(2rem,1.2rem+3.4vw,4.5rem)]" : "text-[1.875rem]"} ${
                u.key === "seconds" ? "text-accent" : ""
              }`}
            >
              {parts ? <Rolling value={parts[u.key]} pad={u.key !== "days"} /> : "––"}
            </span>
            <span
              className={`mt-1.5 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted uppercase ${big ? "sm:text-xs sm:tracking-[0.12em]" : ""}`}
            >
              <span className="sm:hidden">{u.short}</span>
              <span className="hidden sm:inline">{u.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
