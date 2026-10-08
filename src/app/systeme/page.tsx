import type { Metadata } from "next";
import Image from "next/image";
import { EVENT } from "@/config/event";
import { PARTNERS } from "@/config/partners";
import { PASSES } from "@/config/passes";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { RevealText } from "@/components/motion/RevealText";
import { PassCard } from "@/components/ticket/PassCard";
import { PassSelector } from "@/components/ticket/PassSelector";
import { TicketSpecimen } from "@/components/ticket/TicketSpecimen";
import { Button } from "@/components/ui/Button";
import { Pending } from "@/components/ui/Pending";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SignalSquare } from "@/components/ui/icons";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = {
  title: "Système de design",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  { name: "Ink", token: "ink", hex: "#171717", role: "Texte, fonds forts", className: "bg-ink text-paper" },
  { name: "Paper", token: "paper", hex: "#FFFDF8", role: "Fond principal", className: "bg-paper text-ink ring-1 ring-inset ring-stone" },
  { name: "Signal", token: "signal", hex: "#F28C18", role: "Action, rupture hackathon, repère", className: "bg-signal text-ink" },
  { name: "Grey", token: "grey", hex: "#6B6B6B", role: "Texte secondaire sur paper", className: "bg-grey text-paper" },
  { name: "Stone", token: "stone", hex: "#E8E5DF", role: "Fond secondaire, filets", className: "bg-stone text-ink" },
] as const;

/** Accessibility derivatives — only where the palette fails AA. */
const DERIVED = [
  { token: "mist", hex: "#9C9A94", role: "Texte secondaire sur ink", className: "bg-mist text-ink" },
  { token: "smoke", hex: "#5E5C58", role: "Texte secondaire sur stone", className: "bg-smoke text-paper" },
  { token: "signal-text", hex: "#A65A00", role: "Orange en texte sur paper", className: "bg-signal-text text-paper" },
  { token: "umber", hex: "#432E17", role: "Texte secondaire sur signal", className: "bg-umber text-paper" },
  { token: "graphite", hex: "#3A3A38", role: "Filets sur ink", className: "bg-graphite text-paper" },
] as const;

const CONTRASTS = [
  { pair: "Ink sur paper", ratio: "17,6 : 1", ok: true },
  { pair: "Ink sur signal (bouton)", ratio: "7,3 : 1", ok: true },
  { pair: "Signal sur ink", ratio: "7,3 : 1", ok: true },
  { pair: "Grey sur paper", ratio: "5,2 : 1", ok: true },
  { pair: "Signal-text sur paper", ratio: "5,0 : 1", ok: true },
  { pair: "Mist sur ink", ratio: "6,5 : 1", ok: true },
  { pair: "Smoke sur stone", ratio: "5,3 : 1", ok: true },
  { pair: "Umber sur signal", ratio: "5,1 : 1", ok: true },
  { pair: "Grey sur stone", ratio: "4,2 : 1", ok: false, note: "utiliser smoke" },
  { pair: "Grey sur ink", ratio: "3,4 : 1", ok: false, note: "utiliser mist" },
  { pair: "Signal sur paper", ratio: "2,4 : 1", ok: false, note: "jamais pour du texte" },
  { pair: "Paper sur signal", ratio: "2,4 : 1", ok: false, note: "proscrit" },
];

const TYPE_SCALE = [
  { name: "Poster", spec: "Archivo condensé 800 · 64 → 208 px · chiffres uniquement", className: "type-condensed text-poster", sample: "18—19" },
  { name: "Display", spec: "Archivo 700 · 44 → 96 px · titres de page", className: "type-headline text-display", sample: "G-TECH SUMMIT 2026" },
  { name: "Title", spec: "Archivo 700 · 32 → 64 px · titres de section", className: "type-headline text-title", sample: "Le programme" },
  { name: "Heading", spec: "Archivo 700 · 24 → 32 px · titres de bloc", className: "type-headline text-heading", sample: "Formations express" },
  { name: "Lead", spec: "Archivo 400 · 20 → 24 px", className: "text-lead", sample: "Conférences, panels, formations, ateliers et un hackathon, organisés par Ghostech." },
  { name: "Body", spec: "Archivo 400 · 17 px / 1,6", className: "text-body max-w-[62ch]", sample: "Accessibles aux débutants comme aux initiés, les formations express durent trois heures et donnent lieu à une attestation de participation." },
  { name: "Small", spec: "Archivo 400 · 14 px", className: "text-small", sample: "Par personne. Participation en équipe, une thématique par équipe." },
  { name: "Caption", spec: "IBM Plex Mono 400 · 12 px · codes et références", className: "type-meta", sample: "Ven. 18.12 · 09:45 · Conférence 1" },
];

