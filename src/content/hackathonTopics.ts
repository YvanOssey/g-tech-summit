import "server-only";

/**
 * Cup topics, kept secret until the night of 16 December 2026 (23:59:59, Abidjan = UTC).
 * Server-only on purpose: this text must never be bundled for the browser before the reveal.
 * Keys are the track codes of TRACKS ("01" CYBER CUP, "02" AFRO DEV CUP).
 */
export interface Topic {
  title: string;
  brief: string;
  challenge: string;
}

export const THEMES_REVEAL_AT = "2026-12-17T00:00:00Z";

export function themesRevealed(): boolean {
  return Date.now() >= Date.parse(THEMES_REVEAL_AT);
}

export const TOPICS: Record<string, Topic> = {
  "01": {
    title: "Détecter et neutraliser les cyberattaques intelligentes",
    brief: "Concevoir un système intelligent de détection et de réponse aux cyberattaques dans une infrastructure réseau et cloud.",
    challenge: "analyse de journaux, détection d’intrusion, corrélation d’événements et réponse à incident dans un laboratoire isolé.",
  },
  "02": {
    title: "L’intelligence artificielle au service des villes africaines",
    brief:
      "Concevoir une plateforme intelligente capable d’anticiper et de résoudre un problème urbain en Côte d’Ivoire : embouteillages, gestion des déchets, inondations ou consommation d’énergie.",
    challenge: "intégrer une IA prédictive, des données géographiques et un tableau de bord décisionnel.",
  },
};