/**
 * Single source of truth for ticket prices and capacities.
 * The server computes order totals from this file — amounts sent by the browser
 * are never trusted.
 *
 * Validated by the organisers on 2026-10-06:
 * - Pass En ligne     5 000 FCFA — 100 places
 * - Pass Présentiel  10 000 FCFA — 40 places   (id "event", kept so ?pass=event links still work)
 * - Pass Hackathon   15 000 FCFA per TEAM — 10 teams of 2 to 3 people
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
    price: 5_000,
    per: "personne",
    capacity: { total: 100, unit: "places" },
    access: "Suivre G-TECH SUMMIT à distance — 2 jours",
    summary: "Lien de connexion envoyé par e-mail.",
  },
  event: {
    id: "event",
    name: "Pass Présentiel",
    price: 10_000,
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
    access: "Participation au hackathon uniquement",
    summary: "Par équipe de 2 à 3 personnes. Une thématique par équipe.",
  },
};

export const PASS_ORDER: readonly PassId[] = ["online", "event", "hackathon"];

/**
 * Passes that cannot be combined in one order: one follows the event either
 * remotely or on site. The hackathon pass combines with either.
 */
export const EXCLUSIVE: readonly (readonly PassId[])[] = [["online", "event"]];

/** Applies the exclusivity rule when `added` is selected. */
export function withExclusions(selection: readonly PassId[], added: PassId): PassId[] {
  const blocked = EXCLUSIVE.filter((group) => group.includes(added)).flat().filter((id) => id !== added);
  return PASS_ORDER.filter((id) => id === added || (selection.includes(id) && !blocked.includes(id)));
}

/** One order = one buyer, at most one of each pass, exclusivity applied. */
export function orderTotal(passIds: readonly PassId[]): number {
  return [...new Set(passIds)].reduce((sum, id) => sum + PASSES[id].price, 0);
}
