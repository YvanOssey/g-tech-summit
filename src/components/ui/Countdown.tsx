"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/config/event";

/** Doors open (programme: accueil 08:00, Abidjan = UTC+0). */
const START = Date.parse(EVENT.doorsOpen.iso);
const MINUTE = 60_000;

/**
 * Current time on the client only (the server cannot know it), refreshed every
 * minute. Nothing animates: the value simply changes.
 */
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, MINUTE);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

const UNITS = [
  { key: "days", label: "Jours", short: "J" },
  { key: "hours", label: "Heures", short: "H" },
  { key: "minutes", label: "Minutes", short: "Min" },
] as const;

/**
 * Days / hours / minutes until the doors open — no seconds, no animation.
 * Shown in the homepage hero (centred) and at the end of the homepage.
 */
export function Countdown({
  className = "",
  centered = false,
  alternate = false,
}: {
  className?: string;
  centered?: boolean;
  /** Alternate colours: figures orange · paper · orange, captions the reverse. */
  alternate?: boolean;
}) {
  const now = useNow();
  if (now !== null && now >= START) return null;

  let parts: Record<(typeof UNITS)[number]["key"], number> | null = null;
  if (now !== null) {
    let m = Math.floor((START - now) / MINUTE);
    const days = Math.floor(m / 1440);
    m -= days * 1440;
    parts = { days, hours: Math.floor(m / 60), minutes: m % 60 };
  }

  return (
    <div className={className}>
      {parts && (
        <span className="sr-only">
          {parts.days} jours, {parts.hours} heures et {parts.minutes} minutes avant l’ouverture des portes
        </span>
      )}
      <ol aria-hidden="true" className="grid grid-cols-3 border-t border-rule-strong">
        {UNITS.map((u, i) => (
          <li
            key={u.key}
            className={`py-4 ${centered ? "text-center" : ""} ${i > 0 ? `border-l border-rule ${centered ? "" : "pl-4"}` : ""}`}
          >
            <span className={`type-condensed block text-title ${alternate && i % 2 === 0 ? "text-signal" : ""}`}>
              {parts ? String(parts[u.key]).padStart(u.key === "days" ? 1 : 2, "0") : "––"}
            </span>
            <span className={`type-meta mt-1 block ${alternate && i % 2 === 1 ? "text-signal" : "text-muted"}`}>
              <span className="sm:hidden">{u.short}</span>
              <span className="hidden sm:inline">{u.label}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
