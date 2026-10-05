import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { LEGAL_NAV, MAIN_NAV, TICKETING } from "@/config/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";

const link =
  "inline-block underline decoration-transparent underline-offset-4 transition-[color,text-decoration-color] duration-(--duration-micro) ease-out-quart hover:text-signal hover:decoration-signal";

/**
 * Footer in a row: organiser on the left, the two link columns in the middle;
 * then the centred poster signature and the legal line across the width.
 */
export function SiteFooter() {
  return (
    <footer className="theme-ink overflow-hidden border-t border-rule bg-canvas pb-28 text-fg lg:pb-8">
      <div className="shell pt-12 md:pt-14">
        <div className="grid-12 gap-y-10">
          {/* Organiser — left */}
          <div className="col-span-4 md:col-span-3 lg:col-span-4">
            <GhostechLogo width={104} variant="light" />
            <p className="mt-4 max-w-xs text-small text-muted">
              {EVENT.name} {EVENT.year} est organisé par {EVENT.organiser.name}, {EVENT.organiser.description.charAt(0).toLowerCase() + EVENT.organiser.description.slice(1)}.
            </p>
          </div>

          {/* Links — middle */}
          <nav aria-label="Pages" className="col-span-2 md:col-span-2 md:col-start-5 lg:col-span-2 lg:col-start-5">
            <p className="type-label">Le site</p>
            <ul className="mt-4 space-y-2 text-small sm:text-body">
              {[...MAIN_NAV, TICKETING].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <p className="type-label">Contact</p>
            <ul className="mt-4 space-y-2 text-small break-words sm:text-body">
              <li>
                <a href={`mailto:${EVENT.contact.email}`} className={link}>
                  {EVENT.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${EVENT.contact.phoneE164}`} className={link}>
                  {EVENT.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappUrl} className={link}>
                  Écrire sur WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Poster signature — centred */}
        <p
          aria-hidden="true"
          className="type-condensed mt-12 text-center text-[clamp(2.5rem,11vw,10rem)] leading-[0.8] tracking-tight whitespace-nowrap md:mt-16"
        >
          G-TECH <span className="text-signal">SUMMER</span>
        </p>

        <div className="type-meta mt-8 flex flex-col gap-3 border-t border-rule pt-6 text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {EVENT.name} {EVENT.year} · 18—19.12.2026 · {EVENT.city}, {EVENT.country}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
