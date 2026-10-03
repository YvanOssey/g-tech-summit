import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { EVENT } from "@/config/event";
import "./globals.css";

// Archivo carries both the poster headlines (condensed via the width axis) and the body text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${EVENT.name} ${EVENT.year} — 18 & 19 décembre, ${EVENT.city}`,
    template: `%s — ${EVENT.name} ${EVENT.year}`,
  },
  description: `${EVENT.name} ${EVENT.year}, l’événement tech organisé par ${EVENT.organiser.name} à ${EVENT.city} les 18 et 19 décembre 2026. Thème : ${EVENT.theme}.`,
};

export const viewport: Viewport = {
  themeColor: "#171717",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
