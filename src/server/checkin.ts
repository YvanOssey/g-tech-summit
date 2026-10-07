import "server-only";
import { EVENT } from "@/config/event";
import type { PassId } from "@/config/passes";

/** Passes that give access on site. The online pass never opens the doors. */
export const ON_SITE_PASSES: readonly PassId[] = ["event", "hackathon"];

/** Event day (1 or 2) for a date in Abidjan, or null outside the event. */
export function eventDay(now = new Date()): 1 | 2 | null {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Abidjan" }).format(now); // YYYY-MM-DD
  const index = EVENT.days.findIndex((d) => d.iso === today);
  return index === 0 ? 1 : index === 1 ? 2 : null;
}

/** ?jour=1|2 if given, else today's event day. */
export function pickDay(value: unknown, now = new Date()): 1 | 2 | null {
  if (value === "1") return 1;
  if (value === "2") return 2;
  return eventDay(now);
}
