/**
 * Editorial images.
 *
 * - `hero` and `auditorium` are atmosphere visuals supplied by Ghostech. They are
 *   not photos of G-TECH SUMMER: never caption them as the event or its venue.
 * - A slot set to `null` makes its section rely on typography alone — every
 *   section must hold without an image.
 * - The former illustrated test visuals (public/photos/*-test.webp) are no longer used.
 */
export interface Photo {
  src: string;
  /** Empty string when the image is purely atmospheric (its content is said in text). */
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, keeps the subject visible on narrow crops. */
  focus?: string;
  credit?: string;
}

export const PHOTOS: { hero: Photo | null; auditorium: Photo | null; hackathon: Photo | null; atelier: Photo | null } = {
  hero: {
    src: "/photos/hero.webp",
    alt: "",
    width: 2000,
    height: 857,
  },
  auditorium: {
    src: "/photos/auditorium.webp",
    alt: "",
    width: 2000,
    height: 1125,
  },
  hackathon: null,
  atelier: null,
};
