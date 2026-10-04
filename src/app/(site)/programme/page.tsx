import type { Metadata } from "next";
import {
  CONFERENCES,
  DAYS,
  FORMATIONS,
  FORMATIONS_INFO,
  PANELS,
  WORKSHOP_SESSIONS,
  type Talk,
} from "@/content/programme";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { DayTabs } from "@/components/programme/DayTabs";
import { Accent } from "@/components/ui/Accent";
import { SignalSquare } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Programme",
  description:
    "Le programme des 18 et 19 décembre 2026 : conférences, panels, formations express, ateliers pratiques et finale du hackathon.",
};

function TalkBlock({ talk }: { talk: Talk }) {
  return (
    <article id={talk.id} className="grid-12 gap-y-6 border-t border-rule-strong py-10 md:py-12">
      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <p className="type-label">{talk.kind}</p>
        <p className="type-meta mt-2 text-muted">{talk.when}</p>
      </div>
      <div className="col-span-4 md:col-span-6 lg:col-span-6">
        {talk.title ? (
          <h3 className="type-headline text-heading">{talk.title}</h3>
        ) : (
          <h3>
            <Pending label={talk.kind}>Intitulé à confirmer</Pending>
          </h3>
        )}
        {talk.description && <p className="mt-5 max-w-[62ch]">{talk.description}</p>}
        {talk.objectives && (
          <ul className="mt-6 space-y-2">
            {talk.objectives.map((o) => (
              <li key={o} className="flex gap-3 text-muted">
                <SignalSquare className="mt-2.5" />
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
        <div>
          <dt className="type-meta text-muted">Intervenants</dt>
          <dd className="mt-1">
            <Pending label="Intervenants">À confirmer</Pending>
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function ProgrammePage() {
  return (
    <>
      <PageHero
        label="Programme · 18 & 19 décembre 2026"
        title="Deux jours de conférences, d’ateliers et de formations"
        lines={["Deux jours de", <span key="c"><Accent>conférences</Accent>, d’ateliers</span>, "et de formations"]}
        lead="Conférences et panels en salle principale, formations et ateliers en parallèle dans les salles A à D, et la finale du hackathon le samedi après-midi."
      >
        <p className="type-meta text-muted">Programme susceptible d’évoluer. Les intervenants seront annoncés sur cette page.</p>
      </PageHero>

      <Section tone="paper" aria-labelledby="titre-jours" className="section-compact">
        <div className="shell">
          <SectionLabel>Jour par jour</SectionLabel>
          <h2 id="titre-jours" className="type-headline text-title mt-8 mb-12">
            Le déroulé
          </h2>
          <DayTabs days={DAYS} />
        </div>
      </Section>

      <Section tone="stone" id="conferences" aria-labelledby="titre-conferences" className="section-compact">
        <div className="shell">
          <SectionLabel index="01">Conférences</SectionLabel>
          <h2 id="titre-conferences" className="type-headline text-title mt-8 mb-12">
            Trois conférences
          </h2>
          <div className="border-b border-rule-strong">
            {CONFERENCES.map((t) => (
              <TalkBlock key={t.id} talk={t} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="ink" id="panels" aria-labelledby="titre-panels" className="section-compact">
        <div className="shell">
          <SectionLabel index="02">Panels & tables rondes</SectionLabel>
          <h2 id="titre-panels" className="type-headline text-title mt-8 mb-12">
            Deux panels
          </h2>
          <div className="border-b border-rule-strong">
            {PANELS.map((t) => (
              <TalkBlock key={t.id} talk={t} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="paper" id="formations" aria-labelledby="titre-formations" className="section-compact">
        <div className="shell">
          <SectionLabel index="03">{FORMATIONS_INFO.when}</SectionLabel>
          <div className="grid-12 mt-8 gap-y-6">
            <h2 id="titre-formations" className="type-headline text-title col-span-4 md:col-span-8 lg:col-span-6">
              Formations express
            </h2>
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">{FORMATIONS_INFO.intro}</p>
          </div>

          <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2">
            {FORMATIONS.map((f) => (
              <RevealItem as="article" key={f.id} className="panel flex flex-col p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="type-label">{f.code}</span>
                  <span className="type-meta text-muted">{f.seats} places</span>
                </div>
                <h3 className="type-headline text-heading mt-5">{f.title}</h3>
                <p className="mt-2 font-semibold">{f.tagline}</p>
                <p className="mt-4 text-muted">{f.description}</p>
                <ul className="mt-6 space-y-2 text-small">
                  {f.goals.map((g) => (
                    <li key={g} className="flex gap-3">
                      <SignalSquare className="mt-2" />
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <span className="type-meta text-muted">Formateurs</span>
                  <Pending label="Formateurs">À confirmer</Pending>
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section tone="ink" id="ateliers" aria-labelledby="titre-ateliers" className="section-compact">
        <div className="shell">
          <SectionLabel index="04">Ateliers pratiques & démonstrations</SectionLabel>
          <div className="grid-12 mt-8 gap-y-6">
            <h2 id="titre-ateliers" className="type-headline text-title col-span-4 md:col-span-8 lg:col-span-6">
              Six ateliers
            </h2>
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">
              Des sessions courtes, en parallèle, pour expérimenter des technologies en direct, dans un format pratique.
            </p>
          </div>

          <RevealGroup className="mt-14 grid gap-4 lg:grid-cols-2">
            {WORKSHOP_SESSIONS.map((s) => (
              <RevealItem key={s.label} className="panel p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="type-headline text-heading">{s.label}</h3>
                  <span className="type-meta text-muted">{s.when}</span>
                </div>
                <ul className="mt-6 border-b border-rule">
                  {s.workshops.map((w) => (
                    <li key={w.code} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-rule py-5">
                      <span className="type-condensed text-heading leading-none text-accent">{w.code}</span>
                      <div>
                        <h4 className="font-semibold">{w.title}</h4>
                        <p className="mt-1 text-small text-muted">{w.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CtaBand title="Un seul pass pour les deux jours" />
    </>
  );
}
