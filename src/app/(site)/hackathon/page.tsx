import type { Metadata } from "next";
import { PHOTOS } from "@/config/media";
import { PASSES } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { CRITERIA, ELIGIBLE, HACKATHON, REWARDS, RULES, TRACKS } from "@/content/hackathon";
import { PageHero } from "@/components/layout/PageHero";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { SignalSquare } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
        label={`${HACKATHON.name} · ${HACKATHON.edition}`}
        title="Le hackathon de G-TECH SUMMER"
        lines={["Le hackathon", <span key="t">de <Accent>G-TECH SUMMER</Accent></span>]}
        lead={<>Thème : «&nbsp;{HACKATHON.theme}&nbsp;». {HACKATHON.intro}</>}
      >
        <ButtonLink href="/billetterie?pass=hackathon" arrow>
          Pass Hackathon · {formatFCFA(PASSES.hackathon.price)}
        </ButtonLink>
      </PageHero>

      {/* Key facts, still on ink, separated by a rule */}
      <Section tone="ink" aria-label="L’essentiel" className="pb-20 md:pb-24">
        <dl className="shell grid grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Participation", v: "En équipe uniquement" },
            { k: "Taille des équipes", v: s.teamSize ? `${s.teamSize.min} à ${s.teamSize.max} personnes` : null },
            { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} par personne` },
            { k: "Date limite d’inscription", v: s.registrationDeadline ? dateFr.format(new Date(s.registrationDeadline)) : null },
          ].map((item, i) => (
            <div
              key={item.k}
              className={`border-t border-rule py-6 pr-4 ${i % 2 ? "border-l pl-4" : ""} ${i > 0 ? "lg:border-l lg:pl-6" : ""}`}
            >
              <dt className="type-label">{item.k}</dt>
              <dd className="mt-2 text-body font-semibold">{item.v ?? <Pending label={item.k} />}</dd>
            </div>
          ))}
        </dl>
        {PHOTOS.hackathon && (
          <div className="shell mt-10">
            <ImageFrame photo={PHOTOS.hackathon} aspect="aspect-[4/3] md:aspect-[21/9]" sizes="100vw" />
          </div>
        )}
      </Section>

      {/* Tracks */}
      <Section tone="paper" aria-labelledby="thematiques" className="section-compact">
        <div className="shell">
          <SectionLabel index="01">Thématiques officielles</SectionLabel>
          <div className="grid-12 mt-8 gap-y-6">
            <h2 id="thematiques" className="type-headline text-title col-span-4 md:col-span-8 lg:col-span-6">
              Quatre défis
            </h2>
            <p className="col-span-4 self-end text-muted md:col-span-6 lg:col-span-5 lg:col-start-8">
              Chaque équipe choisit une seule thématique et y répond par une solution à une problématique réelle, en
              Côte d’Ivoire ou en Afrique.
            </p>
          </div>
          <RevealGroup as="ol" className="mt-14 grid gap-4 md:grid-cols-2">
            {TRACKS.map((t) => (
              <RevealItem as="li" key={t.code} className="panel flex min-w-0 flex-col gap-5 p-6 sm:p-8 lg:min-h-72">
                <span className="type-condensed text-title leading-none text-accent">{t.code}</span>
                <h3 className="type-headline break-words text-title leading-none hyphens-auto">{t.name}</h3>
                <div className="mt-auto">
                  <p className="font-semibold">{t.claim}</p>
                  <p className="mt-2 text-muted">{t.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Who & rules */}
      <Section tone="stone" aria-labelledby="qui" className="section-compact">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-4 lg:col-span-5">
            <SectionLabel index="02">Qui peut participer</SectionLabel>
            <h2 id="qui" className="type-headline text-title mt-8">
              Ouvert à tous les profils
            </h2>
            <ul className="mt-8 flex flex-wrap gap-2">
              {ELIGIBLE.map((e) => (
                <li key={e} className="border border-rule-strong px-3 py-1.5 text-small">
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
            <h3 className="type-label">Règles de participation</h3>
            <ul className="mt-5 border-b border-rule-strong">
              {RULES.map((r) => (
                <li key={r} className="flex gap-4 border-t border-rule-strong py-4">
                  <SignalSquare className="mt-2.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Timeline */}
      <Section tone="ink" aria-labelledby="deroule" className="section-compact">
        <div className="shell">
          <SectionLabel index="03">Déroulé</SectionLabel>
          <h2 id="deroule" className="type-headline text-title mt-8">
            Du code <Accent>à la scène</Accent>
          </h2>
          <ol className="mt-14 grid border-t border-rule lg:grid-cols-3">
            {timeline.map((step, i) => (
              <li key={step.what} className={`flex flex-col gap-5 border-b border-rule py-10 lg:pr-10 ${i > 0 ? "lg:border-l lg:pl-10" : ""}`}>
                <span className="type-label">Étape {i + 1}</span>
                <p className="type-meta">{step.when ?? <Pending label="Date" />}</p>
                <div className="mt-auto">
                  <h3 className="type-headline text-heading">{step.what}</h3>
                  <p className="mt-3 text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl">
            <span className="type-label block">Présentation finale</span>
            <span className="mt-2 block text-lead">
              {HACKATHON.pitchFormat.presentation}, puis {HACKATHON.pitchFormat.questions}.
            </span>
          </p>
        </div>
      </Section>

      {/* Criteria / jury / rewards */}
      <Section tone="paper" aria-labelledby="evaluation" className="section-compact">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionLabel index="04">Évaluation</SectionLabel>
            <h2 id="evaluation" className="type-headline text-title mt-8">
              Six critères
            </h2>
            <ol className="mt-10 border-b border-rule-strong">
              {CRITERIA.map((c, i) => (
                <li key={c} className="grid grid-cols-[3rem_1fr] border-t border-rule-strong py-4">
                  <span className="type-meta pt-1 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-body font-semibold">{c}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="col-span-4 space-y-14 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div>
              <h3 className="type-headline text-heading">Jury</h3>
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
              <h3 className="type-headline text-heading">Récompenses</h3>
              <p className="mt-3 text-muted">Les meilleures équipes bénéficieront :</p>
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
      </Section>

      {/* Registration — orange band */}
      <Section tone="signal" aria-labelledby="inscription" className="section-compact">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionLabel index="05">Inscription</SectionLabel>
            <h2 id="inscription" className="type-headline text-title mt-8">
              Chaque membre prend <Accent>son pass</Accent>
            </h2>
          </div>
          <div className="col-span-4 space-y-6 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-muted">
              L’inscription est libre. Chaque membre de l’équipe prend son Pass Hackathon ({formatFCFA(PASSES.hackathon.price)}).
              Il donne accès uniquement au hackathon : pour suivre aussi les conférences, formations et ateliers, ajoutez le
              Pass Event dans la même commande.
            </p>
            <dl className="grid grid-cols-2 gap-6 border-t border-rule-strong pt-5">
              <div>
                <dt className="type-label">Date limite</dt>
                <dd className="mt-1.5">
                  {s.registrationDeadline ? dateFr.format(new Date(s.registrationDeadline)) : <Pending label="Date limite" />}
                </dd>
              </div>
              <div>
                <dt className="type-label">Places</dt>
                <dd className="mt-1.5">{s.quota ?? <Pending label="Nombre de places" />}</dd>
              </div>
            </dl>
            <ButtonLink href="/billetterie?pass=hackathon" arrow>
              Prendre mon Pass Hackathon
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
