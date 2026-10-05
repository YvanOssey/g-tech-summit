import type { Metadata } from "next";
import { PASSES } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { CRITERIA, ELIGIBLE, HACKATHON, REWARDS, RULES, TRACKS } from "@/content/hackathon";
import { RuleChecklist } from "@/components/hackathon/RuleChecklist";
import { HackathonSteps } from "@/components/home/HackathonSteps";
import { PageIntro } from "@/components/layout/PageIntro";
import { Marquee } from "@/components/motion/Marquee";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
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

  return (
    <>
      <PageIntro
        label={`${HACKATHON.name} · ${HACKATHON.edition}`}
        title="Construire en équipe, pitcher sur scène"
        lines={["Construire en équipe,", <span key="p"><Accent>pitcher</Accent> sur scène.</span>]}
        lead={<>Thème : «&nbsp;{HACKATHON.theme}&nbsp;».</>}
        actions={
          <>
            <ButtonLink href="/billetterie?pass=hackathon" arrow>
              Voir le Pass Hackathon
            </ButtonLink>
            <ButtonLink href="#thematiques" variant="link" arrow>
              Les thématiques
            </ButtonLink>
          </>
        }
      />

      {/* ── Key facts ────────────────────────────────────────────────── */}
      <Section tone="signal" aria-label="L’essentiel">
        <dl className="shell grid grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Participation", v: "En équipe uniquement" },
            { k: "Taille des équipes", v: s.teamSize ? `${s.teamSize.min} à ${s.teamSize.max} personnes` : null },
            { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} / personne` },
            { k: "Date limite", v: s.registrationDeadline ? dateFr.format(new Date(s.registrationDeadline)) : null },
          ].map((item, i) => (
            <div key={item.k} className={`py-8 pr-4 ${i % 2 ? "border-l border-rule pl-4" : ""} ${i > 0 ? "lg:border-l lg:border-rule lg:pl-6" : ""} ${i >= 2 ? "border-t border-rule lg:border-t-0" : ""}`}>
              <dt className="type-label">{item.k}</dt>
              <dd className="type-headline mt-2 text-heading leading-tight">{item.v ?? <Pending label={item.k} />}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Tracks: rows that open on hover ──────────────────────────── */}
      <Section tone="ink" id="thematiques" aria-labelledby="titre-thematiques" className="section-standard">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="01">Thématiques officielles</SectionLabel>
              <RevealText
                inView
                id="titre-thematiques"
                label="Quatre défis, une seule thématique par équipe."
                lines={["Quatre défis,", <span key="u">une seule <Accent>par équipe</Accent>.</span>]}
                className="type-headline text-title mt-8"
              />
            </div>
            <p className="max-w-sm text-muted">Une solution à une problématique réelle, en Côte d’Ivoire ou en Afrique.</p>
          </div>

          <SpotlightGroup>
            <RevealGroup as="ol" className="mt-14 grid gap-3 md:grid-cols-2 lg:gap-4">
              {TRACKS.map((t) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={t.code}
                  className="group panel spotlight relative flex min-h-72 flex-col overflow-hidden rounded-object p-6 transition-colors duration-(--duration-component) hover:border-signal sm:p-8"
                >
                  {/* Orange fill rising on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-signal transition-transform duration-(--duration-component) ease-out-quart group-hover:scale-y-100"
                  />
                  <span
                    aria-hidden="true"
                    className="text-outline type-condensed pointer-events-none absolute -right-3 -bottom-10 text-[12rem] leading-none transition-opacity duration-(--duration-component) group-hover:opacity-0"
                  >
                    {t.code}
                  </span>
                  <div className="relative flex h-full flex-col transition-colors duration-(--duration-component) group-hover:text-ink">
                    <span className="type-condensed text-title leading-none text-signal transition-colors group-hover:text-ink">{t.code}</span>
                    <h3 className="type-headline mt-8 text-title leading-none">{t.name}</h3>
                    <p className="mt-3 font-semibold">{t.claim}</p>
                    <p className="mt-auto max-w-md pt-6 text-muted transition-colors group-hover:text-ink">{t.description}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Who: moving band of profiles + rules checklist ────────────── */}
      <Section tone="stone" aria-labelledby="qui" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="02">Qui peut participer</SectionLabel>
          <RevealText
            inView
            id="qui"
            label="Ouvert à tous les profils."
            lines={["Ouvert à tous", <span key="p">les <Accent>profils</Accent>.</span>]}
            className="type-headline text-title mt-8"
          />
        </div>
        <Marquee
          label="Profils attendus"
          duration={32}
          className="mt-12 border-y border-rule-strong py-6"
          items={ELIGIBLE.map((e) => (
            <span key={e} className="type-headline flex items-center gap-6 px-6 text-heading">
              {e} <span aria-hidden="true" className="size-2.5 rotate-45 bg-signal" />
            </span>
          ))}
        />
        <div className="shell grid-12 mt-16 gap-y-8">
          <h3 className="type-headline col-span-4 text-heading md:col-span-8 lg:col-span-4">Règles de participation</h3>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <RuleChecklist rules={RULES} />
          </div>
        </div>
      </Section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <Section tone="ink" aria-labelledby="deroule" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="03">Déroulé</SectionLabel>
          <RevealText
            inView
            id="deroule"
            label="Du code à la scène."
            lines={["Du code", <span key="s"><Accent>à la scène</Accent>.</span>]}
            className="type-headline text-title mt-8"
          />
          <p className="mt-6 max-w-xl text-muted">
            Début officiel des challenges : {s.challengesStart ? dateFr.format(new Date(s.challengesStart)) : <Pending label="Date" />}
          </p>
          <HackathonSteps className="mt-14" />
        </div>
      </Section>

      {/* ── Evaluation: six criteria tiles + jury + rewards ───────────── */}
      <Section tone="paper" aria-labelledby="evaluation" className="sheet section-standard">
        <div className="shell">
          <SectionLabel index="04">Évaluation</SectionLabel>
          <RevealText
            inView
            id="evaluation"
            label="Six critères pour départager."
            lines={["Six critères", <span key="d">pour <Accent>départager</Accent>.</span>]}
            className="type-headline text-title mt-8"
          />
          <SpotlightGroup>
            <RevealGroup as="ol" className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
              {CRITERIA.map((c, i) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={c}
                  className="panel card-interactive spotlight flex min-h-40 flex-col justify-between rounded-object p-5 sm:p-6"
                >
                  <span className="card-index type-condensed text-title leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="type-headline mt-6 text-body leading-tight sm:text-lead">{c}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>

          <div className="grid-12 mt-16 gap-y-12">
            <div className="col-span-4 md:col-span-4 lg:col-span-5">
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
            <div className="col-span-4 md:col-span-4 lg:col-span-6 lg:col-start-7">
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

      {/* ── Registration — orange band ───────────────────────────────── */}
      <Section tone="signal" aria-labelledby="inscription" className="sheet section-standard">
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
              Voir le Pass Hackathon
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
