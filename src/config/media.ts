/**
 * Editorial images, all supplied by the organisers.
 *
 * - `hero` is an atmosphere visual: it is not a photo of G-TECH SUMMIT, never
 *   caption it as the event or its venue.
 * - `poster` carries text, so it is never cropped.
 * - A slot set to `null` makes its section rely on typography alone — every
 *   section must hold without an image.
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

export const PHOTOS: { hero: Photo | null; poster: Photo | null } = {
  /* Homepage hero background: VR headset, Ghostech "G", outline of Africa. */
  hero: {
    src: "/photos/hero-vr.webp",
    alt: "",
    width: 1280,
    height: 974,
  },
  /* Event poster (L'événement section). */
  poster: {
    src: "/photos/affiche-gtech.webp",
    alt: "Affiche de l’événement par Ghostech : 18 & 19 décembre 2026, « La tech, pour tous, en Afrique ».",
    width: 1430,
    height: 1089,
  },
};
