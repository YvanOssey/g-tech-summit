/**
 * Settings that are NOT decided yet and will be editable from the admin
 * (stored in the database once the back office exists).
 * `null` means "not announced" — the UI renders <Pending /> instead of guessing.
 *
 * Pages read them through `getEventSettings()` so the data source can switch
 * from this file to the database without touching any component.
 */
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
    teamSize: { min: 2, max: 3 }, // confirmed by the organisers, 2026-10-06
    registrationDeadline: null,
    quota: null,
    challengesStart: null,
    jury: null,
  },
};

export async function getEventSettings(): Promise<EventSettings> {
  return DEFAULT_SETTINGS;
}
