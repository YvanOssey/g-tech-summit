import type { Metadata } from "next";
import { EVENT, whatsappUrl } from "@/config/event";
import { PASSES, orderTotal } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { FAQ } from "@/content/faq";
import { PageHero } from "@/components/layout/PageHero";
import { Accent } from "@/components/ui/Accent";
import { FaqList } from "@/components/ui/FaqList";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
        label="Infos pratiques"
        title="Tout ce qu’il faut savoir avant de venir"
        lines={["Tout ce qu’il faut", <span key="s">savoir <Accent>avant de venir</Accent></span>]}
        lead="Les informations encore en préparation apparaîtront ici dès qu’elles seront confirmées."
      />

      <Section tone="ink" aria-label="Informations essentielles" className="pb-20 md:pb-24">
        <dl className="shell grid md:grid-cols-2 lg:grid-cols-4">
          <div className="border-t border-rule py-6 md:pr-6">
            <dt className="type-label">Dates</dt>
            <dd className="mt-3 space-y-1">
              {EVENT.days.map((d) => (
                <p key={d.iso} className="font-semibold">
                  {d.label}
                </p>
              ))}
            </dd>
          </div>
          <div className="border-t border-rule py-6 md:border-l md:pl-6">
            <dt className="type-label">Horaires</dt>
            <dd className="mt-3 space-y-1">
              <p className="font-semibold">Accueil à partir de 08:00</p>
              <p className="text-muted">Clôture du jour 1 à 17:30, after-party du jour 2 à 17:30.</p>
            </dd>
          </div>
          <div className="border-t border-rule py-6 md:pr-6 lg:border-l lg:pl-6">
            <dt className="type-label">Lieu</dt>
            <dd className="mt-3 space-y-2">
              {venue ? (
                <>
                  <p className="font-semibold">{venue.name}</p>
                  <p className="text-muted">{venue.address}</p>
                  {venue.mapUrl && (
                    <a href={venue.mapUrl} className="underline underline-offset-4 hover:decoration-mark">
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
          <div className="border-t border-rule py-6 md:border-l md:pl-6">
            <dt className="type-label">Tarifs</dt>
            <dd className="mt-3 space-y-1">
              <p className="flex justify-between gap-4">
                <span>{PASSES.event.name}</span>
                <span className="font-semibold">{formatFCFA(PASSES.event.price)}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span>{PASSES.hackathon.name}</span>
                <span className="font-semibold">{formatFCFA(PASSES.hackathon.price)}</span>
              </p>
              <p className="flex justify-between gap-4 text-muted">
                <span>Les deux</span>
                <span>{formatFCFA(orderTotal(["event", "hackathon"]))}</span>
              </p>
            </dd>
          </div>
        </dl>
      </Section>

      <Section tone="paper" aria-labelledby="sur-place" className="section-compact">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionLabel index="01">Sur place</SectionLabel>
            <h2 id="sur-place" className="type-headline text-title mt-8">
              Le jour J
            </h2>
          </div>
          <ul className="col-span-4 border-b border-rule-strong md:col-span-8 lg:col-span-6 lg:col-start-7">
            {[
              { k: "Votre billet", v: "Présentez le QR code de votre billet (sur téléphone ou imprimé) à l’accueil. Il est nominatif et validé une fois par jour et par accès." },
              { k: "Formations express", v: "Inscription sur place le samedi 19 décembre. Places limitées : 25 à 30 participants par module." },
              { k: "Hackathon", v: "Pitch et présentations finales le samedi 19 décembre à 15:00 en salle principale." },
            ].map((item) => (
              <li key={item.k} className="grid gap-2 border-t border-rule-strong py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <span className="font-semibold">{item.k}</span>
                <span className="text-muted">{item.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="stone" id="faq" aria-labelledby="titre-faq" className="section-compact">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionLabel index="02">Questions fréquentes</SectionLabel>
            <h2 id="titre-faq" className="type-headline text-title mt-8">
              FAQ
            </h2>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <FaqList items={FAQ} />
          </div>
        </div>
      </Section>

      <Section tone="ink" id="contact" aria-labelledby="titre-contact" className="section-compact">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionLabel index="03">Contact</SectionLabel>
            <h2 id="titre-contact" className="type-headline text-title mt-8">
              Une <Accent>question</Accent> ?
            </h2>
          </div>
          <ul className="col-span-4 border-b border-rule md:col-span-8 lg:col-span-7 lg:col-start-6">
            {[
              { k: "E-mail", v: EVENT.contact.email, href: `mailto:${EVENT.contact.email}` },
              { k: "Téléphone", v: EVENT.contact.phoneDisplay, href: `tel:${EVENT.contact.phoneE164}` },
              { k: "WhatsApp", v: EVENT.contact.phoneDisplay, href: whatsappUrl },
            ].map((c) => (
              <li key={c.k} className="border-t border-rule">
                <a href={c.href} className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                  <span className="type-label">{c.k}</span>
                  <span className="text-lead font-semibold break-all underline decoration-transparent underline-offset-[6px] transition-colors group-hover:decoration-mark">
                    {c.v}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
