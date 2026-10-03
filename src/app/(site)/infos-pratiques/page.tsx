import type { Metadata } from "next";
import { EVENT, whatsappUrl } from "@/config/event";
import { PASSES, orderTotal } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { FAQ } from "@/content/faq";
import { PageHero } from "@/components/layout/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { Pending } from "@/components/ui/Pending";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Infos pratiques",
  description: "Dates, lieu, horaires, tarifs, contact et questions fréquentes de G-TECH SUMMER 2026 à Abidjan.",
};

export default async function PracticalPage() {
  const { venue } = await getEventSettings();

  return (
    <>
      <PageHero
        eyebrow="Infos pratiques"
        lines={["Avant de venir"]}
        lead="Tout ce qu’il faut savoir pour préparer votre venue. Les informations encore en préparation apparaîtront ici dès qu’elles seront confirmées."
      />

      <section className="shell" aria-label="Informations essentielles">
        <dl className="grid border-t border-ink md:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-ink py-6 md:pr-6 lg:border-b-0">
            <dt className="type-meta text-grey-500">Dates</dt>
            <dd className="mt-3 space-y-1">
              {EVENT.days.map((d) => (
                <p key={d.iso} className="font-semibold">
                  {d.label}
                </p>
              ))}
            </dd>
          </div>
          <div className="border-b border-ink py-6 md:border-l md:pl-6 lg:border-b-0">
            <dt className="type-meta text-grey-500">Horaires</dt>
            <dd className="mt-3 space-y-1">
              <p className="font-semibold">Accueil à partir de 08:00</p>
              <p className="text-grey-500">Clôture du jour 1 à 17:30, after-party du jour 2 à 17:30.</p>
            </dd>
          </div>
          <div className="border-b border-ink py-6 md:pr-6 lg:border-b-0 lg:border-l lg:pl-6">
            <dt className="type-meta text-grey-500">Lieu</dt>
            <dd className="mt-3 space-y-2">
              {venue ? (
                <>
                  <p className="font-semibold">{venue.name}</p>
                  <p className="text-grey-500">{venue.address}</p>
                  {venue.mapUrl && (
                    <a href={venue.mapUrl} className="underline underline-offset-4 hover:decoration-signal">
                      Voir sur la carte
                    </a>
                  )}
                </>
              ) : (
                <>
                  <p className="font-semibold">{EVENT.city}</p>
                  <Pending label="Lieu exact">Lieu exact à annoncer</Pending>
                </>
              )}
            </dd>
          </div>
          <div className="border-b border-ink py-6 md:border-l md:pl-6 lg:border-b-0">
            <dt className="type-meta text-grey-500">Tarifs</dt>
            <dd className="mt-3 space-y-1">
              <p className="flex justify-between gap-4">
                <span>{PASSES.event.name}</span>
                <span className="font-semibold">{formatFCFA(PASSES.event.price)}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span>{PASSES.hackathon.name}</span>
                <span className="font-semibold">{formatFCFA(PASSES.hackathon.price)}</span>
              </p>
              <p className="flex justify-between gap-4 text-grey-500">
                <span>Les deux</span>
                <span>{formatFCFA(orderTotal(["event", "hackathon"]))}</span>
              </p>
            </dd>
          </div>
        </dl>
      </section>

      <section className="shell mt-24 md:mt-32" aria-labelledby="sur-place">
        <SectionIndex index="01" label="Sur place" />
        <div className="grid-12 mt-10 gap-y-10">
          <h2 id="sur-place" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-5">
            Le jour J
          </h2>
          <ul className="col-span-4 border-b border-ink md:col-span-8 lg:col-span-6 lg:col-start-7">
            {[
              { k: "Votre billet", v: "Présentez le QR code de votre billet (sur téléphone ou imprimé) à l’accueil. Il est nominatif et validé une fois par jour et par accès." },
              { k: "Formations express", v: "Inscription sur place le samedi 19 décembre. Places limitées : 25 à 30 participants par module." },
              { k: "Hackathon", v: "Pitch et présentations finales le samedi 19 décembre à 15:00 en salle principale." },
            ].map((item) => (
              <li key={item.k} className="grid gap-2 border-t border-ink py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <span className="font-semibold">{item.k}</span>
                <span className="text-grey-500">{item.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="shell mt-24 scroll-mt-20 md:mt-32" aria-labelledby="titre-faq">
        <SectionIndex index="02" label="Questions fréquentes" />
        <div className="grid-12 mt-10 gap-y-10">
          <h2 id="titre-faq" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-5">
            FAQ
          </h2>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <FaqList items={FAQ} />
          </div>
        </div>
      </section>

      <section id="contact" className="shell mt-24 mb-28 scroll-mt-20 md:mt-32 md:mb-36" aria-labelledby="titre-contact">
        <SectionIndex index="03" label="Contact" />
        <div className="grid-12 mt-10 gap-y-10">
          <h2 id="titre-contact" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-5">
            Une question ?
          </h2>
          <ul className="col-span-4 border-b border-ink md:col-span-8 lg:col-span-7 lg:col-start-6">
            {[
              { k: "E-mail", v: EVENT.contact.email, href: `mailto:${EVENT.contact.email}` },
              { k: "Téléphone", v: EVENT.contact.phoneDisplay, href: `tel:${EVENT.contact.phoneE164}` },
              { k: "WhatsApp", v: EVENT.contact.phoneDisplay, href: whatsappUrl },
            ].map((c) => (
              <li key={c.k} className="border-t border-ink">
                <a href={c.href} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                  <span className="type-meta text-grey-500">{c.k}</span>
                  <span className="text-[clamp(1.125rem,1rem+0.8vw,1.75rem)] font-semibold break-all underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-signal">
                    {c.v}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
