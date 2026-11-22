/**
 * Single source of truth for ticket prices and capacities.
 * The server computes order totals from this file — amounts sent by the browser
 * are never trusted.
 *
 * Since 2026-11-22 (organisers): the event is FREE, on registration.
 * - Pass Entrée              0 FCFA — 80 participants expected (id "free"), one per person
 * - Pass Entrée (payant) 2 500 FCFA — no longer on sale (id "event"): sold
 *   from 2026-11-03 after the first 10 free places; kept for those tickets.
 * No online pass and no hackathon this edition (the hackathon moves to the next
 * one). Their definitions stay below because orders already paid reference them
 * (tickets, admin, e-mails) and for a future edition: PASS_ORDER, not PASSES,
 * decides what is on sale.
 * Numbers of passes already sold live in settings (`getEventSettings().sold`).
 */
export type PassId = "online" | "free" | "event" | "hackathon";

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
  free: {
    id: "free",
    name: "Pass Entrée",
    price: 0,
    per: "personne",
    capacity: { total: 80, unit: "places" },
    access: "Accès sur place à G-TECH SUMMIT — 2 jours",
    summary: "Entrée gratuite sur inscription, une place par personne. Conférences, panels, formations express, ateliers, démonstrations et networking.",
  },
  event: {
    id: "event",
    name: "Pass Entrée (payant)",
    price: 2_500,
    per: "personne",
    capacity: { total: 40, unit: "places" },
    access: "Accès sur place à G-TECH SUMMIT — 2 jours",
    summary: "Conférences, panels, formations express, ateliers, démonstrations, stands et networking.",
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

/** Passes the checkout accepts, in display order. The checkout refuses any other. */
export const PASS_ORDER: readonly PassId[] = ["free"];

/** Every pass that may appear on an existing order (admin lists, filters, statistics). */
export const ALL_PASSES: readonly PassId[] = ["online", "free", "event", "hackathon"];

/** Participants expected on site (shown on the site; registrations stop there). */
export const EXPECTED_PARTICIPANTS = PASSES.free.capacity.total;

/**
 * Counts for the gauges: the paid entries sold before the event became free
 * (still valid, refunded by hand) take places among the participants expected.
 */
export function withPaidEntries(sold: Record<PassId, number>): Record<PassId, number> {
  return { ...sold, free: sold.free + sold.event };
}

/** The pass offered on the site: the free Pass Entrée only. */
export function passesOnSale(): PassId[] {
  return [...PASS_ORDER];
}

/**
 * Passes that cannot be combined in one order. Since 2026-10-07 no pass combines
 * with another: the hackathon pass already includes on-site access to the event.
 */
export const EXCLUSIVE: readonly (readonly PassId[])[] = [["online", "free", "event", "hackathon"]];

/** Applies the exclusivity rule when `added` is selected. */
export function withExclusions(selection: readonly PassId[], added: PassId): PassId[] {
  const blocked = EXCLUSIVE.filter((group) => group.includes(added)).flat().filter((id) => id !== added);
  return PASS_ORDER.filter((id) => id === added || (selection.includes(id) && !blocked.includes(id)));
}

/** One order = one buyer and one pass (exclusivity applied). */
export function orderTotal(passIds: readonly PassId[]): number {
  return [...new Set(passIds)].reduce((sum, id) => sum + PASSES[id].price, 0);
}