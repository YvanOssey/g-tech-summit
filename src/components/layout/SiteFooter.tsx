import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { LEGAL_NAV, MAIN_NAV, TICKETING } from "@/config/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-paper pb-28 lg:pb-10">
      <div className="shell grid-12 gap-y-10 pt-10">
        <div className="col-span-4 md:col-span-3">
          <GhostechLogo width={112} />
          <p className="type-meta mt-4 text-grey-500">
            Organisé par {EVENT.organiser.name}
            <br />
            {EVENT.organiser.motto}
          </p>
        </div>

        <nav aria-label="Pages" className="col-span-2 md:col-span-2 lg:col-start-6">
          <p className="type-meta text-grey-500">Site</p>
          <ul className="mt-3 space-y-2">
            {[...MAIN_NAV, TICKETING].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline hover:decoration-signal hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-3 lg:col-span-3">
          <p className="type-meta text-grey-500">Contact</p>
          <ul className="mt-3 space-y-2 break-words">
            <li>
              <a href={`mailto:${EVENT.contact.email}`} className="hover:underline hover:decoration-signal hover:underline-offset-4">
                {EVENT.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${EVENT.contact.phoneE164}`} className="hover:underline hover:decoration-signal hover:underline-offset-4">
                {EVENT.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappUrl} className="hover:underline hover:decoration-signal hover:underline-offset-4">
                Écrire sur WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <div className="type-meta flex flex-col gap-4 border-t border-grey-200 pt-5 text-grey-500 md:flex-row md:items-center md:justify-between">
            <p>
              {EVENT.name} {EVENT.year} · 18—19.12.2026 · {EVENT.city}, {EVENT.country}
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-ink">
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
