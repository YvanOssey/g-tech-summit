import Image from "next/image";
import Link from "next/link";
import { EVENT, whatsappUrl } from "@/config/event";
import { PARTNERS } from "@/config/partners";
import { PASSES, orderTotal } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { FAQ } from "@/content/faq";
import { HACKATHON, TRACKS } from "@/content/hackathon";
import { DAYS } from "@/content/programme";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { RevealText } from "@/components/motion/RevealText";
import { DaySchedule } from "@/components/programme/DaySchedule";
import { PassCard } from "@/components/ticket/PassCard";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { FaqList } from "@/components/ui/FaqList";
import { ArrowRight, SignalSquare } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { formatFCFA } from "@/lib/format";

const FORMATS = [
  { count: "3", name: "Conférences", text: "IA et avenir du travail, entrepreneuriat tech en Afrique, innovation numérique en Côte d’Ivoire.", href: "/programme#conferences" },
  { count: "2", name: "Panels", text: "Des débats entre intervenants aux profils complémentaires, nourris par les questions du public.", href: "/programme#panels" },
  { count: "4", name: "Formations express", text: "Trois heures de pratique et une attestation de participation : web, IA, design, personal branding.", href: "/programme#formations" },
  { count: "6", name: "Ateliers pratiques", text: "Des sessions courtes et concrètes : outils IA, Git, UI/UX, API REST, data, cybersécurité.", href: "/programme#ateliers" },
  { count: "—", name: "Stands & démos live", text: "Un espace d’exposition pour les startups, des démonstrations et un quiz tech avec des lots à gagner.", href: "/programme" },
  { count: "—", name: "Networking", text: "Étudiants, professionnels, startups et recruteurs. Un cocktail clôt chacune des deux journées.", href: "/programme" },
] as const;

const PROFILES = [
  { who: "Vous découvrez la tech", what: "Initiation au développement web sans prérequis, introduction à l’IA, ateliers de découverte des outils IA." },
  { who: "Étudiants", what: "Des formations avec attestation, et des rencontres avec des professionnels, des startups et des recruteurs." },
  { who: "Développeurs", what: "Ateliers Git & GitHub, API REST avec Node.js, data visualisation avec Python — et le hackathon." },
  { who: "Designers", what: "Formation design graphique avec Canva & Figma, atelier UI/UX, et une place dans une équipe du hackathon." },
  { who: "Entrepreneurs & startups", what: "Une conférence sur l’entrepreneuriat tech en Afrique, un espace d’exposition et des pitchs." },
  { who: "Professionnels & experts", what: "Conférences et panels sur l’IA, l’emploi, l’inclusion et le numérique ivoirien, et un réseau à rencontrer." },
] as const;