const MOTION_YES = [
  "Révélation typographique des grands titres, une seule fois",
  "Total qui défile quand on change de pass",
  "Bande orange qui se trace quand un pass est sélectionné",
  "Transitions directionnelles entre les étapes d’inscription",
  "Survols courts : flèche qui avance, soulignement qui s’allume",
];

const MOTION_NO = [
  "Fondu sur chaque élément au défilement",
  "Parallaxe, défilement détourné, boucles permanentes",
  "Glow, flou, ombres portées, dégradés",
  "Animations qui retardent la lecture d’une information",
  "Tout mouvement quand « réduire les animations » est actif",
];

/** Team reference only (audit F-16): signed-in admins, like the back office. */
export default async function DesignSystemPage() {
  await requireAdmin();

  return (
    <main className="pb-32">
      {/* ── Opening poster ─────────────────────────────────────── */}
      <header className="shell pt-6">
        <div className="type-meta flex flex-wrap items-center justify-between gap-4 border-b border-ink pb-4">
          <GhostechLogo width={88} />
          <span className="text-grey">Système de design · v0.1 · document interne</span>
        </div>

        <RevealText
          as="h1"
          lines={["G-Tech", "Summit 2026"]}
          className="type-condensed text-poster mt-10 md:mt-16"
        />

        <div className="grid-12 mt-10 gap-y-6 border-t border-ink pt-5 md:mt-14">
          <p className="type-meta col-span-4 md:col-span-3">
            {EVENT.days[0].label.replace(" 2026", "")}
            <br />
            {EVENT.days[1].label}
            <br />
            {EVENT.city}, {EVENT.country}
          </p>
          <p className="text-lead col-span-4 md:col-span-5 lg:col-span-6 lg:col-start-5">
            {EVENT.organiser.tagline}
          </p>
        </div>
      </header>

      {/* ── 01 Colours ─────────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="couleurs">
        <SectionLabel index="01">Couleurs</SectionLabel>
        <div className="grid-12 mt-8 gap-y-10">
          <div className="col-span-4 md:col-span-3">
            <h2 id="couleurs" className="type-condensed text-heading">
              Peu de couleurs, bien utilisées
            </h2>
            <p className="mt-4 text-grey">
              L’orange est un signal : il désigne une action, un état actif ou une donnée clé. Il n’occupe jamais une
              surface de fond. Aucun bleu, cyan ou violet n’existe dans le projet.
            </p>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            {/* Usage proportion */}
            <div className="flex h-10 w-full" role="img" aria-label="Proportions d’usage : blanc cassé 62 %, noir 28 %, gris 8 %, orange 2 %">
              <div className="w-[62%] bg-paper ring-1 ring-inset ring-stone" />
              <div className="w-[28%] bg-ink" />
              <div className="w-[8%] bg-mist" />
              <div className="w-[2%] bg-signal" />
            </div>
            <p className="type-meta mt-2 text-grey">Proportions d’usage visées — 62 / 28 / 8 / 2</p>

            <ul className="mt-8 grid grid-cols-2 gap-px bg-stone ring-1 ring-stone sm:grid-cols-5">
              {SWATCHES.map((s) => (
                <li key={s.token} className="bg-paper">
                  <div className={`flex aspect-[4/3] items-end p-3 ${s.className}`}>
                    <span className="type-meta">{s.hex}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-small leading-snug text-grey">{s.role}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="type-meta mt-8 text-grey">Teintes d’accessibilité dérivées</p>
            <ul className="mt-3 grid grid-cols-2 gap-px bg-stone ring-1 ring-stone sm:grid-cols-5">
              {DERIVED.map((s) => (
                <li key={s.token} className="bg-paper">
                  <div className={`flex aspect-[4/3] items-end p-3 ${s.className}`}>
                    <span className="type-meta">{s.hex}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{s.token}</p>
                    <p className="text-small leading-snug text-grey">{s.role}</p>
                  </div>
                </li>
              ))}
            </ul>

            <table className="mt-10 w-full text-left text-small">
              <caption className="type-meta mb-3 text-left text-grey">Contrastes (WCAG 2.2)</caption>
              <tbody>
                {CONTRASTS.map((c) => (
                  <tr key={c.pair} className="border-t border-stone">
                    <td className="py-2.5 pr-4">{c.pair}</td>
                    <td className="type-meta py-2.5 pr-4 whitespace-nowrap">{c.ratio}</td>
                    <td className={`py-2.5 text-right ${c.ok ? "font-semibold" : "text-grey"}`}>
                      {c.ok ? "AA" : `Échec — ${c.note}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 02 Typography ──────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="typo">
        <SectionLabel index="02">Typographie</SectionLabel>
        <div className="grid-12 mt-8">
          <div className="col-span-4 md:col-span-3">
            <h2 id="typo" className="type-condensed text-heading">
              Une famille, deux largeurs, une voix technique
            </h2>
            <p className="mt-4 text-grey">
              Archivo porte tout : condensée et grasse pour l’affiche, normale pour la lecture. IBM Plex Mono
              signe les métadonnées — dates, horaires, salles, références.
            </p>
          </div>
        </div>

        <ol className="mt-12">
          {TYPE_SCALE.map((t) => (
            <li key={t.name} className="grid-12 gap-y-3 border-t border-stone py-6">
              <div className="col-span-4 md:col-span-2 lg:col-span-3">
                <p className="type-meta">{t.name}</p>
                <p className="type-meta mt-1 text-grey normal-case tracking-normal">{t.spec}</p>
              </div>
              <p className={`col-span-4 min-w-0 break-words md:col-span-6 lg:col-span-9 ${t.className}`}>{t.sample}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 03 Grid ────────────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="grille">
        <SectionLabel index="03">Grille</SectionLabel>
        <div className="grid-12 mt-8">
          <div className="col-span-4 md:col-span-4">
            <h2 id="grille" className="type-condensed text-heading">
              4 · 8 · 12 colonnes
            </h2>
            <p className="mt-4 text-grey">
              Mobile 4 colonnes, tablette 8, desktop 12. Marges de 16, 24 puis 40 px. Les filets d’un pixel
              rendent la structure visible, comme sur une signalétique.
            </p>
          </div>
        </div>
        <div className="grid-12 mt-10 h-40" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`type-meta flex items-start justify-center border-x border-signal/40 bg-signal/10 pt-2 text-signal-text ${
                i >= 4 ? "hidden md:flex" : ""
              } ${i >= 8 ? "md:hidden lg:flex" : ""}`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 Actions ─────────────────────────────────────────── */}
      <section className="mt-32" aria-labelledby="actions">
        <div className="shell">
          <SectionLabel index="04">Actions</SectionLabel>
          <h2 id="actions" className="type-condensed text-heading mt-8 max-w-xl">
            Une action principale par écran
          </h2>
        </div>

        <div className="shell mt-10 grid gap-px bg-ink md:grid-cols-2">
          <div className="flex flex-col gap-6 bg-paper p-8 ring-1 ring-inset ring-ink">
            <p className="type-meta text-grey">Sur fond clair</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button arrow>Prendre mon pass</Button>
              <Button variant="link">Voir le programme</Button>
              <Button variant="link">Lire le règlement</Button>
            </div>
          </div>
          <div className="theme-ink flex flex-col gap-6 bg-canvas p-8 text-fg">
            <p className="type-meta text-mist">Sur fond noir</p>
            <div className="flex flex-wrap items-center gap-4">
              <Button arrow>
                S’inscrire au hackathon
              </Button>
              <Button variant="link">
                Les thématiques
              </Button>
              <Button variant="link">
                Critères
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Pending states ──────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="etats">
        <SectionLabel index="05">Informations non confirmées</SectionLabel>
        <div className="grid-12 mt-8 gap-y-10">
          <div className="col-span-4 md:col-span-3">
            <h2 id="etats" className="type-condensed text-heading">
              Ne rien inventer
            </h2>
            <p className="mt-4 text-grey">
              Une information absente s’affiche comme telle. Le lieu, les intervenants, la taille des équipes ou
              la date limite apparaissent dès qu’ils sont saisis dans l’administration.
            </p>
          </div>
          <div className="col-span-4 space-y-8 md:col-span-5 md:col-start-4 lg:col-span-6 lg:col-start-5">
            <dl className="divide-y divide-stone border-y border-stone">
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-semibold">Lieu</dt>
                <dd>
                  <Pending label="Lieu" />
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-semibold">Date limite d’inscription au hackathon</dt>
                <dd>
                  <Pending label="Date limite" />
                </dd>
              </div>
            </dl>
            <Pending variant="block" label="Intervenants">
              Intervenants à confirmer
            </Pending>
          </div>
        </div>
      </section>

      {/* ── 06 Passes ──────────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="pass">
        <SectionLabel index="06">Pass</SectionLabel>
        <div className="grid-12 mt-8">
          <div className="col-span-4 md:col-span-5">
            <h2 id="pass" className="type-condensed text-heading">
              Le pass est un billet
            </h2>
            <p className="mt-4 text-grey">
              Pass En ligne et Présentiel sur papier, Pass Hackathon sur noir : ils se distinguent au premier regard, à
              l’écran comme à l’impression. Chaque billet porte sa jauge d’inscription (chiffres réels).
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-(--gutter)">
          <PassCard pass={PASSES.online} index={1} sold={0} />
          <PassCard pass={PASSES.event} index={2} sold={0} />
          <PassCard pass={PASSES.hackathon} index={3} sold={0} />
        </div>

        <div className="mt-20">
          <p className="type-meta mb-4 flex items-center gap-3">
            <SignalSquare /> Sélecteur — étape 1 de l’inscription (démonstration, aucune commande créée)
          </p>
          <PassSelector />
        </div>
      </section>

      {/* ── 07 Ticket ──────────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="billet">
        <SectionLabel index="07">Billet</SectionLabel>
        <div className="grid-12 mt-8">
          <div className="col-span-4 md:col-span-5">
            <h2 id="billet" className="type-condensed text-heading">
              Le billet envoyé par e-mail
            </h2>
            <p className="mt-4 text-grey">
              Nominatif, émis uniquement après confirmation réelle du paiement. Son QR code contient un jeton
              aléatoire, sans donnée personnelle ; chaque accès n’est validé qu’une fois par jour.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <TicketSpecimen passes={["event", "hackathon"]} />
        </div>
      </section>

      {/* ── 08 Logos ───────────────────────────────────────────── */}
      <section className="shell mt-32" aria-labelledby="logos">
        <SectionLabel index="08">Logos</SectionLabel>
        <div className="grid-12 mt-8 gap-y-10">
          <div className="col-span-4 md:col-span-3">
            <h2 id="logos" className="type-condensed text-heading">
              Organisateur & partenaires
            </h2>
            <p className="mt-4 text-grey">
              Chaque logo garde ses couleurs d’origine. Ils sont posés sur des cases neutres, alignés sur la grille.
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-9">
            <div className="flex items-center gap-6 border-y border-ink py-6">
              <GhostechLogo width={120} />
              <p className="type-meta text-grey">
                Organisé par {EVENT.organiser.name}
                <br />
                {EVENT.organiser.motto}
              </p>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-px bg-stone ring-1 ring-stone md:grid-cols-4">
              {PARTNERS.map((p) => (
                <li key={p.name} className="flex aspect-[3/2] items-center justify-center bg-paper p-6">
                  <Image
                    src={p.logo.src}
                    alt={p.name}
                    width={p.logo.width}
                    height={p.logo.height}
                    className="max-h-14 w-auto object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 09 Motion ──────────────────────────────────────────── */}
      <section className="theme-ink mt-32 bg-canvas py-24 text-fg" aria-labelledby="mouvement">
        <div className="shell">
          <SectionLabel index="09">Mouvement</SectionLabel>
          <RevealText
            inView
            lines={["Le mouvement", "sert le contenu"]}
            className="type-condensed text-title mt-10"
          />
          <div className="grid-12 mt-14 gap-y-10">
            <div className="col-span-4">
              <p className="type-meta text-signal">Oui</p>
              <ul className="mt-4 space-y-3">
                {MOTION_YES.map((m) => (
                  <li key={m} className="flex gap-3 border-t border-graphite pt-3">
                    <SignalSquare className="mt-2" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-4 md:col-start-5 lg:col-start-7">
              <p className="type-meta text-mist">Non</p>
              <ul className="mt-4 space-y-3 text-mist">
                {MOTION_NO.map((m) => (
                  <li key={m} className="border-t border-graphite pt-3">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="type-meta mt-14 text-mist">
            Durées — micro 180 ms · composant 320 ms · section 700–900 ms · courbe ease-out-quart
          </p>
        </div>
      </section>
    </main>
  );
}
