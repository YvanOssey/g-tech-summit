import type { Metadata } from "next";
import { Fragment } from "react";
import {
  CONFERENCES,
  FORMATIONS,
  FORMATIONS_INFO,
  PANELS,
  type Talk,
} from "@/content/programme";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageIntro } from "@/components/layout/PageIntro";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { DayTabs } from "@/components/programme/DayTabs";
import { SpeakerGrid, SpeakerMarquee, speakerNames } from "@/components/programme/SpeakerGrid";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { SignalSquare } from "@/components/ui/icons";
import { getEventSettings } from "@/config/settings";
import { getProgramme, getSpeakers } from "@/server/repositories/content";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Programme",
  description:
    "Le programme des 18 et 19 décembre 2026 : conférences, panels, formations express et finale du hackathon.",
};

/** Talks stack on top of each other while scrolling (sticky, offset per card). */
function TalkCard({ talk, index, speakers }: { talk: Talk; index: number; speakers?: string }) {
  return (
    <article
      id={talk.id}
      className="panel p-6 shadow-[0_-12px_40px_-24px_rgb(23_23_23/0.35)] sm:p-8 lg:sticky lg:p-10"
      style={{ top: `calc(var(--header-h) + 1.5rem + ${index * 1.25}rem)` }}
    >
      <div className="grid-12 gap-y-6">
        <div className="col-span-4 md:col-span-2 lg:col-span-3">
          <p className="type-condensed text-display leading-none text-accent">{talk.kind.split(" ")[1].padStart(2, "0")}</p>
          <p className="type-label mt-4">{talk.kind.split(" ")[0]}</p>
          <p className="type-meta mt-2 text-muted">{talk.when}</p>
        </div>
        <div className="col-span-4 md:col-span-6 lg:col-span-6">
          {talk.title ? (
            <h3 className="type-headline text-title leading-[1.02]">{talk.title}</h3>
          ) : (
            <h3>
              <Pending label={talk.kind}>Intitulé à confirmer</Pending>
            </h3>
          )}
          {talk.description && <p className="mt-5 max-w-[62ch]">{talk.description}</p>}
          {talk.objectives && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {talk.objectives.map((o) => (
                <li key={o} className="flex gap-3 text-small text-muted">
                  <SignalSquare className="mt-1.5" />
                  {o}
                </li>
              ))}
            </ul>
          )}
        </div>
        <dl className="col-span-4 space-y-4 md:col-span-6 md:col-start-3 lg:col-span-3 lg:col-start-10">
          {talk.format && (
            <div>
              <dt className="type-meta text-muted">Format</dt>
              <dd className="mt-1 text-small">{talk.format}</dd>
            </div>
          )}
          
        </dl>
      </div>
    </article>
  );
}

