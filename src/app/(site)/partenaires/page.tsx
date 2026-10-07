import type { Metadata } from "next";
import Image from "next/image";
import { EVENT, whatsappUrl } from "@/config/event";
import type { Partner } from "@/config/partners";
import { PageIntro } from "@/components/layout/PageIntro";
import { Marquee } from "@/components/motion/Marquee";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { Tilt } from "@/components/motion/Tilt";
import { RotatingWord } from "@/components/partners/RotatingWord";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getPartners } from "@/server/repositories/content";

export const metadata: Metadata = {
  title: "Partenaires",
  description: "Les partenaires de G-TECH SUMMIT 2026 et comment soutenir l’événement.",
};

/** Optical balance: very wide logos get less height than square ones. */
const logoHeight = (p: Partner, base: number) => Math.round(base / Math.pow(p.logo.width / p.logo.height, 0.35));

function PartnerLogo({ partner, base, className = "" }: { partner: Partner; base: number; className?: string }) {
  return (
    <Image
      src={partner.logo.src}
      alt={partner.name}
      width={partner.logo.width}
      height={partner.logo.height}
      style={{ height: logoHeight(partner, base), width: "auto" }}
      className={`max-w-full object-contain ${className}`}
    />
  );
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <PageIntro
        label="Partenaires"
        title="Ils nous accompagnent"
        lines={["Ils nous", <Accent key="a">accompagnent</Accent>]}
        lead="G-TECH SUMMIT se construit avec des structures qui partagent l’envie de rendre la tech accessible à tous en Afrique."
        actions={
          <>
            <ButtonLink href="#devenir" arrow>
              Devenir partenaire
            </ButtonLink>
            <ButtonLink href="#logos" variant="link" arrow>
              Nos partenaires
            </ButtonLink>
          </>
        }
      />

      {/* ── Logo wall ────────────────────────────────────────────────── */}
      <Section tone="paper" id="logos" aria-labelledby="titre-logos" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="01">Avec nous</SectionLabel>
          <RevealText inView id="titre-logos" lines={["Nos partenaires"]} className="type-headline text-title mt-8" />

          <SpotlightGroup>
            <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
              {partners.map((p) => (
                <RevealItem as="li" effect="flip" key={p.name}>
                  <Tilt max={6}>
                    <div className="panel card-interactive spotlight flex aspect-[4/3] flex-col items-center justify-center gap-6 bg-paper! p-6">
                      <PartnerLogo partner={p} base={90} />
                      <span className="type-meta text-muted">{p.name}</span>
                    </div>
                  </Tilt>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
        <Marquee
          duration={26}
          className="mt-16 border-y border-rule py-5"
          items={partners.map((p) => (
            <span key={p.name} className="type-condensed flex items-center gap-8 px-8 text-title text-ink/15">
              {p.name} <span className="size-3 rotate-45 bg-signal" />
            </span>
          ))}
        />
      </Section>

      {/* ── Become a partner ─────────────────────────────────────────── */}
      <Section tone="ink" id="devenir" aria-labelledby="titre-devenir" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="02">Devenir partenaire</SectionLabel>
          <h2 id="titre-devenir" className="type-headline mt-8 text-display">
            Vous êtes{" "}
            <RotatingWord
              className="text-signal"
              words={["une entreprise ?", "une institution ?", "un média ?", "une communauté ?"]}
            />
          </h2>
          <div className="grid-12 mt-12 gap-y-8">
            <p className="col-span-4 text-lead text-muted md:col-span-6 lg:col-span-6">
              Contactez l’équipe {EVENT.organiser.name} pour échanger sur les possibilités de partenariat et soutenir
              G-TECH SUMMIT.
            </p>
            <div className="col-span-4 flex flex-wrap items-center gap-x-6 gap-y-4 self-end md:col-span-8 lg:col-span-5 lg:col-start-8 lg:justify-end">
              <ButtonLink href={`mailto:${EVENT.contact.email}?subject=Partenariat%20G-TECH%20SUMMIT%202026`} arrow>
                Écrire à l’équipe
              </ButtonLink>
              <ButtonLink href={whatsappUrl} variant="link" arrow>
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
