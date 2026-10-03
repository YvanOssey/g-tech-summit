import type { Metadata } from "next";
import Image from "next/image";
import { EVENT, whatsappUrl } from "@/config/event";
import { PARTNERS } from "@/config/partners";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { SectionIndex } from "@/components/ui/SectionIndex";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Les partenaires de G-TECH SUMMER 2026 et comment soutenir l’événement.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partenaires"
        lines={["Ils sont", "à nos côtés"]}
        lead="G-TECH SUMMER se construit avec des structures qui partagent l’envie de rendre la tech accessible à tous en Afrique."
      />

      <section className="shell" aria-label="Partenaires">
        <ul className="grid grid-cols-2 gap-px bg-grey-200 ring-1 ring-grey-200 md:grid-cols-4">
          {PARTNERS.map((p) => (
            <li key={p.name} className="flex flex-col bg-paper">
              <div className="flex aspect-[4/3] items-center justify-center p-8">
                <Image src={p.logo.src} alt="" width={p.logo.width} height={p.logo.height} className="max-h-16 w-auto object-contain" />
              </div>
              <p className="type-meta border-t border-grey-200 px-4 py-3">{p.name}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-24 mb-28 md:mt-32 md:mb-36" aria-labelledby="devenir">
        <SectionIndex index="01" label="Devenir partenaire" />
        <div className="grid-12 mt-10 gap-y-8">
          <h2 id="devenir" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-6">
            Soutenir G-TECH SUMMER
          </h2>
          <div className="col-span-4 space-y-6 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-grey-500">
              Entreprises, institutions, médias, communautés : contactez l’équipe {EVENT.organiser.name} pour échanger sur
              les possibilités de partenariat.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${EVENT.contact.email}?subject=Partenariat%20G-TECH%20SUMMER%202026`} arrow>
                Écrire à l’équipe
              </ButtonLink>
              <ButtonLink href={whatsappUrl} variant="secondary">
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
