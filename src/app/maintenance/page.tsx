import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { EVENT, whatsappUrl } from "@/config/event";
import { isMaintenance } from "@/lib/maintenance";

export const metadata: Metadata = {
  title: "Bientôt de retour",
  robots: { index: false, follow: false },
};

// Read at every request: the page must follow MAINTENANCE_MODE, and never be cached.
export const dynamic = "force-dynamic";

/**
 * Shown instead of every public page while MAINTENANCE_MODE is on (src/proxy.ts).
 * The back office stays available. Outside maintenance, back to the home page.
 */
export default function MaintenancePage() {
  if (!isMaintenance()) redirect("/");

  return (
    <main className="theme-ink flex min-h-dvh flex-col bg-canvas text-fg">
      <div className="shell flex flex-1 flex-col justify-between gap-16 py-8 md:py-12">
        <GhostechLogo variant="light" width={120} preload />

        <div className="max-w-3xl">
          <p className="type-meta text-mist">
            {EVENT.edition} · 18—19.12.{EVENT.year} · {EVENT.city}
          </p>
          <h1 className="type-condensed mt-6 text-[clamp(3rem,11vw,9rem)] leading-[0.85]">
            {EVENT.name} <span className="text-signal">{EVENT.year}</span>
          </h1>
          <p className="type-headline mt-10 text-title">Le site revient très vite.</p>
          <p className="mt-5 max-w-[56ch] text-lead text-mist">
            Le site est actuellement en maintenance. Revenez dans quelques jours.
          </p>
        </div>

        <p className="flex flex-wrap gap-x-8 gap-y-3 text-small">
          <a href={`mailto:${EVENT.contact.email}`} className="underline underline-offset-4 hover:text-signal">
            {EVENT.contact.email}
          </a>
          <a href={whatsappUrl} className="underline underline-offset-4 hover:text-signal">
            WhatsApp {EVENT.contact.phoneDisplay}
          </a>
        </p>
      </div>
    </main>
  );
}