export default async function HomePage() {
  const settings = await getEventSettings();

  return (
    <>
      {/* ── Hero: what, when, where, how much ─────────────────────── */}
      <section className="shell pt-8 md:pt-12">
        <div className="type-meta flex items-center justify-between gap-4 text-grey-500">
          <span>
            {EVENT.edition} · Organisé par {EVENT.organiser.name}
          </span>
          <Countdown className="text-ink" />
        </div>

        <RevealText
          as="h1"
          lines={["G-Tech", "Summer 2026"]}
          className="type-condensed text-poster mt-6 md:mt-10"
        />

        <div className="grid-12 mt-10 gap-y-8 md:mt-14">
          <div className="col-span-4 md:col-span-3">
            <p className="type-condensed text-[clamp(3rem,2rem+4vw,5.5rem)] leading-[0.85]">
              18—19
              <span className="block text-[0.5em] leading-tight">Décembre 2026</span>
            </p>
            <p className="type-meta mt-3">
              {EVENT.city}, {EVENT.country}
            </p>
          </div>
          <div className="col-span-4 md:col-span-5 lg:col-span-6 lg:col-start-6">
            <p className="text-lead">
              Deux jours de conférences, de panels, de formations, d’ateliers et un hackathon autour d’un thème :{" "}
              <strong className="font-semibold">« {EVENT.theme} »</strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/billetterie" arrow>
                Prendre mon pass
              </ButtonLink>
              <ButtonLink href="/hackathon" variant="secondary">
                Le hackathon
              </ButtonLink>
            </div>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-ink md:mt-20 lg:grid-cols-4">
          {[
            { k: "Dates", v: <>Ven. 18 & sam. 19 déc.</> },
            {
              k: "Lieu",
              v: settings.venue ? settings.venue.name : <Pending label="Lieu" />,
            },
            { k: PASSES.event.name, v: formatFCFA(PASSES.event.price) },
            { k: PASSES.hackathon.name, v: <>{formatFCFA(PASSES.hackathon.price)} / pers.</> },
          ].map((item, i) => (
            <div
              key={item.k}
              className={`border-b border-ink py-4 pr-4 ${i % 2 === 1 ? "border-l pl-4" : ""} lg:border-b-0 ${
                i > 0 ? "lg:border-l lg:pl-6" : ""
              }`}
            >
              <dt className="type-meta text-grey-500">{item.k}</dt>
              <dd className="mt-1 font-semibold">{item.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 01 What it is ─────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="evenement">
        <SectionIndex index="01" label="L’événement" />
        <div className="grid-12 mt-10 gap-y-12">
          <h2
            id="evenement"
            className="col-span-4 text-[clamp(1.625rem,1.1rem+2.2vw,3rem)] leading-[1.1] font-medium tracking-[-0.015em] md:col-span-8 lg:col-span-9"
          >
            G-TECH SUMMER réunit à Abidjan étudiants, développeurs, designers, entrepreneurs et professionnels pour
            apprendre, échanger et construire.{" "}
            <span className="text-grey-500">
              Que vous découvriez la tech ou que vous y travailliez depuis des années, vous y trouverez de quoi
              progresser et des gens à rencontrer.
            </span>
          </h2>
          <div className="col-span-4 flex items-start gap-5 md:col-span-5 lg:col-span-4 lg:col-start-9">
            <GhostechLogo width={96} className="shrink-0" />
            <p className="text-[0.9375rem] text-grey-500">
              Organisé par <span className="text-ink">{EVENT.organiser.name}</span>, communauté tech fondée à
              l’Institut Universitaire d’Abidjan. Cette première édition marque aussi sa première année.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 What happens ───────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="au-programme">
        <SectionIndex index="02" label="Au programme" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="au-programme" className="type-condensed text-display">
            Ce qui vous attend
          </h2>
          <ButtonLink href="/programme" variant="tertiary" arrow>
            Programme détaillé
          </ButtonLink>
        </div>

        <ul className="mt-10 border-b border-ink">
          {FORMATS.map((f) => (
            <li key={f.name} className="border-t border-ink">
              <Link
                href={f.href}
                className="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 transition-colors duration-(--duration-micro) hover:bg-grey-50 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.3fr)_auto] md:gap-x-(--gutter) md:py-8"
              >
                <span className="type-condensed text-[clamp(2rem,1.5rem+2vw,3.5rem)] leading-none text-grey-500 group-hover:text-signal-ink">
                  {f.count}
                </span>
                <span className="type-condensed text-[clamp(1.5rem,1.1rem+1.5vw,2.5rem)] leading-none">{f.name}</span>
                <span className="col-span-3 col-start-2 row-start-2 text-grey-500 md:col-span-1 md:col-start-3 md:row-start-1">
                  {f.text}
                </span>
                <ArrowRight className="col-start-3 row-start-1 size-5 self-center transition-transform duration-(--duration-micro) ease-out-quart group-hover:translate-x-1 md:col-start-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 03 For whom ───────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="pour-qui">
        <SectionIndex index="03" label="Pour qui" />
        <div className="grid-12 mt-10 gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="pour-qui" className="type-condensed text-display">
              Quel que soit votre niveau
            </h2>
            <p className="mt-6 max-w-md text-grey-500">
              Aucun niveau technique n’est requis pour venir. Voici par où commencer selon votre profil.
            </p>
          </div>
          <ul className="col-span-4 grid gap-x-(--gutter) sm:grid-cols-2 md:col-span-8 lg:col-span-7 lg:col-start-6">
            {PROFILES.map((p) => (
              <li key={p.who} className="border-t border-ink pt-4 pb-8">
                <h3 className="flex items-center gap-3 text-[1.125rem] font-semibold">
                  <SignalSquare />
                  {p.who}
                </h3>
                <p className="mt-2 text-grey-500">{p.what}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 04 Hackathon ──────────────────────────────────────────── */}
      <section className="mt-28 bg-ink py-20 text-paper md:mt-40 md:py-28" aria-labelledby="hackathon">
        <div className="shell">
          <SectionIndex index="04" label={`${HACKATHON.name} · ${HACKATHON.edition}`} tone="dark" />
          <RevealText id="hackathon" inView as="h2" lines={["Hackathon"]} className="type-condensed mt-10 text-[clamp(3rem,15.5vw,16rem)] leading-[0.8]" />

          <div className="grid-12 mt-12 gap-y-14">
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <p className="text-lead">« {HACKATHON.theme} »</p>
              <p className="mt-6 text-grey-400">{HACKATHON.intro}</p>
              <dl className="mt-10 grid grid-cols-2 gap-px bg-grey-700">
                {[
                  { k: "Format", v: "En équipe uniquement" },
                  { k: "Finale", v: `Sam. 19 déc. · ${HACKATHON.finale.pitch.time}` },
                  { k: "Pitch", v: "4 min + 2 min de questions" },
                  { k: "Pass", v: `${formatFCFA(PASSES.hackathon.price)} / pers.` },
                ].map((item) => (
                  <div key={item.k} className="bg-ink py-4 pr-4 [&:nth-child(even)]:pl-4">
                    <dt className="type-meta text-grey-400">{item.k}</dt>
                    <dd className="mt-1 font-semibold">{item.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/hackathon" tone="dark" arrow>
                  Découvrir le hackathon
                </ButtonLink>
                <ButtonLink href="/billetterie?pass=hackathon" tone="dark" variant="secondary">
                  Pass Hackathon
                </ButtonLink>
              </div>
            </div>

            <ol className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
              <li className="type-meta pb-4 text-grey-400">4 thématiques — une par équipe</li>
              {TRACKS.map((t) => (
                <li key={t.code} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-grey-700 py-6">
                  <span className="type-meta pt-2 text-signal">{t.code}</span>
                  <div>
                    <h3 className="type-condensed text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-none">{t.name}</h3>
                    <p className="mt-2 text-grey-400">{t.claim}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 05 Two days ───────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="deux-jours">
        <SectionIndex index="05" label="Deux jours" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="deux-jours" className="type-condensed text-display">
            18 & 19 décembre
          </h2>
          <ButtonLink href="/programme" variant="tertiary" arrow>
            Voir le programme complet
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-(--gutter)">
          {DAYS.map((d) => (
            <div key={d.id}>
              <div className="flex items-baseline justify-between gap-4 border-t-4 border-ink pt-3">
                <h3 className="type-condensed text-title">{d.label}</h3>
                <span className="type-meta text-grey-500">Jour {d.index}</span>
              </div>
              <p className="mt-2 mb-6 text-grey-500">{d.theme}</p>
              <DaySchedule slots={d.slots} compact />
            </div>
          ))}
        </div>
      </section>

      {/* ── 06 Passes ─────────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="pass">
        <SectionIndex index="06" label="Billetterie" />
        <div className="grid-12 mt-10 gap-y-6">
          <h2 id="pass" className="type-condensed text-display col-span-4 md:col-span-8 lg:col-span-6">
            Deux pass
          </h2>
          <p className="col-span-4 self-end text-grey-500 md:col-span-6 lg:col-span-5 lg:col-start-8">
            Un billet nominatif par participant, envoyé par e-mail après paiement via Wave. Pour l’événement et le
            hackathon, prenez les deux : {formatFCFA(orderTotal(["event", "hackathon"]))}.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-(--gutter)">
          {(["event", "hackathon"] as const).map((id, i) => (
            <Link key={id} href={`/billetterie?pass=${id}`} className="group block">
              <PassCard pass={PASSES[id]} index={i + 1} className="transition-transform duration-(--duration-micro) ease-out-quart group-hover:-translate-y-1">
                <span className="flex size-11 items-center justify-center bg-signal text-ink">
                  <ArrowRight className="size-5 transition-transform duration-(--duration-micro) group-hover:translate-x-0.5" />
                  <span className="sr-only">Choisir le {PASSES[id].name}</span>
                </span>
              </PassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 07 Partners ───────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="partenaires">
        <SectionIndex index="07" label="Partenaires" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2 id="partenaires" className="type-condensed text-title">
            Ils accompagnent G-TECH SUMMER
          </h2>
          <ButtonLink href="/partenaires" variant="tertiary" arrow>
            Devenir partenaire
          </ButtonLink>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-px bg-grey-200 ring-1 ring-grey-200 md:grid-cols-4">
          {PARTNERS.map((p) => (
            <li key={p.name} className="flex aspect-[3/2] items-center justify-center bg-paper p-6 md:p-10">
              <Image src={p.logo.src} alt={p.name} width={p.logo.width} height={p.logo.height} className="max-h-14 w-auto object-contain" />
            </li>
          ))}
        </ul>
      </section>

      {/* ── 08 Practical ──────────────────────────────────────────── */}
      <section className="shell mt-28 md:mt-40" aria-labelledby="infos">
        <SectionIndex index="08" label="Infos pratiques" />
        <div className="grid-12 mt-10 gap-y-12">
          <div className="col-span-4 md:col-span-3">
            <h2 id="infos" className="type-condensed text-title">
              Questions fréquentes
            </h2>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="type-meta text-grey-500">Lieu</dt>
                <dd className="mt-1">{settings.venue ? settings.venue.name : <Pending label="Lieu" />}</dd>
              </div>
              <div>
                <dt className="type-meta text-grey-500">Accueil</dt>
                <dd className="mt-1">À partir de 08:00, les deux jours</dd>
              </div>
              <div>
                <dt className="type-meta text-grey-500">Contact</dt>
                <dd className="mt-1 space-y-1">
                  <a href={`mailto:${EVENT.contact.email}`} className="block break-words underline decoration-ink/30 underline-offset-4 hover:decoration-signal">
                    {EVENT.contact.email}
                  </a>
                  <a href={whatsappUrl} className="block underline decoration-ink/30 underline-offset-4 hover:decoration-signal">
                    WhatsApp {EVENT.contact.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 md:col-span-5 md:col-start-4 lg:col-span-7 lg:col-start-6">
            <FaqList items={FAQ.slice(0, 5)} />
            <div className="mt-6">
              <ButtonLink href="/infos-pratiques#faq" variant="tertiary" arrow>
                Toutes les questions
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing poster ────────────────────────────────────────── */}
      <section className="mt-28 bg-ink text-paper md:mt-40" aria-label="Inscription">
        <div className="shell grid-12 gap-y-10 py-16 md:py-24">
          <p className="type-condensed text-poster col-span-4 md:col-span-8 lg:col-span-8">18—19.12</p>
          <div className="col-span-4 flex flex-col justify-end gap-6 md:col-span-6 lg:col-span-4">
            <p className="text-lead">
              {EVENT.city}. {EVENT.organiser.tagline}
            </p>
            <ButtonLink href="/billetterie" tone="dark" arrow className="self-start">
              Prendre mon pass
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
