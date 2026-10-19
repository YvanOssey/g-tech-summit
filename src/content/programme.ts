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
  pitch: "Hackathon",
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
      { start: "08:00", type: "accueil", title: "Accueil, enregistrement & visite des stands partenaires", zone: "Hall d’entrée" },
      { start: "09:00", type: "ouverture", title: "Cérémonie d’ouverture officielle", detail: "Mot de bienvenue de Ghostech", zone: "Salle principale" },
      { start: "09:45", type: "conference", title: "Conférence 1", subtitle: "Intelligence artificielle & avenir du travail", detail: "45 min + questions", zone: "Salle principale", ref: "conference-1" },
      { start: "11:00", type: "conference", title: "Conférence 2", subtitle: "Entrepreneuriat tech en Afrique", detail: "45 min + questions", zone: "Salle principale", ref: "conference-2" },
      { start: "12:30", type: "pause", title: "Pause déjeuner & networking libre", detail: "Visite des stands startups", zone: "Hall / Stands" },
      { start: "14:00", end: "15:30", type: "atelier", title: "Ateliers pratiques — session 1", detail: "3 ateliers en parallèle : A, B, C", zone: "Salles A · B · C", ref: "ateliers" },
      { start: "15:30", type: "quiz", title: "Démonstrations live & quiz tech interactif", detail: "Lots à gagner", zone: "Salle principale" },
      { start: "16:30", type: "panel", title: "Panel 1", subtitle: "Diversité & inclusion dans la tech", zone: "Salle principale", ref: "panel-1" },
      { start: "17:30", type: "networking", title: "Clôture du jour 1 & cocktail networking", zone: "Hall" },
    ],
  },
  {
    id: "jour-2",
    index: 2,
    date: "2026-12-19",
    label: "Samedi 19 décembre",
    theme: "Formations, panels, hackathon & clôture",
    slots: [
      { start: "08:00", type: "accueil", title: "Accueil & récap de la première journée", zone: "Hall d’entrée" },
      { start: "09:15", end: "12:15", type: "formation", title: "Formations express", detail: "5 modules en parallèle — attestation de participation", zone: "Salles A · B · C · D · E", ref: "formations" },
      { start: "11:30", type: "pause", title: "Pause déjeuner & visite des stands", detail: "Networking exposants", zone: "Hall / Stands" },
      { start: "12:00", type: "panel", title: "Panel 2", subtitle: "Cybersécurité & Données : enjeux et bonnes pratiques", zone: "Salle principale", ref: "panel-2" },
      { start: "12:45", end: "14:00", type: "atelier", title: "Ateliers pratiques — session 2", detail: "3 ateliers + nouvelles démonstrations live", zone: "Salles A · B · C", ref: "ateliers" },
      { start: "14:00", type: "conference", title: "Conférence 3", subtitle: "Innovation numérique en Côte d’Ivoire : bilan & perspectives", detail: "45 min + questions", zone: "Salle principale", ref: "conference-3" },
      { start: "15:00", type: "pitch", title: "Pitch & présentations finales du hackathon", detail: "Projets finalistes + vote du public", zone: "Salle principale" },
      { start: "17:00", type: "cloture", title: "Annonce des vainqueurs & remise des prix", zone: "Salle principale" },
      { start: "17:30", type: "networking", title: "After-party & cocktail de clôture", zone: "Hall principal" },
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
];

export const PANELS: readonly Talk[] = [
  {
    id: "panel-1",
    kind: "Panel 1",
    title: "Diversité & inclusion dans la tech : où en est-on en Afrique ?",
    description:
      "La représentation des femmes et des jeunes issus de milieux défavorisés dans la tech africaine, des initiatives inspirantes et des pistes concrètes pour un écosystème plus inclusif et équitable.",
    format: "75 min — présentation courte, débat modéré, questions du public",
    when: "Vendredi 18 · 16:30",
  },
  {
    id: "panel-2",
    kind: "Panel 2",
    title: "Cybersécurité & Données : enjeux et bonnes pratiques",
    description: null,
    when: "Samedi 19 · 12:00",
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
  /** Optional: the places are shown only once confirmed by the organisers. */
  seats?: number;
}

export const FORMATIONS_INFO = {
  when: "Samedi 19 · 09:15 — 12:15",
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
    seats: 30,
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
    seats: 30,
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
      "Optimiser son profil LinkedIn et son portfolio",
      "Construire une identité professionnelle numérique",
      "Concevoir une stratégie de contenu avec l’IA",
      "Développer sa visibilité et mesurer l’engagement",
    ],
    seats: 30,
  },
];

export interface Workshop {
  code: string;
  title: string;
  content: string;
}

export const WORKSHOP_SESSIONS: readonly { label: string; when: string; workshops: readonly Workshop[] }[] = [
  {
    label: "Session 1",
    when: "Vendredi 18 · 14:00 — 15:30",
    workshops: [
      { code: "A", title: "Découverte de ChatGPT & des outils IA", content: "Prompting efficace, cas d’usage professionnels, outils gratuits, démo live" },
      { code: "B", title: "Git & GitHub — gérer son code comme un pro", content: "Commandes de base, workflow collaboratif, portfolio GitHub" },
      { code: "C", title: "UI/UX design — créer une maquette en 90 min", content: "Wireframing, prototype interactif Figma, retours utilisateurs" },
    ],
  },
  {
    label: "Session 2",
    when: "Samedi 19 · 12:45 — 14:00",
    workshops: [
      { code: "D", title: "Créer une API REST (Node.js)", content: "Structure REST, routes, tests Postman, déploiement rapide" },
      { code: "E", title: "Data visualisation avec Python", content: "Pandas / Matplotlib : import, nettoyage, visualisation, lecture métier" },
      { code: "F", title: "Cybersécurité — les bons réflexes au quotidien", content: "Mots de passe, phishing, protection des données, outils gratuits" },
    ],
  },
];