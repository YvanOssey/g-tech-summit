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
    a: "Le Pass En ligne (2 000 FCFA, 100 places) permet de suivre les deux jours à distance : le lien de connexion est envoyé par e-mail. Le Pass Présentiel (5 000 FCFA, 40 places) donne accès sur place aux deux jours : conférences, panels, formations express, ateliers, stands et networking. Le Pass Hackathon (15 000 FCFA par équipe de 5 personnes, 10 équipes au total : 5 pour l’AFRO DEV CUP et 5 pour la CYBER CUP) donne accès au hackathon et, pour chaque membre de l’équipe, à l’événement sur place.",
  },
  {
    q: "Je veux participer à l’événement et au hackathon. Comment faire ?",
    a: "Prenez le Pass Hackathon : il donne à chaque membre de l’équipe l’accès à l’événement sur place, en plus du hackathon. Les pass ne se cumulent pas : une inscription correspond à un seul pass.",
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
    a: "Non, la participation se fait en équipe uniquement, de 5 personnes. Un seul Pass Hackathon est pris pour toute l’équipe, et 10 équipes au maximum peuvent s’inscrire : 5 pour l’AFRO DEV CUP (Développement & IA) et 5 pour la CYBER CUP (Cybersécurité & Réseaux).",
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