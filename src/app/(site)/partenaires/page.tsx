import type { Metadata } from "next";
import { EVENT, whatsappUrl } from "@/config/event";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { PageHero } from "@/components/layout/PageHero";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Les partenaires de G-TECH SUMMER 2026 et comment soutenir l’événement.",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        label="Partenaires"
        title="Ils nous accompagnent"
        lines={["Ils nous", <Accent key="a">accompagnent</Accent>]}
        lead="G-TECH SUMMER se construit avec des structures qui partagent l’envie de rendre la tech accessible à tous en Afrique."
      />

      <Section tone="paper" aria-label="Partenaires" className="section-compact">
        <div className="shell">
          <div className="panel px-2 sm:px-6">
            <PartnerLogos />
          </div>
        </div>
      </Section>

      <Section tone="stone" aria-labelledby="devenir" className="section-compact">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionLabel>Devenir partenaire</SectionLabel>
            <h2 id="devenir" className="type-headline text-title mt-8">
              Soutenir G-TECH SUMMER
            </h2>
          </div>
          <div className="col-span-4 space-y-6 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-muted">
              Entreprises, institutions, médias, communautés : contactez l’équipe {EVENT.organiser.name} pour échanger sur
              les possibilités de partenariat.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${EVENT.contact.email}?subject=Partenariat%20G-TECH%20SUMMER%202026`} arrow>
                Écrire à l’équipe
              </ButtonLink>
              <ButtonLink href={whatsappUrl} variant="link">
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
