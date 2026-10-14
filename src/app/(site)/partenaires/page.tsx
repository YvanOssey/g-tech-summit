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
  description:
    "Les partenaires de G-TECH SUMMIT 2026 et comment soutenir l’événement.",
};

/**
 * The logo fills a fixed box, so every card keeps the same size and shape
 * whatever the logo. Optical balance: very wide logos use less of the box
 * height than square ones.
 */
function PartnerLogo({ partner }: { partner: Partner }) {
  const scale = Math.min(
    1,
    1.6 / Math.pow(partner.logo.width / partner.logo.height, 0.35),
  );
  return (
    <div
      className="relative w-4/5 lg:w-3/5"
      style={{ height: `${Math.round(scale * 100)}%` }}
    >
      <Image
        src={partner.logo.src}
        alt={partner.name}
        fill
        sizes="(min-width: 1024px) 400px, 45vw"
        className="object-contain"
      />
    </div>
  );
}

/** Free stands offered at the event. Requests go to the organisers by e-mail. */
const STANDS = [
  {
    name: "Stand startup",
    text: "Pour les startups qui veulent présenter leur solution aux visiteurs, aux professionnels et aux recruteurs.",
    subject: "Stand%20startup%20G-TECH%20SUMMIT%202026",
  },
  {
    name: "Stand entreprise",
    text: "Pour les entreprises qui veulent présenter leurs produits, leurs services et leurs métiers aux visiteurs et aux étudiants.",
    subject: "Stand%20entreprise%20G-TECH%20SUMMIT%202026",
  },
] as const;

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
      <Section
        tone="paper"
        id="logos"
        aria-labelledby="titre-logos"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="01">Avec nous</SectionLabel>
          <RevealText
            inView
            id="titre-logos"
            lines={["Nos partenaires"]}
            className="type-headline text-title mt-8"
          />

          <SpotlightGroup>
            <RevealGroup
              as="ul"
              className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 lg:gap-4"
            >
              {partners.map((p) => (
                <RevealItem as="li" effect="flip" key={p.name}>
                  <Tilt max={6}>
                    <div className="panel card-interactive spotlight grid aspect-[4/3] lg:aspect-[2/1] grid-rows-[minmax(0,1fr)_auto] place-items-center gap-3 overflow-hidden bg-paper! p-4 sm:gap-5 sm:p-8">
                      <div className="flex size-full items-center justify-center">
                        <PartnerLogo partner={p} />
                      </div>
                      <span className="type-meta line-clamp-2 min-h-[2lh] text-center text-muted">
                        {p.name}
                      </span>
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
            <span
              key={p.name}
              className="type-condensed flex items-center gap-8 px-8 text-title text-ink/15"
            >
              {p.name} <span className="size-3 rotate-45 bg-signal" />
            </span>
          ))}
        />
      </Section>

      {/* ── Free stands ──────────────────────────────────────────────── */}
      <Section
        tone="stone"
        id="stands"
        aria-labelledby="titre-stands"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="02">Stands</SectionLabel>
          <RevealText
            inView
            id="titre-stands"
            lines={["Stands gratuits"]}
            className="type-headline text-title mt-8"
          />
          <p className="mt-6 max-w-xl text-muted">
            Startups et entreprises : exposez à G-TECH SUMMIT sans frais.
            Écrivez à l’équipe pour réserver votre stand.
          </p>

          <SpotlightGroup>
            <RevealGroup
              as="ul"
              className="mt-12 grid gap-3 md:grid-cols-2 lg:gap-4"
            >
              {STANDS.map((s) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={s.name}
                  className="panel spotlight flex min-h-64 flex-col p-6 sm:p-8"
                >
                  <span className="type-label">Gratuit</span>
                  <h3 className="type-headline mt-6 text-heading leading-tight">
                    {s.name}
                  </h3>
                  <p className="mt-4 text-muted">{s.text}</p>
                  <div className="mt-auto pt-8">
                    <ButtonLink
                      href={`mailto:${EVENT.contact.email}?subject=${s.subject}`}
                      arrow
                    >
                      Demander un stand
                    </ButtonLink>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Become a partner ─────────────────────────────────────────── */}
      <Section
        tone="ink"
        id="devenir"
        aria-labelledby="titre-devenir"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="03">Devenir partenaire</SectionLabel>
          <h2 id="titre-devenir" className="type-headline mt-8 text-display">
            Vous êtes{" "}
            <RotatingWord
              className="text-signal"
              words={[
                "une entreprise ?",
                "une institution ?",
                "un média ?",
                "une communauté ?",
              ]}
            />
          </h2>
          <div className="grid-12 mt-12 gap-y-8">
            <p className="col-span-4 text-lead text-muted md:col-span-6 lg:col-span-6">
              Contactez l’équipe {EVENT.organiser.name} pour échanger sur les
              possibilités de partenariat et soutenir G-TECH SUMMIT.
            </p>
            <div className="col-span-4 flex flex-wrap items-center gap-x-6 gap-y-4 self-end md:col-span-8 lg:col-span-5 lg:col-start-8 lg:justify-end">
              <ButtonLink
                href={`mailto:${EVENT.contact.email}?subject=Partenariat%20G-TECH%20SUMMIT%202026`}
                arrow
              >
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
