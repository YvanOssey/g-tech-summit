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
import { PageHero } from "@/components/layout/PageHero";
import { DayTabs } from "@/components/programme/DayTabs";
import { ButtonLink } from "@/components/ui/Button";
import { SignalSquare } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { SectionIndex } from "@/components/ui/SectionIndex";

export const metadata: Metadata = {
  title: "Programme",
  description:
    "Le programme des 18 et 19 décembre 2026 : conférences, panels, formations express, ateliers pratiques et finale du hackathon.",
};

function TalkBlock({ talk }: { talk: Talk }) {
  return (
    <article id={talk.id} className="grid-12 scroll-mt-24 gap-y-6 border-t border-ink py-10">
      <div className="col-span-4 md:col-span-2 lg:col-span-3">
        <p className="type-meta">{talk.kind}</p>
        <p className="type-meta mt-1 text-grey-500">{talk.when}</p>
      </div>
      <div className="col-span-4 md:col-span-6 lg:col-span-6">
        {talk.title ? (
          <h3 className="type-condensed text-title">{talk.title}</h3>
        ) : (
          <h3>
            <Pending label={talk.kind}>Intitulé à confirmer</Pending>
          </h3>
        )}
        {talk.description && <p className="mt-5 max-w-[62ch]">{talk.description}</p>}
        {talk.objectives && (
          <ul className="mt-6 space-y-2">
            {talk.objectives.map((o) => (
              <li key={o} className="flex gap-3 text-grey-500">
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
            <dt className="type-meta text-grey-500">Format</dt>
            <dd className="mt-1 text-[0.9375rem]">{talk.format}</dd>
          </div>
        )}
        <div>
          <dt className="type-meta text-grey-500">Intervenants</dt>
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
        eyebrow="Programme · 18 & 19 décembre 2026"
        lines={["Deux jours,", "un programme"]}
        lead="Conférences et panels en salle principale, formations et ateliers en parallèle dans les salles A à D, et la finale du hackathon le samedi après-midi."
      >
        <p className="type-meta text-grey-500">
          Programme susceptible d’évoluer. Les intervenants seront annoncés sur cette page.
        </p>
      </PageHero>

      <section className="shell" aria-label="Programme par jour">
        <DayTabs days={DAYS} />
      </section>

      <section id="conferences" className="shell mt-28 scroll-mt-20 md:mt-36" aria-labelledby="titre-conferences">
        <SectionIndex index="01" label="Conférences" />
        <h2 id="titre-conferences" className="type-condensed text-display mt-10 mb-12">
          Conférences
        </h2>
        {CONFERENCES.map((t) => (
          <TalkBlock key={t.id} talk={t} />
        ))}
      </section>

      <section id="panels" className="shell mt-28 scroll-mt-20 md:mt-36" aria-labelledby="titre-panels">
        <SectionIndex index="02" label="Panels & tables rondes" />
        <h2 id="titre-panels" className="type-condensed text-display mt-10 mb-12">
          Panels
        </h2>
        {PANELS.map((t) => (
          <TalkBlock key={t.id} talk={t} />
        ))}
      </section>

      <section id="formations" className="mt-28 scroll-mt-20 bg-grey-100 py-20 md:mt-36 md:py-28" aria-labelledby="titre-formations">
        <div className="shell">
          <SectionIndex index="03" label={FORMATIONS_INFO.when} />
          <div className="grid-12 mt-10 gap-y-6">
            <h2 id="titre-formations" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-6">
              Formations express
            </h2>
            <p className="col-span-4 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">{FORMATIONS_INFO.intro}</p>
          </div>

          <div className="mt-14 grid gap-px bg-ink ring-1 ring-ink md:grid-cols-2">
            {FORMATIONS.map((f) => (
              <article key={f.id} className="flex flex-col bg-paper p-6 sm:p-8">
                <div className="type-meta flex justify-between gap-4 text-grey-500">
                  <span>{f.code}</span>
                  <span>{f.seats} places</span>
                </div>
                <h3 className="type-condensed text-title mt-6">{f.title}</h3>
                <p className="mt-2 font-semibold">{f.tagline}</p>
                <p className="mt-4 text-grey-500">{f.description}</p>
                <ul className="mt-6 space-y-2 border-t border-grey-200 pt-5 text-[0.9375rem]">
                  {f.goals.map((g) => (
                    <li key={g} className="flex gap-3">
                      <SignalSquare className="mt-2" />
                      {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <span className="type-meta text-grey-500">Formateurs</span>
                  <Pending label="Formateurs">À confirmer</Pending>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ateliers" className="shell mt-28 scroll-mt-20 md:mt-36" aria-labelledby="titre-ateliers">
        <SectionIndex index="04" label="Ateliers pratiques & démonstrations" />
        <div className="grid-12 mt-10 gap-y-6">
          <h2 id="titre-ateliers" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-6">
            Ateliers
          </h2>
          <p className="col-span-4 self-end text-grey-500 md:col-span-6 lg:col-span-5 lg:col-start-8">
            Des sessions courtes, en parallèle, pour expérimenter des technologies en direct, dans un format pratique.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-(--gutter)">
          {WORKSHOP_SESSIONS.map((s) => (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-4 border-t-4 border-ink pt-3">
                <h3 className="type-condensed text-title">{s.label}</h3>
                <span className="type-meta text-grey-500">{s.when}</span>
              </div>
              <ul className="mt-6 border-b border-ink">
                {s.workshops.map((w) => (
                  <li key={w.code} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink py-5">
                    <span className="type-condensed text-[2rem] leading-none text-signal-ink">{w.code}</span>
                    <div>
                      <h4 className="font-semibold">{w.title}</h4>
                      <p className="mt-1 text-[0.9375rem] text-grey-500">{w.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-28 mb-28 md:mt-36 md:mb-36">
        <div className="flex flex-col gap-6 border-t border-ink pt-8 md:flex-row md:items-end md:justify-between">
          <p className="type-condensed text-title max-w-xl">Un seul pass pour les deux jours</p>
          <ButtonLink href="/billetterie" arrow>
            Prendre mon pass
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
