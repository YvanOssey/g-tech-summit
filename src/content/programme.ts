/**
 * Programme — source: TDR G-Tech Summit 2026 (v2.0), validated by the organisers
 * for the 18–19 December 2026 dates.
 *
 * Editorial rules applied to the source:
 * - typos fixed, wording kept;
 * - "formations certifiantes" → "attestation de participation" (the TDR's own exact term);
 * - durations are only stated when the source gives them unambiguously;
 * - speakers are "à confirmer" in the source → rendered as pending;
 * - Panel 2: title confirmed by the organisers — "Cybersécurité & Données :
 *   enjeux et bonnes pratiques" (description, format and speakers still to come).
 * - Session numbering is written without "#" (Conférence 1, Panel 2…).
 * - 2026-10-27: official programme from the organisers (below), theme
 *   "Technologie • Innovation • Intelligence artificielle"; no hackathon this
 *   edition. New sessions without a description yet: Panel 3, Conférence-débat,
 *   Showcase Tech.
 */

export type SessionType =
  | "accueil"
  | "ouverture"
  | "conference"
  | "panel"
  | "formation"
  | "atelier"
  | "quiz"
  | "pitch"
  | "cloture"
  | "networking"
  | "pause";

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  accueil: "Accueil",
  ouverture: "Ouverture",
  conference: "Conférence",
  panel: "Panel",
  formation: "Formation",
  atelier: "Ateliers",
  quiz: "Quiz & démos",
  pitch: "Showcase",
  cloture: "Clôture",
  networking: "Networking",
  pause: "Pause",
};

export interface Slot {
  start: string;
  end?: string;
  type: SessionType;
  title: string;
  /** null = title not confirmed */
  subtitle?: string | null;
  detail?: string;
  zone: string;
  /** Anchor of the detailed description on /programme */
  ref?: string;
  /** Confirmed speakers, as typed in the admin (e.g. "Awa Koné, Jean Yao"). */
  speakers?: string;
}

export interface Day {
  id: "jour-1" | "jour-2";
  index: 1 | 2;
  date: string;
  label: string;
  theme: string;
  slots: readonly Slot[];
}

export const DAYS: readonly Day[] = [
  {
    id: "jour-1",
    index: 1,
    date: "2026-12-18",
    label: "Vendredi 18 décembre",
    theme: "Ouverture & conférences",
    slots: [
      { start: "08:00", type: "accueil", title: "Accueil & enregistrement", zone: "" },
      { start: "09:00", type: "ouverture", title: "Cérémonie d’ouverture officielle", zone: "" },
      { start: "09:45", type: "conference", title: "Conférence 1", subtitle: "Intelligence artificielle & avenir du travail", zone: "", ref: "conference-1" },
      { start: "11:00", type: "conference", title: "Conférence 2", subtitle: "Entrepreneuriat tech en Afrique", zone: "", ref: "conference-2" },
      { start: "12:30", type: "pause", title: "Pause déjeuner & networking libre", zone: "" },
      { start: "14:00", type: "quiz", title: "Démonstrations live & Quiz Tech", zone: "" },
      { start: "15:10", type: "panel", title: "Panel 1", subtitle: "Diversité & inclusion dans la tech", zone: "", ref: "panel-1" },
      { start: "16:00", type: "panel", title: "Panel 2", subtitle: "Cybersécurité & données — enjeux et bonnes pratiques", zone: "", ref: "panel-2" },
      { start: "17:30", type: "networking", title: "Clôture du Jour 1 & cocktail networking", zone: "" },
    ],
  },
  {
    id: "jour-2",
    index: 2,
    date: "2026-12-19",
    label: "Samedi 19 décembre",
    theme: "Formations, innovation & perspectives",
    slots: [
      { start: "08:00", type: "accueil", title: "Accueil & récapitulatif de la première journée", zone: "" },
      { start: "09:15", type: "formation", title: "Formations express & ateliers pratiques", zone: "", ref: "formations" },
      { start: "12:45", type: "pause", title: "Pause déjeuner & visite des stands", zone: "" },
      { start: "14:00", type: "conference", title: "Conférence 3", subtitle: "Innovation numérique en Côte d’Ivoire — bilan & perspectives", zone: "", ref: "conference-3" },
      { start: "15:00", type: "pitch", title: "Showcase Tech", subtitle: "Présentation de projets innovants, solutions numériques et startups", zone: "" },
      { start: "16:00", type: "panel", title: "Panel 3", subtitle: "L’avenir de l’écosystème technologique africain", zone: "", ref: "panel-3" },
      { start: "17:00", type: "conference", title: "Conférence-débat", subtitle: "Souveraineté numérique africaine — défis et opportunités", zone: "", ref: "conference-debat" },
      { start: "17:30", type: "networking", title: "After-party & cocktail de clôture", zone: "" },
    ],
  },
];

export interface Talk {
  id: string;
  kind: string;
  title: string | null;
  description: string | null;
  objectives?: readonly string[];
  format?: string;
  when: string;
}

