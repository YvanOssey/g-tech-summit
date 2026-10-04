/**
 * Editorial images.
 *
 * The current files are TEST VISUALS (illustrations generated for the mock-up,
 * flagged `placeholder: true` and badged "Visuel test" on the site). They must be
 * replaced by real photos of Ghostech / G-TECH events — with usage rights and the
 * consent of recognisable people — before launch: drop the file in /public/photos,
 * update the slot and remove `placeholder`.
 * A slot set to `null` makes its section fall back to a typographic composition.
 */
export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, keeps the subject visible on narrow crops. */
  focus?: string;
  /** Test visual: shows a "Visuel test" badge. */
  placeholder?: boolean;
  credit?: string;
}

export const PHOTOS: { hero: Photo | null; hackathon: Photo | null; atelier: Photo | null } = {
  hero: {
    src: "/photos/hero-test.webp",
    alt: "Visuel test : salle de conférence, scène et public",
    width: 2400,
    height: 1350,
    focus: "72% 50%",
    placeholder: true,
  },
  hackathon: {
    src: "/photos/hackathon-test.webp",
    alt: "Visuel test : salle de hackathon, équipes devant leurs ordinateurs",
    width: 1800,
    height: 1350,
    focus: "50% 60%",
    placeholder: true,
  },
  atelier: {
    src: "/photos/atelier-test.webp",
    alt: "Visuel test : atelier pratique, un intervenant présente du code",
    width: 1800,
    height: 1350,
    focus: "55% 50%",
    placeholder: true,
  },
};
