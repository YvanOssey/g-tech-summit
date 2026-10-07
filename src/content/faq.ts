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
    q: "Quels sont les différents pass ?",
    a: "Le Pass En ligne (5 000 FCFA, 100 places) permet de suivre les deux jours à distance : le lien de connexion est envoyé par e-mail. Le Pass Présentiel (10 000 FCFA, 40 places) donne accès sur place aux deux jours : conférences, panels, formations express, ateliers, stands et networking. Le Pass Hackathon (15 000 FCFA par équipe de 5 personnes, 10 équipes) donne uniquement accès à la participation au hackathon.",
  },
  {
    q: "Je veux participer à l’événement et au hackathon. Comment faire ?",
    a: "Le Pass Hackathon se combine avec le Pass Présentiel ou le Pass En ligne dans la même commande : par exemple Présentiel + Hackathon, 10 000 + 15 000, soit 25 000 FCFA. Le Pass En ligne et le Pass Présentiel ne se cumulent pas.",
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
    a: "Non, la participation se fait en équipe uniquement, de 5 personnes. Un seul Pass Hackathon est pris pour toute l’équipe, et 10 équipes au maximum peuvent s’inscrire.",
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
