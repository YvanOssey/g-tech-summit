/**
 * Single source of truth for ticket prices.
 * The server computes order totals from this file — amounts sent by the browser
 * are never trusted.
 */
export type PassId = "event" | "hackathon";

export interface Pass {
  id: PassId;
  name: string;
  /** Price in FCFA (XOF), integer. */
  price: number;
  /** What the pass gives access to — kept strictly factual. */
  access: string;
  summary: string;
}

export const PASSES: Record<PassId, Pass> = {
  event: {
    id: "event",
    name: "Pass Event",
    price: 10_000,
    access: "Accès à G-TECH SUMMER — 2 jours",
    summary: "Conférences, panels, formations express, ateliers, stands et networking.",
  },
  hackathon: {
    id: "hackathon",
    name: "Pass Hackathon",
    price: 15_000,
    access: "Participation au hackathon uniquement",
    summary: "Par personne. Participation en équipe, une thématique par équipe.",
  },
};

export const PASS_ORDER: readonly PassId[] = ["event", "hackathon"];

/** One order = one participant, one or both passes (max one of each). */
export function orderTotal(passIds: readonly PassId[]): number {
  return [...new Set(passIds)].reduce((sum, id) => sum + PASSES[id].price, 0);
}
