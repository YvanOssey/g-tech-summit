/**
 * Validated event facts. Only information confirmed by the organisers lives here.
 * Anything still undecided (venue, team size, deadline, quota…) will be stored as
 * admin-editable settings and rendered with the `Pending` component — never guessed.
 */
export const EVENT = {
  name: "G-TECH SUMMER",
  edition: "1ʳᵉ édition",
  year: 2026,
  theme: "Digitalisation & Innovation pour l’Afrique d’aujourd’hui et de demain",
  city: "Abidjan",
  country: "Côte d’Ivoire",
  days: [
    { iso: "2026-12-18", label: "Vendredi 18 décembre 2026", short: "Ven. 18.12" },
    { iso: "2026-12-19", label: "Samedi 19 décembre 2026", short: "Sam. 19.12" },
  ],
  organiser: {
    name: "Ghostech",
    description: "Communauté tech fondée à l’Institut Universitaire d’Abidjan",
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
