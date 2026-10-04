import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { PHOTOS } from "@/config/media";
import { PASSES, orderTotal } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { FAQ } from "@/content/faq";
import { HACKATHON, TRACKS } from "@/content/hackathon";
import { DAYS } from "@/content/programme";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { HomeHero } from "@/components/home/HomeHero";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { DaySchedule } from "@/components/programme/DaySchedule";
import { PassCard } from "@/components/ticket/PassCard";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { FaqList } from "@/components/ui/FaqList";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ArrowRight } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatFCFA } from "@/lib/format";

const PROFILES = [
  { who: "Vous découvrez la tech", what: "Initiation au développement web sans prérequis, introduction à l’IA, ateliers de découverte des outils IA." },
  { who: "Étudiants", what: "Des formations avec attestation, et des rencontres avec des professionnels, des startups et des recruteurs." },
  { who: "Développeurs", what: "Ateliers Git & GitHub, API REST avec Node.js, data visualisation avec Python — et le hackathon." },
  { who: "Designers", what: "Formation design graphique avec Canva & Figma, atelier UI/UX, et une place dans une équipe du hackathon." },
  { who: "Entrepreneurs & startups", what: "Une conférence sur l’entrepreneuriat tech en Afrique, un espace d’exposition et des pitchs." },
  { who: "Professionnels & experts", what: "Conférences et panels sur l’IA, l’emploi, l’inclusion et le numérique ivoirien, et un réseau à rencontrer." },
] as const;

const FORMATS = [
  { name: "Conférences", text: "Intelligence artificielle et avenir du travail, entrepreneuriat tech en Afrique, innovation numérique en Côte d’Ivoire.", href: "/programme#conferences" },
  { name: "Panels", text: "Des débats entre intervenants aux profils complémentaires, nourris par les questions du public.", href: "/programme#panels" },
  { name: "Formations express", text: "Trois heures de pratique et une attestation de participation : web, IA, design, personal branding.", href: "/programme#formations" },
  { name: "Ateliers pratiques", text: "Des sessions courtes et concrètes : outils IA, Git, UI/UX, API REST, data, cybersécurité.", href: "/programme#ateliers" },
  { name: "Stands & démos live", text: "Un espace d’exposition pour les startups, des démonstrations et un quiz tech avec des lots à gagner.", href: "/programme" },
  { name: "Networking", text: "Étudiants, professionnels, startups et recruteurs. Un cocktail clôt chacune des deux journées.", href: "/programme" },
] as const;