export default async function ProgrammePage() {
  const [programme, speakers, settings] = await Promise.all([getProgramme(), getSpeakers(), getEventSettings()]);
  // "Informations à venir" (admin → Paramètres): when off, no speakers, trainers or "à confirmer" titles.
  const show = settings.showUpcoming;
  const talks = [...CONFERENCES, ...PANELS].filter((t) => show || t.title);
  // Speakers entered in the admin (Intervenants) win over the free text of a slot.
  const days = programme.map((d) => ({
    ...d,
    slots: d.slots.map((s) => {
      if (!show) return { ...s, speakers: undefined, subtitle: s.subtitle === null ? undefined : s.subtitle };
      const names = s.ref ? speakerNames(speakers, s.ref) : null;
      return names ? { ...s, speakers: names } : s;
    }),
  }));
  const speakersOf = (id: string) =>
    show ? (days.flatMap((d) => d.slots).find((s) => s.ref === id && s.speakers)?.speakers ?? speakerNames(speakers, id) ?? undefined) : undefined;

  return (
    <>
      <PageIntro
        label="Programme · 18 & 19 décembre 2026"
        title="Deux jours, heure par heure"
        lines={["Deux jours,", <span key="h"><Accent>heure</Accent> par heure</span>]}
        lead="Deux jours de conférences, de panels, et de formations express, jusqu’à la finale du hackathon le samedi après-midi."
        actions={
          <>
            <ButtonLink href="#deroule" arrow>
              Voir le déroulé
            </ButtonLink>
            <ButtonLink href="/billetterie" variant="link" arrow>
              Billetterie
            </ButtonLink>
          </>
        }
      />

      {/* ── Day by day ───────────────────────────────────────────────── */}
      <Section tone="paper" id="deroule" aria-labelledby="titre-jours" className="sheet section-standard">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel>Jour par jour</SectionLabel>
              <RevealText inView id="titre-jours" lines={["Le déroulé"]} className="type-headline text-title mt-8" />
            </div>
            <p className="max-w-sm text-muted">Choisissez un jour : chaque créneau mène à sa description détaillée.</p>
          </div>
          <div className="mt-12">
            <DayTabs days={days} />
          </div>
        </div>
      </Section>

      {/* ── Talks: stacked cards ─────────────────────────────────────── */}
      <Section tone="stone" id="conferences" aria-labelledby="titre-conferences" className="sheet section-standard">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="01">Prises de parole</SectionLabel>
              <RevealText
                inView
                id="titre-conferences"
                label="Trois conférences, deux panels."
                lines={["Trois conférences,", <span key="p">deux <Accent>panels</Accent>.</span>]}
                className="type-headline text-title mt-8"
              />
            </div>
            <p className="max-w-sm text-muted">Faites défiler : les prises de parole s’empilent dans l’ordre du programme.</p>
          </div>
          <div className="mt-14 space-y-6 lg:space-y-10">
            {talks.map((t, i) => (
              <Fragment key={t.id}>
                {t.id === PANELS[0].id && <span id="panels" aria-hidden="true" className="block h-0 scroll-mt-32" />}
                <TalkCard talk={t} index={i} speakers={speakersOf(t.id)} />
              </Fragment>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Formations: certificates ─────────────────────────────────── */}
      <Section tone="paper" id="formations" aria-labelledby="titre-formations" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="02">{FORMATIONS_INFO.when}</SectionLabel>
          <div className="grid-12 mt-8 gap-y-6">
            <RevealText
              inView
              id="titre-formations"
              label="Formations express"
              lines={["Formations", <Accent key="e">express</Accent>]}
              className="type-headline text-title col-span-4 md:col-span-8 lg:col-span-6"
            />
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">{FORMATIONS_INFO.intro}</p>
          </div>

          <SpotlightGroup>
            <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2">
              {FORMATIONS.map((f, i) => (
                <RevealItem
                  as="article"
                  effect="flip"
                  key={f.id}
                  className="panel card-interactive spotlight relative flex flex-col overflow-hidden border-dashed p-6 sm:p-8"
                >
                  {/* Rotating "attestation" stamp */}
                  <svg viewBox="0 0 120 120" aria-hidden="true" className="spin-slow absolute -top-6 -right-6 size-32 text-accent opacity-80">
                    <defs>
                      <path id={`stamp-${f.id}`} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                    </defs>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="1" />
                    <text className="font-mono uppercase" fill="currentColor" style={{ fontSize: 9, letterSpacing: "0.2em" }}>
                      <textPath href={`#stamp-${f.id}`} textLength="272" lengthAdjust="spacing">
                        Attestation de participation ·
                      </textPath>
                    </text>
                  </svg>

                  <div className="flex items-baseline gap-4 pr-24">
                    <span className="type-condensed text-display leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="type-headline mt-6 text-heading">{f.title}</h3>
                  {f.tagline && <p className="mt-2 font-semibold">{f.tagline}</p>}
                  {f.description && <p className="mt-4 text-muted">{f.description}</p>}
                  <ul className="mt-6 space-y-2 text-small">
                    {f.goals.map((g) => (
                      <li key={g} className="flex gap-3">
                        <SignalSquare className="mt-1.5" />
                        {g}
                      </li>
                    ))}
                  </ul>
                  
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Speakers, with their photo (entered in the admin) ────────── */}
      {show && speakers.length > 0 && (
        <Section tone="stone" id="intervenants" aria-labelledby="titre-intervenants" className="sheet section-standard">
          <div className="shell">
            <SectionLabel index="03">Intervenants</SectionLabel>
            <RevealText
              inView
              id="titre-intervenants"
              label="Ils prennent la parole."
              lines={["Ils prennent", <span key="p">la <Accent>parole</Accent>.</span>]}
              className="type-headline text-title mt-8"
            />
            <SpeakerGrid speakers={speakers} />
          </div>
          <SpeakerMarquee speakers={speakers} />
        </Section>
      )}

      <CtaBand title="Un seul pass pour les deux jours" />
    </>
  );
}