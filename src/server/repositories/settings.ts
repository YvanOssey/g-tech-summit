import "server-only";
import type { EventSettings } from "@/config/settings";
import { createPublicClient } from "@/server/db/clients";
import { hasDatabase } from "@/server/db/env";

/**
 * Event settings and pass counts, read with the PUBLIC client (no cookies, so
 * the result can be cached and shared). Anything missing or failing falls
 * back to `fallback` field by field: the public site never breaks because of
 * the database.
 */
export async function loadEventSettings(fallback: EventSettings): Promise<EventSettings> {
  if (!hasDatabase) return fallback;

  try {
    const db = createPublicClient();
    const [settings, sales] = await Promise.all([
      db.from("event_settings").select("*").eq("id", 1).maybeSingle(),
      db.rpc("pass_sales"),
    ]);
    if (settings.error || sales.error || !settings.data) {
      console.warn(`[settings] base indisponible, valeurs par défaut utilisées (${settings.error?.code || sales.error?.code || settings.error?.message || sales.error?.message || "ligne absente"})`);
      return fallback;
    }

    const s = settings.data;
    const sold = { ...fallback.sold };
    for (const row of sales.data ?? []) sold[row.pass_id] = Number(row.sold);

    return {
      venue: s.venue_name && s.venue_address ? { name: s.venue_name, address: s.venue_address, mapUrl: s.venue_map_url ?? undefined } : null,
      sold,
      registrationOpen: s.registration_open,
      hackathon: {
        teamSize: s.team_size_min && s.team_size_max ? { min: s.team_size_min, max: s.team_size_max } : fallback.hackathon.teamSize,
        registrationDeadline: s.registration_deadline,
        // Not stored: capacities live in src/config/passes.ts.
        quota: fallback.hackathon.quota,
        challengesStart: s.challenges_start,
        jury: s.jury && s.jury.length > 0 ? s.jury : null,
      },
    };
  } catch (error) {
    console.warn(`[settings] base injoignable, valeurs par défaut utilisées (${error instanceof Error ? error.name : "erreur"})`);
    return fallback;
  }
}
