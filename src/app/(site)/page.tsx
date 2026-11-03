import Image from "next/image";
import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { PHOTOS } from "@/config/media";
import { ON_SITE_PLACES, PASSES, passesOnSale } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { EventJsonLd } from "@/components/seo/EventJsonLd";
import { PANELS } from "@/content/programme";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { HomeHero } from "@/components/home/HomeHero";
import { InfoDeck } from "@/components/home/InfoDeck";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { Tilt } from "@/components/motion/Tilt";
import { HorizontalRail } from "@/components/motion/HorizontalRail";
import { DaySchedule } from "@/components/programme/DaySchedule";
import { PassCard } from "@/components/ticket/PassCard";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { FaqList } from "@/components/ui/FaqList";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ArrowRight, ChatBubble } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatFCFA } from "@/lib/format";
import {
  getFaq,
  getPartners,
  getProgramme,
} from "@/server/repositories/content";

const PROFILES = [
  {
    who: "Vous découvrez la tech",
    what: "Bases du développement web, découverte de ChatGPT, Claude et des outils IA, ateliers de découverte.",
  },
  {
    who: "Étudiants",
    what: "Des formations avec attestation, et des rencontres avec des professionnels, des startups et des recruteurs.",
  },
  {
    who: "Développeurs",
    what: "Ateliers Git & GitHub, API REST avec Node.js, data visualisation avec Python.",
  },
  {
    who: "Designers",
    what: "Atelier UI/UX et formation personal branding & portfolio.",
  },
  {
    who: "Entrepreneurs & startups",
    what: "Une conférence sur l’entrepreneuriat tech en Afrique, un espace d’exposition et le Showcase Tech.",
  },
  {
    who: "Professionnels & experts",
    what: "Conférences et panels sur l’IA, l’emploi, l’inclusion et le numérique ivoirien, et un réseau à rencontrer.",
  },
] as const;

const FORMATS = [
  {
    name: "Conférences",
    text: "Intelligence artificielle et avenir du travail, entrepreneuriat tech en Afrique, innovation numérique en Côte d’Ivoire.",
    href: "/programme#conferences",
  },
  {
    name: "Panels",
    text: "Des débats entre intervenants aux profils complémentaires, nourris par les questions du public.",
    href: "/programme#panels",
  },
  {
    name: "Formations express",
    text: "Trois heures de pratique et une attestation de participation : web, IA, design, personal branding.",
    href: "/programme#formations",
  },
  {
    name: "Ateliers pratiques",
    text: "Des sessions courtes et concrètes : outils IA, Git, UI/UX, API REST, data, cybersécurité.",
    href: "/programme#ateliers",
  },
  {
    name: "Stands & démos live",
    text: "Un espace d’exposition, des démonstrations live, un quiz tech et le Showcase Tech des projets et startups.",
    href: "/programme",
  },
  {
    name: "Networking",
    text: "Étudiants, professionnels, startups et recruteurs. Un cocktail clôt chacune des deux journées.",
    href: "/programme",
  },
] as const;

/** Only counts that can be checked on this site. */
const FIGURES = [
  { value: 2, label: "Jours", detail: "18 & 19 décembre" },
  {
    value: FORMATS.length,
    label: "Formats",
    detail: "Conférences, panels, formations…",
  },
  { value: PANELS.length, label: "Panels", detail: "Inclusion, cybersécurité, écosystème" },
  { value: ON_SITE_PLACES, label: "Places", detail: `${PASSES.free.capacity.total} gratuites, puis ${formatFCFA(PASSES.event.price)}` },
] as const;

