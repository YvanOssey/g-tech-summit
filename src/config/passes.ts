/**
 * Single source of truth for ticket prices and capacities.
 * The server computes order totals from this file — amounts sent by the browser
 * are never trusted.
 *
 * On sale since 2026-11-03 (organisers): 50 places on site, in two steps.
 * - Pass Entrée gratuit      0 FCFA — 10 places   (id "free"), one per person
 * - Pass Entrée          2 500 FCFA — 40 places   (id "event", kept so ?pass=event links still work)
 * Only one is offered at a time: the free one until its 10 places are gone,
 * then the paid one (passesOnSale).
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
    name: "Pass Entrée gratuit",
    price: 0,
    per: "personne",
    capacity: { total: 10, unit: "places" },
    access: "Accès sur place à G-TECH SUMMIT — 2 jours",
    summary: "Offert aux 10 premiers inscrits, un par personne. Conférences, panels, formations express, ateliers et networking.",
  },
  event: {
    id: "event",
    name: "Pass Entrée",
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
export const PASS_ORDER: readonly PassId[] = ["free", "event"];

/** Every pass that may appear on an existing order (admin lists, filters, statistics). */
export const ALL_PASSES: readonly PassId[] = ["online", "free", "event", "hackathon"];

/** Places on site this edition, free and paid together. */
export const ON_SITE_PLACES = PASSES.free.capacity.total + PASSES.event.capacity.total;

/**
 * The pass offered right now: the free one while it has places left, then the
 * paid one. `sold` comes from getEventSettings() (cached up to 5 minutes): the
 * database still refuses a free place once the 10 are taken.
 */
export function passesOnSale(sold: Partial<Record<PassId, number>>): PassId[] {
  return (sold.free ?? 0) < PASSES.free.capacity.total ? ["free"] : ["event"];
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