export default async function HomePage() {
  const settings = await getEventSettings();
  const hackathonPhoto = PHOTOS.hackathon;
  const atelierPhoto = PHOTOS.atelier;

  return (
    <>
      <HomeHero venue={settings.venue} />

      {/* ── L'événement — light, editorial, generous space ───────────── */}
      <Section tone="paper" aria-labelledby="evenement" className="py-24 md:py-36">
        <div className="shell">
          <div className="grid-12 gap-y-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-6">
              <SectionLabel>L’événement</SectionLabel>
              <RevealText
                inView
                id="evenement"
                label="Deux jours pour apprendre, échanger et construire."
                lines={["Deux jours pour", "apprendre, échanger", <span key="c">et <Accent>construire</Accent>.</span>]}
                className="type-headline text-display mt-8"
              />
              <Reveal delay={0.15} className="mt-10 space-y-8">
                <p className="text-lead">
                  G-TECH SUMMER réunit étudiants, développeurs, designers, entrepreneurs et professionnels. Aucun niveau
                  technique n’est requis pour venir.
                </p>
                <div className="panel flex items-start gap-5 p-5 sm:p-6">
                  <GhostechLogo width={88} className="shrink-0" />
                  <p className="text-[0.9375rem] text-muted">
                    Organisé par <span className="font-semibold text-fg">{EVENT.organiser.name}</span>, communauté tech
                    fondée à l’Institut Universitaire d’Abidjan. Cette première édition marque aussi sa première année.
                  </p>
                </div>
              </Reveal>
            </div>
            {atelierPhoto && (
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
                <ImageFrame photo={atelierPhoto} aspect="aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5]" />
              </div>
            )}
          </div>

          <RevealGroup as="ul" className="mt-20 grid gap-3 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:gap-4">
            {PROFILES.map((p, i) => (
              <RevealItem as="li" key={p.who} className="panel flex flex-col p-6 sm:p-8">
                <span className="type-condensed text-[2rem] leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="type-headline mt-6 text-[1.5rem] leading-tight">{p.who}</h3>
                <p className="mt-3 text-muted">{p.what}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Hackathon — dark, immersive ───────────────────────────────── */}
      <Section tone="ink" aria-labelledby="hackathon" className="py-24 md:py-36">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionLabel>{`${HACKATHON.name} · ${HACKATHON.edition}`}</SectionLabel>
            <RevealText
              inView
              id="hackathon"
              label="Quatre thématiques, une finale sur scène."
              lines={["Quatre thématiques,", <span key="f">une <Accent>finale</Accent> sur scène.</span>]}
              className="type-headline text-display mt-8"
            />
            <p className="mt-8 max-w-xl text-muted">{HACKATHON.intro}</p>

            <dl className="mt-10 grid grid-cols-2 border-t border-rule">
              {[
                { k: "Format", v: "En équipe uniquement" },
                { k: "Finale", v: `Sam. 19 déc. · ${HACKATHON.finale.pitch.time}` },
                { k: "Pitch", v: "4 min + 2 min de questions" },
                { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} / pers.` },
              ].map((item, i) => (
                <div key={item.k} className={`border-b border-rule py-5 ${i % 2 ? "border-l pl-5" : "pr-5"}`}>
                  <dt className="type-label">{item.k}</dt>
                  <dd className="mt-1.5 font-semibold">{item.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/hackathon" arrow>
                Découvrir le hackathon
              </ButtonLink>
              <ButtonLink href="/billetterie?pass=hackathon" variant="secondary">
                Pass Hackathon
              </ButtonLink>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            {hackathonPhoto && <ImageFrame photo={hackathonPhoto} className="mb-4" />}
            <RevealGroup as="ol" className="grid gap-3 sm:grid-cols-2">
              {TRACKS.map((t) => (
                <RevealItem as="li" key={t.code} className="panel p-6">
                  <span className="type-condensed text-[2rem] leading-none text-accent">{t.code}</span>
                  <h3 className="type-headline mt-4 text-[1.375rem] leading-tight">{t.name}</h3>
                  <p className="mt-1 text-[0.9375rem] text-muted">{t.claim}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Formats — grey, index rows ────────────────────────────────── */}
      <Section tone="grey" aria-labelledby="formats" className="py-24 md:py-36">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel>Au programme</SectionLabel>
              <RevealText
                inView
                id="formats"
                label="Apprendre, pratiquer, rencontrer."
                lines={["Apprendre, pratiquer,", <Accent key="r">rencontrer.</Accent>]}
                className="type-headline text-display mt-8"
              />
            </div>
            <ButtonLink href="/programme" variant="tertiary" arrow>
              Programme détaillé
            </ButtonLink>
          </div>

          <ul className="mt-16 border-b border-rule-strong">
            {FORMATS.map((f, i) => (
              <li key={f.name} className="border-t border-rule-strong">
                <Link
                  href={f.href}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.4fr)_auto] md:gap-x-(--gutter) md:py-9"
                >
                  <span className="type-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-headline text-[clamp(1.5rem,1.15rem+1.4vw,2.5rem)] leading-none transition-colors duration-(--duration-micro) group-hover:text-accent">
                    {f.name}
                  </span>
                  <span className="col-span-3 col-start-2 row-start-2 text-muted md:col-span-1 md:col-start-3 md:row-start-1">{f.text}</span>
                  <ArrowRight className="col-start-3 row-start-1 size-5 self-center transition-transform duration-(--duration-micro) ease-out-quart group-hover:translate-x-1 md:col-start-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Two days — dark, dense ─────────────────────────────────────── */}
      <Section tone="ink" aria-labelledby="deux-jours" className="py-24 md:py-36">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel>Deux jours</SectionLabel>
              <RevealText
                inView
                id="deux-jours"
                label="Vendredi 18 et samedi 19 décembre."
                lines={["Vendredi 18 &", <span key="s">samedi <Accent>19 décembre</Accent></span>]}
                className="type-headline text-display mt-8"
              />
            </div>
            <ButtonLink href="/programme" variant="tertiary" arrow>
              Voir le programme complet
            </ButtonLink>
          </div>
          <RevealGroup className="mt-16 grid gap-4 md:grid-cols-2">
            {DAYS.map((d) => (
              <RevealItem key={d.id} className="panel p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-headline text-title">{d.label}</h3>
                  <span className="type-label">Jour {d.index}</span>
                </div>
                <p className="mt-2 mb-6 text-muted">{d.theme}</p>
                <DaySchedule slots={d.slots} compact />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Billetterie — the single orange band ──────────────────────── */}
      <Section tone="signal" aria-labelledby="pass" className="py-24 md:py-32">
        <div className="shell">
          <div className="grid-12 gap-y-8">
            <div className="col-span-4 md:col-span-8 lg:col-span-7">
              <SectionLabel>Billetterie</SectionLabel>
              <RevealText
                inView
                id="pass"
                label="Deux pass, un billet nominatif."
                lines={["Deux pass,", <span key="b">un <Accent>billet nominatif</Accent>.</span>]}
                className="type-headline text-display mt-8"
              />
            </div>
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-4 lg:col-start-9">
              Envoyé par e-mail après paiement via Wave, sans frais ajoutés. Pour l’événement et le hackathon, prenez les
              deux : {formatFCFA(orderTotal(["event", "hackathon"]))}.
            </p>
          </div>
          <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2 md:gap-(--gutter)">
            {(["event", "hackathon"] as const).map((id, i) => (
              <RevealItem key={id}>
                <Link href={`/billetterie?pass=${id}`} className="group block">
                <PassCard pass={PASSES[id]} index={i + 1} className="transition-transform duration-(--duration-micro) ease-out-quart group-hover:-translate-y-1">
                  <span className="flex size-11 items-center justify-center bg-signal text-ink">
                    <ArrowRight className="size-5 transition-transform duration-(--duration-micro) group-hover:translate-x-0.5" />
                    <span className="sr-only">Choisir le {PASSES[id].name}</span>
                  </span>
                </PassCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Partners — light, institutional ───────────────────────────── */}
      <Section tone="paper" aria-labelledby="partenaires" className="py-24 md:py-32">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel>Partenaires</SectionLabel>
              <h2 id="partenaires" className="type-headline text-display mt-8">
                Ils nous accompagnent
              </h2>
            </div>
            <ButtonLink href="/partenaires" variant="tertiary" arrow>
              Devenir partenaire
            </ButtonLink>
          </div>
          <Reveal className="panel mt-14 px-2 sm:px-6">
            <PartnerLogos />
          </Reveal>
        </div>
      </Section>

      {/* ── Practical + FAQ — grey, calm reading ──────────────────────── */}
      <Section tone="grey" aria-labelledby="infos" className="py-24 md:py-32">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-3 lg:col-span-4">
            <SectionLabel>Infos pratiques</SectionLabel>
            <h2 id="infos" className="type-headline text-display mt-8">
              Questions fréquentes
            </h2>
            <dl className="mt-10 space-y-6 border-t border-rule-strong pt-6">
              <div>
                <dt className="type-label">Lieu</dt>
                <dd className="mt-1.5">{settings.venue ? settings.venue.name : <Pending label="Lieu" />}</dd>
              </div>
              <div>
                <dt className="type-label">Accueil</dt>
                <dd className="mt-1.5">À partir de 08:00, les deux jours</dd>
              </div>
              <div>
                <dt className="type-label">Contact</dt>
                <dd className="mt-1.5 space-y-1">
                  <a href={`mailto:${EVENT.contact.email}`} className="block break-words underline decoration-rule-strong underline-offset-4 hover:decoration-mark">
                    {EVENT.contact.email}
                  </a>
                  <a href={whatsappUrl} className="block underline decoration-rule-strong underline-offset-4 hover:decoration-mark">
                    WhatsApp {EVENT.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-7 lg:col-start-6">
            <div className="panel px-6 py-2 sm:px-8">
              <FaqList items={FAQ.slice(0, 5)} />
            </div>
            <div className="mt-6">
              <ButtonLink href="/infos-pratiques#faq" variant="tertiary" arrow>
                Toutes les questions
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Closing ────────────────────────────────────────────────────── */}
      <Section tone="ink" aria-labelledby="cloture" className="py-20 md:py-28">
        <div className="shell grid-12 items-end gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionLabel>{`Rendez-vous à ${EVENT.city}`}</SectionLabel>
            <h2 id="cloture" className="type-headline text-display mt-8">
              Vendredi 18 décembre, <Accent>08:00</Accent>
            </h2>
            <p className="mt-6 max-w-md text-lead text-muted">{EVENT.organiser.tagline}</p>
          </div>
          <div className="col-span-4 space-y-8 md:col-span-8 lg:col-span-6">
            <Countdown size="lg" />
            <ButtonLink href="/billetterie" arrow>
              Prendre mon pass
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
