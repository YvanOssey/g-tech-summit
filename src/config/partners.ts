/**
 * Partners confirmed by the organisers (logos supplied in /images; spellings confirmed, incl. Neddigi).
 * Logos are shown in their original colours — partner brands are never recoloured.
 */
export interface Partner {
  name: string;
  logo: { src: string; width: number; height: number };
}

export const PARTNERS: readonly Partner[] = [
  { name: "Impact Hub Abidjan", logo: { src: "/partners/impact-hub.png", width: 317, height: 316 } },
  { name: "AIESEC", logo: { src: "/partners/aiesec.png", width: 640, height: 91 } },
  { name: "H-Electro", logo: { src: "/partners/h-electro.png", width: 488, height: 488 } },
  { name: "Neddigi", logo: { src: "/partners/neddigi.png", width: 640, height: 348 } },
  { name: "DigiFemmes Côte d’Ivoire", logo: { src: "/partners/digifemmes-ci.png", width: 640, height: 183 } },
  { name: "IT-LeadHER", logo: { src: "/partners/it-leadher.png", width: 640, height: 607 } },
  { name: "Les Gos Créatives", logo: { src: "/partners/les-gos-creatives.png", width: 640, height: 640 } },
  { name: "IT Foundation", logo: { src: "/partners/it-foundation.png", width: 640, height: 143 } },
];