export const CONFERENCES: readonly Talk[] = [
  {
    id: "conference-1",
    kind: "Conférence 1",
    title: "Intelligence artificielle & avenir du travail",
    description:
      "L’intelligence artificielle transforme profondément le marché du travail. Cette conférence explore les impacts concrets de l’IA sur les métiers, les opportunités pour les professionnels africains et les compétences clés à développer pour rester compétitif.",
    objectives: [
      "Comprendre les enjeux de l’IA sur l’emploi en Afrique",
      "Identifier les opportunités créées par l’IA",
      "Découvrir des outils IA accessibles et utilisables immédiatement",
      "Monter en compétences face à l’IA",
    ],
    format: "60 min — 45 min de présentation + 15 min de questions",
    when: "Vendredi 18 · 09:45",
  },
  {
    id: "conference-2",
    kind: "Conférence 2",
    title: "Entrepreneuriat tech en Afrique : défis, réussites & stratégies",
    description:
      "Des parcours d’entrepreneurs ivoiriens et africains qui ont bâti des solutions locales à fort impact. Les défis propres au contexte africain — financement, infrastructure, marché — et les stratégies pour créer et faire grandir une startup tech.",
    objectives: [
      "Donner envie de se lancer dans l’entrepreneuriat tech",
      "Partager des méthodes concrètes de croissance",
      "Mettre en lumière des réussites de l’écosystème ivoirien",
      "Identifier les ressources et réseaux disponibles",
    ],
    format: "60 min — 45 min de présentation + 15 min de questions",
    when: "Vendredi 18 · 11:00",
  },
  {
    id: "conference-3",
    kind: "Conférence 3",
    title: "Innovation numérique en Côte d’Ivoire : bilan & perspectives",
    description:
      "Un état des lieux de l’écosystème numérique ivoirien — politiques publiques, initiatives privées, projets structurants — et les secteurs à fort potentiel : fintech, agrotech, edtech, santé digitale. Le rôle de la jeunesse dans cette transformation est au centre.",
    objectives: [
      "Dresser un état des lieux objectif du numérique en Côte d’Ivoire",
      "Identifier les secteurs porteurs pour les jeunes",
      "Comprendre les politiques publiques et leur impact",
      "S’engager dans la transformation numérique nationale",
    ],
    format: "60 min — 45 min de présentation + 15 min de questions",
    when: "Samedi 19 · 14:00",
  },
  {
    id: "conference-debat",
    kind: "Conférence-débat",
    title: "Souveraineté numérique africaine : défis et opportunités",
    description: null,
    when: "Samedi 19 · 17:00",
  },
];

export const PANELS: readonly Talk[] = [
  {
    id: "panel-1",
    kind: "Panel 1",
    title: "Diversité & inclusion dans la tech : où en est-on en Afrique ?",
    description:
      "La représentation des femmes et des jeunes issus de milieux défavorisés dans la tech africaine, des initiatives inspirantes et des pistes concrètes pour un écosystème plus inclusif et équitable.",
    format: "Présentation courte, débat modéré, questions du public",
    when: "Vendredi 18 · 15:10",
  },
  {
    id: "panel-2",
    kind: "Panel 2",
    title: "Cybersécurité & Données : enjeux et bonnes pratiques",
    description: null,
    when: "Vendredi 18 · 16:00",
  },
  {
    id: "panel-3",
    kind: "Panel 3",
    title: "L’avenir de l’écosystème technologique africain",
    description: null,
    when: "Samedi 19 · 16:00",
  },
];

export interface Formation {
  id: string;
  code: string;
  title: string;
  /** Optional: only shown when given. */
  tagline?: string;
  description?: string;
  goals: readonly string[];
}

export const FORMATIONS_INFO = {
  when: "Samedi 19 · dès 09:15",
  intro:
    "Cinq modules intensifs de trois heures, en parallèle. Accessibles aux débutants comme aux initiés, chacun donne lieu à une attestation de participation. Inscription sur place, places limitées.",
} as const;

export const FORMATIONS: readonly Formation[] = [
  {
    id: "form-1",
    code: "Form 1",
    title: "Développement logiciel & création d’API REST",
    goals: [
      "Bases du développement web et JavaScript",
      "Création d’une API REST avec Node.js",
      "Tests des routes avec Postman",
      "Git & GitHub : gestion de code et collaboration",
    ],
  },
  {
    id: "form-2",
    code: "Form 2",
    title: "Intelligence artificielle & Data Science",
    goals: [
      "Découverte de ChatGPT, Claude et des outils IA",
      "Techniques de prompting et cas d’usage professionnels",
      "Analyse et nettoyage de données avec Pandas",
      "Visualisation des données avec Matplotlib",
    ],
  },
  {
    id: "form-3",
    code: "Form 3",
    title: "Cybersécurité, Cloud Computing & DevOps",
    goals: [
      "Détection du phishing et analyse des menaces",
      "Protection des comptes, des systèmes et des données",
      "Fondamentaux du cloud et découverte de Docker",
      "Déploiement sécurisé et bonnes pratiques DevOps",
    ],
  },
  {
    id: "form-4",
    code: "Form 4",
    title: "IoT & Systèmes intelligents connectés",
    goals: [
      "Découverte d’Arduino et ESP32",
      "Connexion et exploitation de capteurs",
      "Transmission de données via MQTT ou HTTP",
      "Réalisation d’un prototype d’objet connecté",
    ],
  },
  {
    id: "form-5",
    code: "Form 5",
    title: "Personal Branding & Community Management",
    goals: [
      "Optimisation du profil LinkedIn et du portfolio",
      "Construction d’une identité professionnelle numérique",
      "Stratégie de contenu avec l’IA",
      "Développement de la visibilité et mesure de l’engagement",
    ],
  },
];