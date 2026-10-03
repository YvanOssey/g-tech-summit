/**
 * Hackathon — source: TDR section XII, validated by the organisers.
 * Undecided items (team size, deadline, quota, challenge start, jury) live in
 * `config/settings.ts` and are rendered as pending.
 */

export const HACKATHON = {
  name: "Hackathon Ghostech",
  edition: "2ᵉ édition",
  theme: "Digitalisation & Innovation pour l’Afrique d’aujourd’hui et de demain",
  intro:
    "Un hackathon multithématique qui réunit développeurs, designers, data scientists, ingénieurs et entrepreneurs autour de défis à fort impact social pour la Côte d’Ivoire et l’Afrique.",
  finale: {
    pitch: { date: "Samedi 19 décembre", time: "15:00", label: "Pitch & présentations finales — projets finalistes + vote du public" },
    awards: { date: "Samedi 19 décembre", time: "17:00", label: "Annonce des vainqueurs & remise des prix" },
  },
  pitchFormat: { presentation: "4 minutes de présentation", questions: "2 minutes de questions-réponses avec le jury" },
} as const;

export interface Track {
  code: string;
  name: string;
  claim: string;
  description: string;
}

export const TRACKS: readonly Track[] = [
  {
    code: "01",
    name: "Cybersécurité",
    claim: "Sécuriser l’Afrique numérique",
    description: "Développer des solutions pour protéger les systèmes, réseaux et données contre les cybermenaces.",
  },
  {
    code: "02",
    name: "Réseau & infrastructure",
    claim: "Connecter l’Afrique intelligemment",
    description: "Imaginer des infrastructures et des solutions réseau adaptées aux réalités africaines.",
  },
  {
    code: "03",
    name: "Robotique",
    claim: "Automatiser les solutions africaines",
    description: "Créer des systèmes robotiques et embarqués qui répondent à des défis locaux.",
  },
  {
    code: "04",
    name: "Développement & IA",
    claim: "Innover pour l’impact social africain",
    description: "Concevoir des applications web, mobile et IA utiles aux populations et aux entreprises africaines.",
  },
];

export const ELIGIBLE = [
  "Étudiants",
  "Développeurs",
  "Designers",
  "Data scientists",
  "Ingénieurs",
  "Entrepreneurs",
  "Passionnés de technologie et d’innovation",
] as const;

export const RULES = [
  "Participation en équipe uniquement.",
  "Les équipes multidisciplinaires sont fortement encouragées.",
  "Chaque équipe choisit une seule thématique.",
  "Le projet présenté doit être original et innovant.",
  "La solution répond à une problématique réelle en Côte d’Ivoire ou en Afrique.",
  "Le projet est développé pendant la période du hackathon.",
  "Le respect de l’éthique, du fair-play et des autres participants est obligatoire.",
] as const;

export const CRITERIA = [
  "L’innovation",
  "L’impact social",
  "La qualité technique",
  "Le design & l’expérience utilisateur",
  "La pertinence de la solution",
  "La présentation finale",
] as const;

export const REWARDS = [
  "Des récompenses et distinctions",
  "De la visibilité auprès des partenaires",
  "Des opportunités d’accompagnement",
  "Une mise en avant dans l’écosystème tech",
] as const;
