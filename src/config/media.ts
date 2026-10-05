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

export const PHOTOS: {
  hero: Photo | null;
  auditorium: Photo | null;
  hackathon: Photo | null;
  atelier: Photo | null;
  cyborg: Photo | null;
  poster: Photo | null;
} = {
  /* Homepage hero background (supplied by the organisers): VR headset, Ghostech "G", Africa outline. */
  hero: {
    src: "/photos/hero-vr.webp",
    alt: "",
    width: 1280,
    height: 974,
  },
  auditorium: {
    src: "/photos/auditorium.webp",
    alt: "",
    width: 2000,
    height: 1125,
  },
  /* Same auditorium visual, two crops so the two sections don't repeat the same view. */
  hackathon: {
    src: "/photos/auditorium.webp",
    alt: "",
    width: 2000,
    height: 1125,
    focus: "72% 45%", // stage and screens
  },
  /*
   * Illustration supplied by the organisers (homepage hackathon visual). The
   * cool background lights were neutralised to grey — no blue in the identity.
   */
  cyborg: {
    src: "/photos/hackathon-robot.webp",
    alt: "",
    width: 1200,
    height: 1200,
  },
  /* Event poster supplied by the organisers (L'événement section). It carries text, so it is never cropped. */
  poster: {
    src: "/photos/affiche-gtech.webp",
    alt: "Affiche de l’événement par Ghostech : 18 & 19 décembre 2026, « La tech, pour tous, en Afrique ».",
    width: 1430,
    height: 1089,
  },
  atelier: {
    src: "/photos/auditorium.webp",
    alt: "",
    width: 2000,
    height: 1125,
    focus: "38% 70%", // seating towards the stage
  },
};