export default async function HomePage() {
  const [settings, partners, faq, days] = await Promise.all([
    getEventSettings(),
    getPartners(),
    getFaq(),
    getProgramme(),
  ]);
  const posterPhoto = PHOTOS.poster;

  return (
    <>
      <EventJsonLd settings={settings} />
      <HomeHero venue={settings.venue} showUpcoming={settings.showUpcoming} />

      {/* ── Figures ────────────────────────────────────────────────── */}
      <Section
        tone="ink"
        id="chiffres"
        aria-label="L’événement en chiffres"
        className="pt-4 pb-20 md:pb-28"
      >
        <div className="shell">
          <RevealGroup
            as="ul"
            className="grid grid-cols-2 border border-rule lg:grid-cols-4"
          >
            {FIGURES.map((f, i) => (
              <RevealItem
                as="li"
                key={f.label}
                className={`flex flex-col items-center px-4 py-8 text-center md:py-10 ${i % 2 ? "border-l border-rule" : ""} ${
                  i >= 2 ? "border-t border-rule lg:border-t-0 lg:border-l" : ""
                }`}
              >
                <CountUp
                  value={f.value}
                  className="type-condensed text-title leading-none text-signal"
                />
                <span className="type-label mt-3 text-paper">{f.label}</span>
                <span className="mt-1 text-small text-muted">{f.detail}</span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── L'événement — light, editorial ───────────────────────────── */}
      <Section
        tone="paper"
        aria-labelledby="evenement"
        className="sheet section-standard"
      >
        <div className="shell">
          <div className="grid-12 gap-y-14">
            <div className="col-span-4 md:col-span-8 lg:col-span-6">
              <SectionLabel>L’événement</SectionLabel>
              <RevealText
                inView
                id="evenement"
                label="Deux jours pour apprendre, échanger et construire."
                lines={[
                  "Deux jours pour",
                  "apprendre, échanger",
                  <span key="c">
                    et <Accent>construire</Accent>.
                  </span>,
                ]}
                className="type-headline text-title mt-8"
              />
              <Reveal delay={0.15} className="mt-10">
                <p className="text-lead">
                  G-TECH SUMMIT réunit étudiants, développeurs, designers,
                  entrepreneurs et professionnels. Aucun niveau technique n’est
                  requis pour venir.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <ButtonLink href="/programme" arrow>
                    Découvrir le programme
                  </ButtonLink>
                  <ButtonLink href="/infos-pratiques" variant="link" arrow>
                    Infos pratiques
                  </ButtonLink>
                </div>
              </Reveal>
            </div>

            {posterPhoto && (
              <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:self-center">
                <Tilt max={4}>
                  <ImageFrame
                    photo={posterPhoto}
                    aspect="aspect-[1430/1089]"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    parallax={0}
                    className="shadow-[0_24px_60px_-20px_rgb(23_23_23/0.45)]"
                  />
                </Tilt>
                <Reveal delay={0.3} className="mt-5 flex items-center gap-4">
                  <GhostechLogo width={64} className="shrink-0" />
                  <p className="text-small font-semibold text-fg">
                    {EVENT.edition}, organisée par {EVENT.organiser.name}
                  </p>
                </Reveal>
              </div>
            )}
          </div>

          <div className="mt-24 flex flex-wrap items-end justify-between gap-6 lg:mt-32">
            <h3 className="type-headline text-heading">Pour qui ?</h3>
            <p className="max-w-md text-muted">
              Six profils, un même rendez-vous — choisissez votre point
              d’entrée.
            </p>
          </div>
          <SpotlightGroup>
            <RevealGroup
              as="ul"
              className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
            >
              {PROFILES.map((p, i) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={p.who}
                  className="panel card-interactive spotlight flex flex-col p-6 sm:p-8"
                >
                  <span className="card-index type-condensed text-heading leading-none text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="type-headline mt-6 text-heading leading-tight">
                    {p.who}
                  </h4>
                  <p className="mt-3 text-muted">{p.what}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Formats — landscape cards sliding sideways with the scroll ─ */}
      <Section
        tone="ink"
        aria-labelledby="formats"
        className="sheet section-standard"
      >
        <SpotlightGroup>
          <HorizontalRail
            count={FORMATS.length}
            header={
              <div className="shell flex flex-wrap items-end justify-between gap-8">
                <div>
                  <SectionLabel>Au programme</SectionLabel>
                  <RevealText
                    inView
                    id="formats"
                    label="Apprendre, pratiquer, rencontrer."
                    lines={[
                      "Apprendre, pratiquer,",
                      <Accent key="r">rencontrer.</Accent>,
                    ]}
                    className="type-headline text-title mt-8"
                  />
                </div>
                <ButtonLink href="/programme" variant="link" arrow>
                  Programme détaillé
                </ButtonLink>
              </div>
            }
          >
            {FORMATS.map((f, i) => (
              <li
                key={f.name}
                className="w-[min(85vw,22rem)] shrink-0 snap-start md:w-[clamp(30rem,44vw,40rem)]"
              >
                <Link
                  href={f.href}
                  className="group panel spotlight relative grid h-full min-h-56 grid-cols-[auto_1fr] gap-x-6 overflow-hidden p-6 transition-[border-color,translate] duration-(--duration-component) hover:-translate-y-1 hover:border-signal sm:p-8 md:min-h-[min(20rem,42svh)] md:gap-x-10"
                >
                  {/* Index column */}
                  <span className="flex flex-col items-start justify-between border-r border-rule pr-6 md:pr-10">
                    <span className="type-condensed text-display leading-none text-signal/40 transition-colors duration-(--duration-component) group-hover:text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-meta text-muted">
                      /{String(FORMATS.length).padStart(2, "0")}
                    </span>
                  </span>

                  {/* Content column */}
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-start justify-between gap-4">
                      <span className="type-headline block text-heading leading-none transition-colors duration-(--duration-component) group-hover:text-signal md:text-title">
                        {f.name}
                      </span>
                      <span className="arrow-badge max-md:hidden">
                        <ArrowRight className="size-4" />
                      </span>
                    </span>
                    <span className="mt-auto block pt-6 text-muted">
                      {f.text}
                    </span>
                    <span className="type-meta mt-5 inline-flex items-center gap-2 text-paper md:hidden">
                      Voir <ArrowRight className="size-3.5" />
                    </span>
                  </span>

                  {/* Orange rule drawn along the bottom on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-signal transition-transform duration-(--duration-component) ease-out-quart group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </HorizontalRail>
        </SpotlightGroup>
      </Section>

      {/* ── Two days — grey sheet ────────────────────────────────────── */}
      <Section
        tone="stone"
        aria-labelledby="deux-jours"
        className="sheet section-standard"
      >
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel>Deux jours</SectionLabel>
              <RevealText
                inView
                id="deux-jours"
                label="Vendredi 18 et samedi 19 décembre."
                lines={[
                  "Vendredi 18 &",
                  <span key="s">
                    samedi <Accent>19 décembre</Accent>
                  </span>,
                ]}
                className="type-headline text-title mt-8"
              />
            </div>
            <ButtonLink href="/programme" variant="link" arrow>
              Voir le programme complet
            </ButtonLink>
          </div>
          <RevealGroup className="mt-16 grid gap-4 md:grid-cols-2">
            {days.map((d) => (
              <RevealItem
                key={d.id}
                className="panel card-interactive p-6 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="type-label">Jour {d.index}</span>
                    <h3 className="type-headline mt-2 text-heading">
                      {d.label}
                    </h3>
                    <p className="mt-1 text-muted">{d.theme}</p>
                  </div>
                  <span
                    className="card-index type-condensed text-display leading-none text-mark"
                    aria-hidden="true"
                  >
                    {d.date.slice(-2)}
                  </span>
                </div>
                <div className="mt-8">
                  <DaySchedule slots={d.slots} compact />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Billetterie — the orange band ────────────────────────────── */}
      <Section
        tone="signal"
        aria-labelledby="pass"
        className="sheet section-standard"
      >
        <div className="shell">
          <div className="grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <SectionLabel>Billetterie</SectionLabel>
              <RevealText
                inView
                id="pass"
                label="Un pass, un billet nominatif."
                lines={[
                  "Un pass,",
                  <span key="b">
                    un <Accent>billet nominatif</Accent>.
                  </span>,
                ]}
                className="type-headline text-title mt-8"
              />
            </div>
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-4 lg:col-start-9">
              {ON_SITE_PLACES} places pour les deux jours : les{" "}
              {PASSES.free.capacity.total} premières sont gratuites, les{" "}
              {PASSES.event.capacity.total} suivantes à {formatFCFA(PASSES.event.price)}{" "}
              (paiement via Wave, sans frais ajoutés). Billet nominatif envoyé par
              e-mail.
            </p>
          </div>
          <RevealGroup className="mt-14 grid max-w-xl gap-4">
            {passesOnSale(settings.sold).map((id, i) => (
              <RevealItem key={id}>
                <Tilt className="h-full">
                  <Link
                    href={`/billetterie?pass=${id}`}
                    className="group block h-full rounded-object"
                  >
                    <PassCard
                      pass={PASSES[id]}
                      index={i + 1}
                      sold={settings.sold[id]}
                      trackSold={
                        id === "hackathon" ? settings.soldByTrack : undefined
                      }
                    >
                      <span className="flex size-12 items-center justify-center rounded-pill bg-signal text-ink transition-transform duration-(--duration-component) ease-out-quart group-hover:scale-110">
                        <ArrowRight className="size-5 transition-transform duration-(--duration-micro) group-hover:translate-x-0.5" />
                        <span className="sr-only">
                          Choisir le {PASSES[id].name}
                        </span>
                      </span>
                    </PassCard>
                  </Link>
                </Tilt>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Partners — light, endless band ───────────────────────────── */}
      <Section
        tone="paper"
        aria-labelledby="partenaires"
        className="sheet section-standard"
      >
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel>Partenaires</SectionLabel>
            <h2 id="partenaires" className="type-headline text-title mt-8">
              Ils nous accompagnent
            </h2>
          </div>
          <ButtonLink href="/partenaires" variant="link" arrow>
            Devenir partenaire
          </ButtonLink>
        </div>
        <Marquee
          label="Partenaires"
          duration={30}
          className="mt-14 border-y border-rule py-10"
          items={partners.map((p) => (
            <span
              key={p.name}
              className="flex h-20 items-center px-10 md:px-16"
            >
              <Image
                src={p.logo.src}
                alt={p.name}
                width={p.logo.width}
                height={p.logo.height}
                style={{
                  height: Math.round(
                    64 / Math.pow(p.logo.width / p.logo.height, 0.35),
                  ),
                  width: "auto",
                }}
                className="max-w-none object-contain"
              />
            </span>
          ))}
        />
      </Section>

      {/* ── Practical info + FAQ ─────────────────────────────────────── */}
      <Section
        tone="stone"
        aria-labelledby="infos"
        className="sheet pb-(--section-standard)"
      >
        <InfoDeck
          header={
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div>
                <SectionLabel>Infos pratiques</SectionLabel>
                <RevealText
                  inView
                  id="infos"
                  label="Tout ce qu’il faut savoir avant de venir."
                  lines={[
                    "Tout ce qu’il faut savoir",
                    <span key="v">
                      avant de <Accent>venir</Accent>.
                    </span>,
                  ]}
                  className="type-headline text-title mt-8"
                />
              </div>
              <ButtonLink href="/infos-pratiques" variant="link" arrow>
                Toutes les infos
              </ButtonLink>
            </div>
          }
          cards={[
            {
              icon: "pin",
              k: "Lieu",
              v: settings.venue ? settings.venue.name : EVENT.city,
              note:
                settings.venue || !settings.showUpcoming ? (
                  EVENT.country
                ) : (
                  <Pending label="Lieu exact">IMPACT HUB ABIDJAN</Pending>
                ),
            },
            {
              icon: "clock",
              k: "Accueil",
              v: "Dès 08:00",
              note: "Vendredi 18 et samedi 19 décembre",
            },
            {
              icon: "ticket",
              k: "Billet",
              v: "Nominatif, par e-mail",
              note: "Avec un QR code unique, scanné à l’entrée.",
            },
            {
              icon: "wallet",
              k: "Paiement",
              v: "Wave, sans frais ajoutés",
              note: "Paiement sécurisé par Genius Pay.",
            },
          ]}
        />

        <div className="shell">
          {/* FAQ */}
          <div className="grid-12 mt-20 gap-y-10 lg:mt-28">
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h3 className="type-headline text-heading">
                  Questions fréquentes
                </h3>
                <p className="mt-3 text-muted">
                  Les réponses aux questions qu’on nous pose le plus.
                </p>
                <div className="theme-ink mt-8 bg-canvas p-6 text-fg">
                  <span className="flex size-10 items-center justify-center rounded-pill bg-signal text-ink">
                    <ChatBubble className="size-5" />
                  </span>
                  <p className="type-headline mt-5 text-heading">
                    Une autre question ?
                  </p>
                  <p className="mt-2 text-small text-muted">
                    L’équipe Ghostech vous répond.
                  </p>
                  <div className="mt-6 flex flex-col items-start gap-3">
                    <ButtonLink href={whatsappUrl} arrow className="text-small">
                      WhatsApp
                    </ButtonLink>
                    <a
                      href={`mailto:${EVENT.contact.email}`}
                      className="text-small break-all underline decoration-rule-strong underline-offset-4 hover:decoration-mark"
                    >
                      {EVENT.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-8">
              <FaqList items={faq.slice(0, 6)} numbered />
              <div className="mt-8">
                <ButtonLink href="/infos-pratiques#faq" variant="link" arrow>
                  Toutes les questions
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Closing — poster panel ───────────────────────────────────── */}
      <Section
        tone="ink"
        aria-labelledby="cloture"
        className="sheet section-standard"
      >
        <div className="shell">
          <Reveal className="relative isolate overflow-hidden border border-rule px-6 py-14 sm:px-10 md:py-20 lg:px-16">
            <div
              aria-hidden="true"
              className="glow-signal top-0 left-1/4 -z-10 size-[44rem]"
            />
            <div className="grid-12 items-end gap-y-12">
              <div className="col-span-4 md:col-span-8 lg:col-span-7">
                <SectionLabel>{`Rendez-vous à ${EVENT.city}`}</SectionLabel>
                <h2 id="cloture" className="type-condensed mt-8 text-poster">
                  18—19 <span className="text-signal">déc.</span>
                </h2>
                <p className="mt-6 max-w-md text-lead text-muted">
                  Vendredi 18 décembre, ouverture des portes à 08:00.{" "}
                  {EVENT.organiser.tagline}
                </p>
              </div>
              <div className="col-span-4 space-y-8 md:col-span-8 lg:col-span-5">
                <Countdown />
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <ButtonLink href="/billetterie" arrow>
                    Prendre mon pass
                  </ButtonLink>
                  <ButtonLink href={whatsappUrl} variant="link" arrow>
                    Une question ? WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}