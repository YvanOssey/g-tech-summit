import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { LEGAL_NAV, MAIN_NAV, TICKETING } from "@/config/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";

const link = "hover:underline hover:decoration-mark hover:underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="theme-ink border-t border-rule bg-canvas pb-28 text-fg lg:pb-10">
      <div className="shell grid-12 gap-y-12 pt-14">
        <div className="col-span-4 md:col-span-3">
          <GhostechLogo width={112} variant="light" />
          <p className="mt-5 text-small text-muted">
            {EVENT.name} {EVENT.year} est organisé par {EVENT.organiser.name}, {EVENT.organiser.description.toLowerCase()}.
          </p>
        </div>

        <nav aria-label="Pages" className="col-span-2 md:col-span-2 lg:col-start-6">
          <p className="type-label">Le site</p>
          <ul className="mt-4 space-y-2">
            {[...MAIN_NAV, TICKETING].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3 lg:col-span-3">
          <p className="type-label">Contact</p>
          <ul className="mt-4 space-y-2 break-words">
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

        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <div className="type-meta flex flex-col gap-4 border-t border-rule pt-6 text-muted md:flex-row md:items-center md:justify-between">
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
      </div>
    </footer>
  );
}
