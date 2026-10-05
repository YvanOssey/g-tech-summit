import type { Metadata } from "next";
import { EVENT, whatsappUrl } from "@/config/event";
import { getEventSettings } from "@/config/settings";
import { FAQ } from "@/content/faq";
import { HACKATHON } from "@/content/hackathon";
import { FaqSearch } from "@/components/infos/FaqSearch";
import { PageIntro } from "@/components/layout/PageIntro";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, ChatBubble, Clock, Mail, Phone, TicketIcon } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Infos pratiques",
  description: "Dates, lieu, horaires, tarifs, contact et questions fréquentes de G-TECH SUMMER 2026 à Abidjan.",
};

/** The day itself, in three steps — validated facts only. */
const JOURNEY = [
  {
    icon: TicketIcon,
    k: "Votre billet",
    v: "Présentez le QR code de votre billet, sur téléphone ou imprimé, à l’accueil. Il est nominatif et validé une fois par jour et par accès.",
  },
  {
    icon: Clock,
    k: "Accueil dès 08:00",
    v: "Les deux jours. Le samedi 19, inscription sur place aux formations express : 25 à 30 participants par module.",
  },
  {
    icon: ArrowRight,
    k: "Finale du hackathon",
    v: `Pitch et présentations finales le samedi 19 décembre à ${HACKATHON.finale.pitch.time}, remise des prix à ${HACKATHON.finale.awards.time}.`,
  },
] as const;

export default async function PracticalPage() {
  const { venue } = await getEventSettings();

  return (
    <>
      <PageIntro
        label="Infos pratiques"
        title="Tout ce qu’il faut savoir avant de venir"
        lines={["Tout ce qu’il faut", <span key="s">savoir <Accent>avant de venir</Accent></span>]}
        lead="Les informations encore en préparation apparaîtront ici dès qu’elles seront confirmées."
        actions={
          <>
            <ButtonLink href="#faq" arrow>
              Questions fréquentes
            </ButtonLink>
            <ButtonLink href="#contact" variant="link" arrow>
              Contact
            </ButtonLink>
          </>
        }
      />

      {/* ── The day itself ───────────────────────────────────────────── */}
      <Section tone="paper" aria-labelledby="sur-place" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="01">Sur place</SectionLabel>
          <RevealText
            inView
            id="sur-place"
            label="Le jour J, en trois temps."
            lines={["Le jour J,", <span key="t">en trois <Accent>temps</Accent>.</span>]}
            className="type-headline text-title mt-8"
          />

          <RevealGroup as="ol" className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-(--gutter)">
            {/* dashed path linking the steps */}
            <span aria-hidden="true" className="absolute top-7 right-[16%] left-[16%] hidden border-t-2 border-dashed border-signal/60 md:block" />
            {JOURNEY.map(({ icon: Icon, k, v }, i) => (
              <RevealItem as="li" key={k} className="relative flex flex-col items-start md:items-center md:text-center">
                <span className="relative flex size-14 items-center justify-center rounded-pill bg-signal text-ink ring-8 ring-paper">
                  <Icon className="size-6" />
                </span>
                <span className="type-meta mt-6 text-muted">Étape {String(i + 1).padStart(2, "0")}</span>
                <h3 className="type-headline mt-2 text-heading">{k}</h3>
                <p className="mt-3 max-w-sm text-muted">{v}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── FAQ with search ─────────────────────────────────────────── */}
      <Section tone="stone" id="faq" aria-labelledby="titre-faq" className="sheet section-standard">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <SectionLabel index="02">Questions fréquentes</SectionLabel>
              <RevealText inView id="titre-faq" lines={["FAQ"]} className="type-headline text-display mt-8" />
              <p className="mt-6 max-w-xs text-muted">Tapez un mot-clé : la liste se filtre au fur et à mesure.</p>
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <FaqSearch items={FAQ} />
          </div>
        </div>
      </Section>

      {/* ── Contact tiles ───────────────────────────────────────────── */}
      <Section tone="ink" id="contact" aria-labelledby="titre-contact" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="03">Contact</SectionLabel>
          <RevealText
            inView
            id="titre-contact"
            label="Une question ? Écrivez-nous."
            lines={[<span key="q">Une <Accent>question</Accent> ?</span>, "Écrivez-nous."]}
            className="type-headline text-title mt-8"
          />
          <SpotlightGroup>
            <RevealGroup as="ul" className="mt-12 grid gap-3 md:grid-cols-3 lg:gap-4">
              {[
                { icon: Mail, k: "E-mail", v: EVENT.contact.email, href: `mailto:${EVENT.contact.email}` },
                { icon: Phone, k: "Téléphone", v: EVENT.contact.phoneDisplay, href: `tel:${EVENT.contact.phoneE164}` },
                { icon: ChatBubble, k: "WhatsApp", v: EVENT.contact.phoneDisplay, href: whatsappUrl },
              ].map(({ icon: Icon, k, v, href }) => (
                <RevealItem as="li" effect="flip" key={k}>
                  <a
                    href={href}
                    className="group panel spotlight relative flex h-full min-h-52 flex-col justify-between overflow-hidden rounded-object p-6 transition-colors duration-(--duration-component) hover:border-signal sm:p-8"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-(--duration-component) ease-out-quart group-hover:scale-y-100"
                    />
                    <span className="relative flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-pill bg-signal text-ink transition-colors group-hover:bg-ink group-hover:text-signal">
                        <Icon className="size-6" />
                      </span>
                      <span className="arrow-badge group-hover:border-ink! group-hover:bg-ink! group-hover:text-signal!">
                        <ArrowRight className="size-4" />
                      </span>
                    </span>
                    <span className="relative transition-colors group-hover:text-ink">
                      <span className="type-label block group-hover:text-ink">{k}</span>
                      <span className="type-headline mt-2 block text-heading break-all">{v}</span>
                    </span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
          {!venue && (
            <p className="mt-10 text-muted">
              Lieu exact : <Pending label="Lieu exact">à annoncer</Pending>
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
