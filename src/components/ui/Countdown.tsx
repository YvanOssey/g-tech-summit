"use client";

import { useSyncExternalStore } from "react";

const START = Date.UTC(2026, 11, 18); // 18 Dec 2026, Abidjan is UTC+0
const END = Date.UTC(2026, 11, 20);
const DAY = 86_400_000;

function todayUtc() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

const subscribe = () => () => {};

/** "J–76" until the event, "En cours" during it, nothing after. Rendered client-side only. */
export function Countdown({ className = "" }: { className?: string }) {
  const today = useSyncExternalStore(subscribe, todayUtc, () => null);
  if (today === null) return <span className={className} aria-hidden="true" />;

  let label: string | null = null;
  if (today < START) label = `J–${Math.round((START - today) / DAY)}`;
  else if (today < END) label = "En cours";
  if (!label) return null;

  return (
    <span className={className}>
      <span className="sr-only">Compte à rebours : </span>
      {label}
    </span>
  );
}
