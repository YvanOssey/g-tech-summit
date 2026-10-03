/**
 * Partners confirmed by the organisers (logos supplied in /images).
 * Logos are shown in their original colours — partner brands are never recoloured.
 */
export interface Partner {
  name: string;
  logo: { src: string; width: number; height: number };
}

export const PARTNERS: readonly Partner[] = [
  { name: "AfroLink", logo: { src: "/partners/afrolink.png", width: 640, height: 94 } },
  { name: "AIESEC", logo: { src: "/partners/aiesec.png", width: 640, height: 91 } },
  { name: "H-Electro", logo: { src: "/partners/h-electro.png", width: 488, height: 488 } },
  { name: "Neddigi", logo: { src: "/partners/neddigi.png", width: 640, height: 348 } },
];
