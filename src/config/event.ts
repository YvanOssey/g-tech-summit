/**
 * Validated event facts. Only information confirmed by the organisers lives here.
 * Anything still undecided (venue, team size, deadline, quota…) will be stored as
 * admin-editable settings and rendered with the `Pending` component — never guessed.
 */
export const EVENT = {
  name: "G-TECH SUMMIT",
  edition: "1ʳᵉ édition",
  year: 2026,
  /** Theme of this edition (official programme, 2026-10-27). */
  theme: "Technologie • Innovation • Intelligence artificielle",
  /** What the event is, in one factual sentence. No hackathon this edition (next one). */
  summary: "Conférences, panels, formations, ateliers et démonstrations autour de la technologie, de l’innovation et de l’intelligence artificielle, organisés par Ghostech.",
  /** Doors open on day 1 (programme: accueil 08:00), Abidjan time = UTC+0. */
  doorsOpen: { iso: "2026-12-18T08:00:00Z", label: "le 18 déc. à 08:00" },
  city: "Abidjan",
  country: "Côte d’Ivoire",
  days: [
    { iso: "2026-12-18", label: "Vendredi 18 décembre 2026", short: "Ven. 18.12" },
    { iso: "2026-12-19", label: "Samedi 19 décembre 2026", short: "Sam. 19.12" },
  ],
  organiser: {
    name: "Ghostech",
    motto: "Construire. Impacter. Conquérir.",
    tagline: "La tech, pour tous, en Afrique.",
  },
  contact: {
    email: "ghostech92@gmail.com",
    phoneDisplay: "+225 05 56 13 02 45",
    phoneE164: "+2250556130245",
    whatsapp: true,
  },
} as const;

export const whatsappUrl = `https://wa.me/${EVENT.contact.phoneE164.replace("+", "")}`;
