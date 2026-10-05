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
    q: "Quelle est la différence entre le Pass Event et le Pass Hackathon ?",
    a: "Le Pass Event (10 000 FCFA) donne accès aux deux jours de l’événement : conférences, panels, formations express, ateliers, stands et networking. Le Pass Hackathon (15 000 FCFA par personne) donne uniquement accès à la participation au hackathon.",
  },
  {
    q: "Je veux participer à l’événement et au hackathon. Comment faire ?",
    a: "Prenez les deux pass dans la même commande : 10 000 + 15 000, soit 25 000 FCFA.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fera en ligne via Wave, directement depuis le site. Aucun frais supplémentaire n’est ajouté au prix affiché. Les inscriptions en ligne ouvrent prochainement.",
  },
  {
    q: "Comment vais-je recevoir mon billet ?",
    a: "Par e-mail, une fois le paiement réellement confirmé. Le billet est nominatif et contient un QR code unique, scanné à l’entrée.",
  },
  {
    q: "Peut-on participer seul au hackathon ?",
    a: "Non, la participation se fait en équipe uniquement. Chaque membre de l’équipe prend son propre Pass Hackathon. La taille définitive des équipes sera annoncée prochainement.",
  },
  {
    q: "Comment s’inscrire aux formations express ?",
    a: "Sur place, le samedi 19 décembre. Les places sont limitées (25 à 30 participants par module). Chaque formation donne lieu à une attestation de participation.",
  },
  {
    q: "Où se déroule l’événement ?",
    a: "À Abidjan. Le lieu exact sera annoncé prochainement sur ce site.",
  },
  {
    q: "Peut-on annuler ou se faire rembourser ?",
    a: "La politique d’annulation est en cours de définition. Elle sera publiée avant l’ouverture des inscriptions.",
  },
];
