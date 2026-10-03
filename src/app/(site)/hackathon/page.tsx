import type { Metadata } from "next";
import { PASSES } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { CRITERIA, ELIGIBLE, HACKATHON, REWARDS, RULES, TRACKS } from "@/content/hackathon";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { SignalSquare } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Hackathon",
  description: `Hackathon Ghostech, 2ᵉ édition : 4 thématiques, participation en équipe, finale le 19 décembre 2026 à Abidjan. Thème : ${HACKATHON.theme}.`,
};

const dateFr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function HackathonPage() {
  const { hackathon: s } = await getEventSettings();

  const timeline = [
    {
      when: s.challengesStart ? dateFr.format(new Date(s.challengesStart)) : null,
      what: "Début officiel des challenges",
      detail: "Les équipes développent leur projet pendant la période du hackathon.",
    },
    {
      when: `${HACKATHON.finale.pitch.date} · ${HACKATHON.finale.pitch.time}`,
      what: "Pitch & présentations finales",
      detail: "Présentation des projets finalistes en salle principale, avec vote du public.",
    },
    {
      when: `${HACKATHON.finale.awards.date} · ${HACKATHON.finale.awards.time}`,
      what: "Annonce des vainqueurs & remise des prix",
      detail: "Pendant la clôture de G-TECH SUMMER.",
    },
  ];

  return (
    <>
      <PageHero
        tone="dark"
        eyebrow={`${HACKATHON.name} · ${HACKATHON.edition}`}
        lines={["Hackathon"]}
        lead={<>« {HACKATHON.theme} »</>}
      >
        <div className="space-y-6">
          <p className="text-grey-400">{HACKATHON.intro}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/billetterie?pass=hackathon" tone="dark" arrow>
              Pass Hackathon · {formatFCFA(PASSES.hackathon.price)}
            </ButtonLink>
          </div>
        </div>
      </PageHero>

      {/* Key facts */}
      <section className="bg-ink pb-20 text-paper md:pb-28" aria-label="L’essentiel">
        <dl className="shell grid grid-cols-2 border-t border-grey-700 lg:grid-cols-4">
          {[
            { k: "Participation", v: "En équipe uniquement" },
            { k: "Taille des équipes", v: s.teamSize ? `${s.teamSize.min} à ${s.teamSize.max} personnes` : null },
            { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} par personne` },
            { k: "Date limite d’inscription", v: s.registrationDeadline ? dateFr.format(new Date(s.registrationDeadline)) : null },
          ].map((item, i) => (
            <div key={item.k} className={`border-b border-grey-700 py-5 pr-4 ${i % 2 ? "border-l pl-4" : ""} ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}>
              <dt className="type-meta text-grey-400">{item.k}</dt>
              <dd className="mt-1 font-semibold">{item.v ?? <Pending tone="dark" label={item.k} />}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Tracks */}
      <section className="shell mt-24 md:mt-32" aria-labelledby="thematiques">
        <SectionIndex index="01" label="Thématiques officielles" />
        <div className="grid-12 mt-10 gap-y-6">
          <h2 id="thematiques" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-6">
            4 défis
          </h2>
          <p className="col-span-4 self-end text-grey-500 md:col-span-6 lg:col-span-5 lg:col-start-8">
            Chaque équipe choisit une seule thématique et y répond par une solution à une problématique réelle, en
            Côte d’Ivoire ou en Afrique.
          </p>
        </div>
        <ol className="mt-12 grid gap-px bg-ink ring-1 ring-ink md:grid-cols-2">
          {TRACKS.map((t) => (
            <li key={t.code} className="flex min-w-0 flex-col gap-6 bg-paper p-6 sm:p-8 lg:min-h-80">
              <span className="type-meta text-grey-500">Thématique {t.code}</span>
              <h3 className="type-condensed text-[clamp(2rem,1.4rem+2.4vw,4rem)] leading-[0.9] hyphens-auto break-words">{t.name}</h3>
              <div className="mt-auto">
                <p className="font-semibold">{t.claim}</p>
                <p className="mt-2 text-grey-500">{t.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Who & teams */}
      <section className="shell mt-24 md:mt-32" aria-labelledby="qui">
        <SectionIndex index="02" label="Qui peut participer" />
        <div className="grid-12 mt-10 gap-y-12">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <h2 id="qui" className="type-condensed text-display">
              Ouvert à tous les profils
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ELIGIBLE.map((e) => (
                <li key={e} className="border border-ink px-3 py-1.5 text-[0.9375rem]">
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
            <h3 className="type-meta text-grey-500">Règles de participation</h3>
            <ul className="mt-4 border-b border-ink">
              {RULES.map((r) => (
                <li key={r} className="flex gap-4 border-t border-ink py-4">
                  <SignalSquare className="mt-2.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="shell mt-24 md:mt-32" aria-labelledby="deroule">
        <SectionIndex index="03" label="Déroulé" />
        <h2 id="deroule" className="type-condensed text-display mt-10">
          Du code à la scène
        </h2>
        <ol className="mt-12 grid gap-px bg-ink ring-1 ring-ink lg:grid-cols-3">
          {timeline.map((step, i) => (
            <li key={step.what} className={`flex flex-col gap-6 p-6 sm:p-8 ${i === 1 ? "bg-ink text-paper" : "bg-paper"}`}>
              <span className={`type-meta ${i === 1 ? "text-signal" : "text-grey-500"}`}>Étape {i + 1}</span>
              <p className="type-meta">{step.when ?? <Pending tone={i === 1 ? "dark" : "light"} label="Date" />}</p>
              <div className="mt-auto">
                <h3 className="type-condensed text-title">{step.what}</h3>
                <p className={`mt-3 ${i === 1 ? "text-grey-400" : "text-grey-500"}`}>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-6 border-t border-ink pt-6 md:grid-cols-2">
          <p>
            <span className="type-meta block text-grey-500">Présentation finale</span>
            <span className="mt-1 block text-lead">
              {HACKATHON.pitchFormat.presentation}, puis {HACKATHON.pitchFormat.questions}.
            </span>
          </p>
        </div>
      </section>

      {/* Criteria / jury / rewards */}
      <section className="shell mt-24 md:mt-32" aria-labelledby="evaluation">
        <SectionIndex index="04" label="Évaluation" />
        <div className="grid-12 mt-10 gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <h2 id="evaluation" className="type-condensed text-display">
              6 critères
            </h2>
            <ol className="mt-8 border-b border-ink">
              {CRITERIA.map((c, i) => (
                <li key={c} className="grid grid-cols-[3rem_1fr] border-t border-ink py-4">
                  <span className="type-meta pt-1 text-grey-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.125rem] font-semibold">{c}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-4 space-y-14 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div>
              <h3 className="type-condensed text-title">Jury</h3>
              <div className="mt-6">
                {s.jury?.length ? (
                  <ul className="space-y-2">
                    {s.jury.map((j) => (
                      <li key={j}>{j}</li>
                    ))}
                  </ul>
                ) : (
                  <Pending variant="block" label="Jury">
                    Composition du jury à annoncer
                  </Pending>
                )}
              </div>
            </div>
            <div>
              <h3 className="type-condensed text-title">Récompenses</h3>
              <p className="mt-3 text-grey-500">Les meilleures équipes bénéficieront :</p>
              <ul className="mt-4 space-y-3">
                {REWARDS.map((r) => (
                  <li key={r} className="flex gap-3">
                    <SignalSquare className="mt-2.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="mt-24 bg-ink py-20 text-paper md:mt-32 md:py-28" aria-labelledby="inscription">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionIndex index="05" label="Inscription" tone="dark" />
            <h2 id="inscription" className="type-condensed text-display mt-10">
              Chaque membre prend son pass
            </h2>
          </div>
          <div className="col-span-4 space-y-6 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-grey-400">
              L’inscription est libre. Chaque membre de l’équipe prend son Pass Hackathon ({formatFCFA(PASSES.hackathon.price)}).
              Le Pass Hackathon donne accès uniquement au hackathon : pour suivre aussi les conférences, formations et
              ateliers, ajoutez le Pass Event dans la même commande.
            </p>
            <dl className="grid grid-cols-2 gap-6 border-t border-grey-700 pt-5">
              <div>
                <dt className="type-meta text-grey-400">Date limite</dt>
                <dd className="mt-1">
                  {s.registrationDeadline ? dateFr.format(new Date(s.registrationDeadline)) : <Pending tone="dark" label="Date limite" />}
                </dd>
              </div>
              <div>
                <dt className="type-meta text-grey-400">Places</dt>
                <dd className="mt-1">{s.quota ?? <Pending tone="dark" label="Nombre de places" />}</dd>
              </div>
            </dl>
            <ButtonLink href="/billetterie?pass=hackathon" tone="dark" arrow>
              Prendre mon Pass Hackathon
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
