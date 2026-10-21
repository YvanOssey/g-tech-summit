/**
 * Single source of truth for ticket prices and capacities.
 * The server computes order totals from this file — amounts sent by the browser
 * are never trusted.
 *
 * Validated by the organisers on 2026-10-06:
 * - Pass En ligne     2 000 FCFA — 100 places
 * - Pass Présentiel   5 000 FCFA — 40 places   (id "event", kept so ?pass=event links still work)
 * - Pass Hackathon   15 000 FCFA per TEAM — 10 teams of 5 people (team size changed on 2026-10-07)
 *   Two Cups, 5 teams each (see TRACK_CAPACITY): AFRO DEV CUP and CYBER CUP.
 * Numbers of passes already sold live in settings (`getEventSettings().sold`).
 */
export type PassId = "online" | "event" | "hackathon";

export interface Pass {
  id: PassId;
  name: string;
  /** Price in FCFA (XOF), integer. */
  price: number;
  /** What the price buys: one person or one whole team. */
  per: "personne" | "équipe";
  /** Maximum number sold, and what is counted. */
  capacity: { total: number; unit: "places" | "équipes" };
  /** What the pass gives access to — kept strictly factual. */
  access: string;
  summary: string;
}

export const PASSES: Record<PassId, Pass> = {
  online: {
    id: "online",
    name: "Pass En ligne",
    price: 2_000,
    per: "personne",
    capacity: { total: 100, unit: "places" },
    access: "Suivre G-TECH SUMMIT à distance — 2 jours",
    summary: "Lien de connexion envoyé par e-mail.",
  },
  event: {
    id: "event",
    name: "Pass Présentiel",
    price: 5_000,
    per: "personne",
    capacity: { total: 40, unit: "places" },
    access: "Accès sur place à G-TECH SUMMIT — 2 jours",
    summary: "Conférences, panels, formations express, ateliers, stands et networking.",
  },
  hackathon: {
    id: "hackathon",
    name: "Pass Hackathon",
    price: 15_000,
    per: "équipe",
    capacity: { total: 10, unit: "équipes" },
    access: "Hackathon + accès sur place à G-TECH SUMMIT",
    summary: "Par équipe de 5 personnes, chacune avec accès à l’événement. Une thématique par équipe.",
  },
};

/**
 * Teams per hackathon Cup. Keys are the track codes of src/content/hackathon.ts:
 * "01" = CYBER CUP, "02" = AFRO DEV CUP. The sum must equal PASSES.hackathon.capacity.total.
 */
export const TRACK_CAPACITY: Record<string, number> = { "01": 5, "02": 5 };

/**
 * Places held by an unpaid order. 15 minutes (organisers, 2026-10-08, was 30):
 * enough to pay by mobile money, and halves how long a fake order blocks places.
 */
export const HOLD_MINUTES = 10;

/** People per hackathon team, the buyer included. */
export const TEAM_SIZE = 5;

export const PASS_ORDER: readonly PassId[] = ["online", "event", "hackathon"];

/**
 * Passes that cannot be combined in one order. Since 2026-10-07 no pass combines
 * with another: the hackathon pass already includes on-site access to the event.
 */
export const EXCLUSIVE: readonly (readonly PassId[])[] = [["online", "event", "hackathon"]];

/** Applies the exclusivity rule when `added` is selected. */
export function withExclusions(selection: readonly PassId[], added: PassId): PassId[] {
  const blocked = EXCLUSIVE.filter((group) => group.includes(added)).flat().filter((id) => id !== added);
  return PASS_ORDER.filter((id) => id === added || (selection.includes(id) && !blocked.includes(id)));
}

/** One order = one buyer and one pass (exclusivity applied). */
export function orderTotal(passIds: readonly PassId[]): number {
  return [...new Set(passIds)].reduce((sum, id) => sum + PASSES[id].price, 0);
}