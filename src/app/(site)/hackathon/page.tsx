import type { Metadata } from "next";
import { PASSES, TRACK_CAPACITY } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { CRITERIA, ELIGIBLE, HACKATHON, PRIZES, PRIZES_TOTAL, RULES, TRACKS } from "@/content/hackathon";
import { RuleChecklist } from "@/components/hackathon/RuleChecklist";
import { HackathonSteps } from "@/components/home/HackathonSteps";
import { PageIntro } from "@/components/layout/PageIntro";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { SpotlightGroup } from "@/components/motion/Spotlight";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Lock, Medal, SignalSquare, Trophy } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatFCFA } from "@/lib/format";

export const metadata: Metadata = {
  title: "Hackathon",
  description: `Hackathon Ghostech, 2ᵉ édition : 2 thématiques, participation en équipe, finale le 19 décembre 2026 à Abidjan. Thème : ${HACKATHON.theme}.`,
};

const dateFr = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Prizes grouped by category, in the order they are declared. */
const prizeGroups = [...new Set(PRIZES.map((p) => p.category))].map(
  (category) => ({
    category,
    prizes: PRIZES.filter((p) => p.category === category),
  }),
);

export default async function HackathonPage() {
  const settings = await getEventSettings();
  const s = settings.hackathon;
  // "Informations à venir" (admin → Paramètres): when off, anything not confirmed yet is left out.
  const show = settings.showUpcoming;

  const facts: { k: string; v: string | null }[] = [
    { k: "Participation", v: "En équipe uniquement" },
    {
      k: "Taille des équipes",
      v: s.teamSize
        ? s.teamSize.min === s.teamSize.max
          ? `${s.teamSize.min} personnes`
          : `${s.teamSize.min} à ${s.teamSize.max} personnes`
        : null,
    },
    { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} / équipe` },
    {
      k: "Date limite",
      v: s.registrationDeadline
        ? dateFr.format(new Date(s.registrationDeadline))
        : null,
    },
  ].filter((item) => show || item.v !== null);
  const factColumns: Record<number, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return (
    <>
      <PageIntro
        label={`${HACKATHON.name} · ${HACKATHON.edition}`}
        title="Construire en équipe, pitcher sur scène"
        lines={[
          "Construire en équipe,",
          <span key="p">
            <Accent>pitcher</Accent> sur scène.
          </span>,
        ]}
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
        <dl className={`shell grid grid-cols-2 ${factColumns[facts.length]}`}>
          {facts.map((item, i) => (
            <div
              key={item.k}
              className={`py-8 pr-4 ${i % 2 ? "border-l border-rule pl-4" : ""} ${i > 0 ? "lg:border-l lg:border-rule lg:pl-6" : ""} ${i >= 2 ? "border-t border-rule lg:border-t-0" : ""}`}
            >
              <dt className="type-label">{item.k}</dt>
              <dd className="type-headline mt-2 text-heading leading-tight">
                {item.v ?? <Pending label={item.k} />}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── Tracks: rows that open on hover ──────────────────────────── */}
      <Section
        tone="ink"
        id="thematiques"
        aria-labelledby="titre-thematiques"
        className="section-standard"
      >
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="01">Thématiques officielles</SectionLabel>
              <RevealText
                inView
                id="titre-thematiques"
                label="Deux défis, une seule thématique par équipe."
                lines={[
                  "Deux défis,",
                  <span key="u">
                    une seule <Accent>par équipe</Accent>.
                  </span>,
                ]}
                className="type-headline text-title mt-8"
              />
            </div>
            <p className="max-w-sm text-muted">
              Une solution à une problématique réelle, en Côte d’Ivoire ou en
              Afrique.
            </p>
          </div>

          <SpotlightGroup>
            <RevealGroup
              as="ol"
              className="mt-14 grid gap-3 md:grid-cols-2 lg:gap-4"
            >
              {TRACKS.map((t) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={t.code}
                  className="group panel spotlight relative flex min-h-72 flex-col overflow-hidden p-6 transition-colors duration-(--duration-component) hover:border-signal sm:p-8"
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
                    <span className="type-condensed text-title leading-none text-signal transition-colors group-hover:text-ink">
                      {t.code}
                    </span>
                    <h3 className="type-headline mt-8 text-title leading-none">
                      {t.name}
                    </h3>
                    <p className="mt-3 font-semibold">{t.claim}</p>
                    <p className="mt-auto max-w-md pt-6 text-muted transition-colors group-hover:text-ink">
                      {t.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Who: moving band of profiles + rules checklist ────────────── */}
      <Section
        tone="stone"
        aria-labelledby="qui"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="02">Qui peut participer</SectionLabel>
          <RevealText
            inView
            id="qui"
            label="Ouvert à tous les profils."
            lines={[
              "Ouvert à tous",
              <span key="p">
                les <Accent>profils</Accent>.
              </span>,
            ]}
            className="type-headline text-title mt-8"
          />
        </div>
        <Marquee
          label="Profils attendus"
          duration={32}
          className="mt-12 border-y border-rule-strong py-6"
          items={ELIGIBLE.map((e) => (
            <span
              key={e}
              className="type-headline flex items-center gap-6 px-6 text-heading"
            >
              {e}{" "}
              <span
                aria-hidden="true"
                className="size-2.5 rotate-45 bg-signal"
              />
            </span>
          ))}
        />
        <div className="shell grid-12 mt-16 gap-y-8">
          <h3 className="type-headline col-span-4 text-heading md:col-span-8 lg:col-span-4">
            Règles de participation
          </h3>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <RuleChecklist rules={RULES} />
          </div>
        </div>
      </Section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <Section
        tone="ink"
        aria-labelledby="deroule"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="03">Déroulé</SectionLabel>
          <RevealText
            inView
            id="deroule"
            label="Du code à la scène."
            lines={[
              "Du code",
              <span key="s">
                <Accent>à la scène</Accent>.
              </span>,
            ]}
            className="type-headline text-title mt-8"
          />
          {(show || s.challengesStart) && (
            <p className="mt-6 max-w-xl text-muted">
              Début officiel des challenges :{" "}
              {s.challengesStart ? (
                dateFr.format(new Date(s.challengesStart))
              ) : (
                <Pending label="Date" />
              )}
            </p>
          )}
          <HackathonSteps
            className="mt-14"
            headingLevel={3}
            showUpcoming={show}
          />
        </div>
      </Section>

      {/* ── Evaluation: six criteria tiles + jury + rewards ───────────── */}
      <Section
        tone="paper"
        aria-labelledby="evaluation"
        className="sheet section-standard"
      >
        <div className="shell">
          <SectionLabel index="04">Évaluation</SectionLabel>
          <RevealText
            inView
            id="evaluation"
            label="Six critères pour départager."
            lines={[
              "Six critères",
              <span key="d">
                pour <Accent>départager</Accent>.
              </span>,
            ]}
            className="type-headline text-title mt-8"
          />
          <SpotlightGroup>
            <RevealGroup
              as="ol"
              className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4"
            >
              {CRITERIA.map((c, i) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={c}
                  className="panel card-interactive spotlight flex min-h-40 flex-col justify-between p-5 sm:p-6"
                >
                  <span className="card-index type-condensed text-title leading-none text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-headline mt-6 text-body leading-tight sm:text-lead">
                    {c}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>
        </div>
      </Section>

      {/* ── Prizes: cash prizes and perks per Cup ────────────────────── */}
      <Section
        tone="ink"
        id="recompenses"
        aria-labelledby="titre-recompenses"
        className="sheet section-standard"
      >
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel index="05">Récompenses</SectionLabel>
              <RevealText
                inView
                id="titre-recompenses"
                label={`${formatFCFA(PRIZES_TOTAL.amount)} de prix.`}
                lines={[
                  formatFCFA(PRIZES_TOTAL.amount),
                  <span key="p">
                    de <Accent>prix</Accent>.
                  </span>,
                ]}
                className="type-headline text-title mt-8"
              />
            </div>
            <p className="max-w-sm text-muted">
              Deux prix par Cup, soit {PRIZES_TOTAL.winners} équipes lauréates.
            </p>
          </div>

          <SpotlightGroup>
            <RevealGroup
              as="ul"
              className="mt-12 grid gap-3 md:grid-cols-2 lg:gap-4"
            >
              {prizeGroups.map((g) => (
                <RevealItem
                  as="li"
                  effect="flip"
                  key={g.category}
                  className="panel spotlight flex flex-col p-6 sm:p-8"
                >
                  <h3 className="type-headline text-heading leading-tight">
                    {g.category}
                  </h3>
                  <ol className="mt-8 border-t border-rule-strong">
                    {g.prizes.map((p, i) => (
                      <li key={p.rank} className="border-b border-rule-strong py-5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="type-label flex items-center gap-3">
                            {i === 0 ? <Trophy className="size-10 text-accent" /> : <Medal className="size-8 text-muted" />}
                            {p.rank}
                          </span>
                          <span className={`type-condensed whitespace-nowrap leading-none ${i === 0 ? "text-title text-accent" : "text-heading"}`}>
                            {formatFCFA(p.amount)}
                          </span>
                        </div>
                        <ul className="mt-5 space-y-2 text-small text-muted">
                          {p.perks.map((perk) => (
                            <li key={perk} className="flex gap-3">
                              <SignalSquare className="mt-1.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </RevealItem>
              ))}
            </RevealGroup>
          </SpotlightGroup>

          <Reveal className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-signal p-6 text-ink sm:p-8 lg:mt-4">
            <p className="type-headline text-heading leading-tight">
              Total · {PRIZES_TOTAL.winners} équipes lauréates
            </p>
            <p className="type-condensed whitespace-nowrap text-title leading-none">
              {formatFCFA(PRIZES_TOTAL.amount)}
            </p>
          </Reveal>

          {/* Partner rewards (Simplon, Genius Pay): not revealed yet, always shown frozen and greyed out. */}
          <Reveal className="mt-3 lg:mt-4">
            <div
              aria-disabled="true"
              className="panel flex select-none flex-wrap items-center justify-between gap-x-6 gap-y-3 p-6 opacity-50 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <Lock className="size-8 text-muted" />
                <div>
                  <h3 className="type-headline text-heading leading-tight text-muted">
                    Récompenses partenaires
                  </h3>
                  <p className="mt-1 text-small text-muted">
                    Simplon · Genius Pay · H-Electro · Centre Ivoirien de Robotique
                  </p>
                </div>
              </div>
              <Pending label="Récompenses partenaires">
                À découvrir bientôt
              </Pending>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Registration — orange band ───────────────────────────────── */}
      <Section
        tone="signal"
        aria-labelledby="inscription"
        className="sheet section-standard"
      >
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <SectionLabel index="06">Inscription</SectionLabel>
            <h2 id="inscription" className="type-headline text-title mt-8">
              Un pass <Accent>par équipe</Accent>
            </h2>
          </div>
          <div className="col-span-4 space-y-6 self-end md:col-span-6 lg:col-span-5 lg:col-start-8">
            <p className="text-muted">
              L’inscription est libre. L’équipe prend un seul Pass Hackathon (
              {formatFCFA(PASSES.hackathon.price)}),{" "}
              {PASSES.hackathon.capacity.total} équipes au maximum, soit{" "}
              {TRACK_CAPACITY["01"]} par Cup. Il donne aussi à chacun des 5
              membres l’accès sur place à l’événement : conférences, formations
              et ateliers compris. Inutile de prendre un Pass Présentiel en
              plus.
            </p>
            <dl className="grid grid-cols-2 gap-6 border-t border-rule-strong pt-5">
              {(show || s.registrationDeadline) && (
                <div>
                  <dt className="type-label">Date limite</dt>
                  <dd className="mt-1.5">
                    {s.registrationDeadline ? (
                      dateFr.format(new Date(s.registrationDeadline))
                    ) : (
                      <Pending label="Date limite" />
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt className="type-label">Équipes</dt>
                <dd className="mt-1.5">
                  {TRACKS.map((t) => (
                    <span key={t.code} className="block">
                      {t.name} : {settings.soldByTrack[t.code] ?? 0} /{" "}
                      {TRACK_CAPACITY[t.code]}
                    </span>
                  ))}
                </dd>
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