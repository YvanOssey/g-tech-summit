/**
 * Hackathon — source: TDR section XII, validated by the organisers.
 * Undecided items (team size, deadline, quota, challenge start, jury) live in
 * `config/settings.ts` and are rendered as pending.
 * Tracks: reduced to two by the organisers on 2026-10-06 (cybersecurity and
 * networks merged, robotics dropped).
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
    name: "CYBER CUP",
    claim: "Défendre le numérique : sécuriser les infrastructures de demain",
    description: "Cybersécurité · Réseaux · Cloud",
  },
  {
    code: "02",
    name: "AFRO DEV CUP",
    claim: "Innover pour l’Afrique : du code à l’impact",
    description: "Développement logiciel · Intelligence artificielle",
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

export interface Prize {
  category: string;
  rank: string;
  /** In FCFA. */
  amount: number;
}

/** Cash prizes: two per category. The total is computed, never typed twice. */
export const PRIZES: readonly Prize[] = [
  { category: "Développement & IA", rank: "1er prix", amount: 40_000 },
  { category: "Développement & IA", rank: "2e prix", amount: 20_000 },
  { category: "Cybersécurité", rank: "1er prix", amount: 40_000 },
  { category: "Cybersécurité", rank: "2e prix", amount: 20_000 },
];

export const PRIZES_TOTAL = {
  winners: PRIZES.length,
  amount: PRIZES.reduce((sum, p) => sum + p.amount, 0),
} as const;

export interface SupportGroup {
  title: string;
  items: readonly { label: string; text: string }[];
}

/** Afro Dev Cup — support offered to the winning teams, beyond the cash prizes. */
export const SUPPORT = {
  title: "Afro Dev Cup — Récompenses et accompagnement des lauréats",
  intro:
    "Au-delà des récompenses financières, Ghostech souhaite offrir aux équipes lauréates un accompagnement concret pour valoriser leurs projets, renforcer leurs compétences et favoriser leur développement.",
  groups: [
    {
      title: "Hébergement et déploiement des projets",
      items: [
        {
          label: "Hébergement web",
          text: "hébergement du projet lauréat sur un sous-domaine du nom de domaine officiel de Ghostech pendant un mois.",
        },
        {
          label: "Accès temporaire au cloud",
          text: "mise à disposition, selon les partenariats disponibles, d’accès à des plateformes cloud professionnelles.",
        },
        {
          label: "Accompagnement technique",
          text: "assistance au déploiement, à la configuration et à la mise en ligne des applications développées.",
        },
      ],
    },
    {
      title: "Reconnaissance officielle",
      items: [
        {
          label: "Certificats de distinction",
          text: "délivrance de certificats aux quatre équipes lauréates, soit les deux meilleures équipes de chaque catégorie.",
        },
        {
          label: "Présentation au G-TECH Summit",
          text: "opportunité de présenter les projets lauréats lors du G-TECH Summit organisé par Ghostech, afin de renforcer leur visibilité auprès des acteurs de l’écosystème technologique.",
        },
      ],
    },
    {
      title: "Incubation et évolution des projets",
      items: [
        {
          label: "Amélioration des prototypes",
          text: "accompagnement dans l’amélioration des fonctionnalités, des performances et de la qualité des solutions développées.",
        },
        {
          label: "Conseils stratégiques",
          text: "orientation sur le modèle économique, la viabilité des projets et la recherche de partenaires.",
        },
        {
          label: "Orientation vers l’incubation",
          text: "possibilité de présenter les solutions à des structures d’accompagnement, incubateurs ou partenaires susceptibles de soutenir leur développement.",
        },
      ],
    },
  ] satisfies readonly SupportGroup[],
  note: "Les dispositifs d’hébergement, les accès cloud et les opportunités d’accompagnement seront mis en œuvre selon les ressources disponibles et les partenariats confirmés par Ghostech.",
} as const;

export const CYBER_TRAINING = {
  title: "Formation spécialisée en cybersécurité",
  subtitle: "Formation exclusive offerte par Ghostech aux équipes lauréates",
  text: "Les équipes lauréates bénéficieront d’une formation en cybersécurité organisée par Ghostech sur une période de deux semaines, à raison d’une séance chaque samedi.",
} as const;