/**
 * Settings that are NOT decided yet, edited from the admin and stored in the
 * database (table event_settings, pass counts from pass_sales()).
 * `null` means "not announced" — the UI renders <Pending /> instead of guessing.
 *
 * Pages read them through `getEventSettings()`; the values below are the
 * fallback used when the database is not configured or not reachable.
 */
import { unstable_cache } from "next/cache";
import { loadEventSettings } from "@/server/repositories/settings";

export interface Venue {
  name: string;
  address: string;
  mapUrl?: string;
}

import type { PassId } from "@/config/passes";

export interface EventSettings {
  venue: Venue | null;
  /**
   * Passes already sold (hackathon: teams registered). Real numbers only —
   * 0 until registrations open; updated from the admin / orders later.
   */
  sold: Record<PassId, number>;
  /** Online registration + payment. Stays false until Genius Pay is connected and tested. */
  registrationOpen: boolean;
  hackathon: {
    teamSize: { min: number; max: number } | null;
    /** ISO date */
    registrationDeadline: string | null;
    /** Maximum number of participants or teams */
    quota: string | null;
    /** ISO date — start of the challenges, before the event */
    challengesStart: string | null;
    jury: readonly string[] | null;
  };
}

const DEFAULT_SETTINGS: EventSettings = {
  venue: null,
  sold: { online: 0, event: 0, hackathon: 0 },
  registrationOpen: false,
  hackathon: {
    teamSize: { min: 5, max: 5 }, // confirmed by the organisers, 2026-10-07
    registrationDeadline: null,
    quota: null,
    challengesStart: null,
    jury: null,
  },
};

/** Cache tag: admin edits and confirmed payments call revalidateTag() with it. */
export const EVENT_SETTINGS_TAG = "event-settings";

/**
 * One cached copy shared by all visitors, refreshed at most every 5 minutes
 * (sooner when the tag is revalidated). Pages stay static and fast.
 */
const cachedSettings = unstable_cache(() => loadEventSettings(DEFAULT_SETTINGS), ["event-settings"], {
  tags: [EVENT_SETTINGS_TAG],
  revalidate: 300,
});

export async function getEventSettings(): Promise<EventSettings> {
  return cachedSettings();
}
