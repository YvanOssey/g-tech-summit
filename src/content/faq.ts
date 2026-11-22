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
    q: "L’entrée est-elle payante ?",
    a: "Non, l’entrée est gratuite, sur inscription sur ce site (une place par personne). Le billet donne accès sur place aux deux jours : conférences, panels, formations express, ateliers, démonstrations, stands et networking.",
  },
  {
    q: "Comment s’inscrire ?",
    a: "Sur la page Billetterie : choisissez le Pass Entrée, indiquez vos nom, prénom, e-mail et téléphone, puis confirmez. Aucun paiement n’est demandé.",
  },
  {
    q: "Comment vais-je recevoir mon billet ?",
    a: "Par e-mail, dès la confirmation de votre inscription. Le billet est nominatif et contient un QR code unique, scanné à l’entrée.",
  },
  {
    q: "Comment s’inscrire aux formations express ?",
    a: "Sur place, le samedi 19 décembre. Les places sont limitées (25 à 30 participants par module). Chaque formation donne lieu à une attestation de participation.",
  },
  {
    q: "Où se déroule l’événement ?",
    a: "Au Centre Ivoiro-Coréen, à Abidjan.",
  },
  {
    q: "Peut-on annuler ou se faire rembourser ?",
    a: "Si vous ne pouvez plus venir, prévenez-nous par e-mail ou sur WhatsApp : votre place pourra être proposée à une autre personne.",
  },
];