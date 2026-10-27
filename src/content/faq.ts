/**
 * FAQ — every answer is derived from validated information only.
 * Answers that depend on undecided items say so explicitly.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    q: "Faut-il avoir un niveau technique pour venir ?",
    a: "Non. G-TECH SUMMIT s’adresse aussi bien aux personnes qui découvrent la tech qu’aux professionnels. Les formations express sont accessibles aux débutants comme aux initiés, et l’initiation au développement web ne demande aucun prérequis.",
  },
  {
    q: "Quel est le prix de l’entrée ?",
    a: "Un seul billet : le Pass Entrée, à 2 500 FCFA, donne accès sur place aux deux jours (conférences, panels, formations express, ateliers, démonstrations, stands et networking). 50 places seulement.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fait en ligne, directement depuis le site, via Genius Pay : Wave, Orange Money, MTN Money, Moov Money ou carte. Aucun frais supplémentaire n’est ajouté au prix affiché.",
  },
  {
    q: "Comment vais-je recevoir mon billet ?",
    a: "Par e-mail, une fois le paiement réellement confirmé. Le billet est nominatif et contient un QR code unique, scanné à l’entrée.",
  },
  {
    q: "Comment s’inscrire aux formations express ?",
    a: "Sur place, le samedi 19 décembre. Les places sont limitées (25 à 30 participants par module). Chaque formation donne lieu à une attestation de participation.",
  },
  {
    q: "Où se déroule l’événement ?",
    a: "À l’Impact Hub Abidjan.",
  },
  {
    q: "Peut-on annuler ou se faire rembourser ?",
    a: "La politique d’annulation est en cours de définition. Elle sera publiée avant l’ouverture des inscriptions.",
  },
];