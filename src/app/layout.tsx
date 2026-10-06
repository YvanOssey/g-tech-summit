import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { EVENT } from "@/config/event";
import { SITE_URL } from "@/config/site";
import { MotionProvider } from "@/components/motion/MotionProvider";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${EVENT.name} ${EVENT.year} — 18 & 19 décembre, ${EVENT.city}`,
    template: `%s — ${EVENT.name} ${EVENT.year}`,
  },
  description: `${EVENT.name} ${EVENT.year}, à ${EVENT.city} les 18 et 19 décembre 2026. ${EVENT.summary}`,
  openGraph: { type: "website", locale: "fr_CI", siteName: `${EVENT.name} ${EVENT.year}` },
};

/** Elements that start hidden for an entrance animation carry `data-reveal`. */
const NO_JS_CSS = "[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}";

export const viewport: Viewport = {
  themeColor: "#171717",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The intro script (IntroCurtain) adds the class "intro-seen" to <html> before hydration.
  return (
    <html lang="fr" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Without JavaScript, entrance animations never run: show their content as is. */}
        <noscript>
          <style>{NO_JS_CSS}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
