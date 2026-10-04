import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { EVENT } from "@/config/event";
import { PHOTOS } from "@/config/media";
import type { Venue } from "@/config/settings";
import { RevealText } from "@/components/motion/RevealText";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { TestBadge } from "@/components/ui/ImageFrame";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

const PROGRAMME_BAND = [
  { count: "3", label: "Conférences", href: "/programme#conferences" },
  { count: "2", label: "Panels", href: "/programme#panels" },
  { count: "4", label: "Formations express", href: "/programme#formations" },
  { count: "6", label: "Ateliers pratiques", href: "/programme#ateliers" },
  { count: "1", label: "Hackathon", href: "/hackathon" },
] as const;

/** Entrance delay for the staggered `.enter` animation (seconds). */
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Homepage hero. The event photograph fills the band; two flat veils keep the
 * text side dark (AA contrast) while the stage stays visible on the right.
 * Without a photo the band is plain ink and the composition still holds.
 */
export function HomeHero({ venue }: { venue: Venue | null }) {
  const photo = PHOTOS.hero;

  return (
    <Section tone="ink" className="relative isolate overflow-hidden">
      {photo && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="settle object-cover"
            style={{ objectPosition: photo.focus ?? "center" }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-ink/45" />
          {/* Text-side veil: flat, with a short soft edge — not a decorative gradient */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/75 lg:bg-ink/55 lg:[mask-image:linear-gradient(90deg,#000_0%,#000_48%,transparent_68%)]"
          />
          {photo.placeholder && <TestBadge className="absolute right-4 bottom-4 md:right-6 md:bottom-6" />}
        </div>
      )}

      <div className="shell grid-12 gap-y-10 pt-12 pb-12 md:pt-16 md:pb-16 lg:min-h-[min(46rem,calc(100svh-4rem-6rem))] lg:content-center">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <div className="enter" style={d(0)}>
            <SectionLabel>{`${EVENT.name} ${EVENT.year} · ${EVENT.edition}`}</SectionLabel>
          </div>
          <RevealText
            as="h1"
            label={EVENT.theme}
            delay={0.1}
            lines={[
              "Digitalisation &",
              <Accent key="a">Innovation</Accent>,
              <span key="b">
                pour l’<Accent>Afrique</Accent> d’aujourd’hui
              </span>,
              "et de demain",
            ]}
            className="type-headline mt-6 text-display leading-[0.98] md:mt-8"
          />
          <p className="enter mt-8 max-w-xl text-lead text-paper/80" style={d(0.55)}>
            Deux jours de conférences, de panels, de formations, d’ateliers et un hackathon, organisés à {EVENT.city} par{" "}
            {EVENT.organiser.name}.
          </p>
          <div className="enter mt-8 flex flex-wrap gap-3" style={d(0.7)}>
            <ButtonLink href="/billetterie" arrow>
              Prendre mon pass
            </ButtonLink>
            <ButtonLink href="/programme" variant="link">
              Le programme
            </ButtonLink>
          </div>
        </div>

        <div
          className="enter col-span-4 flex flex-col gap-8 border-t border-rule pt-6 md:col-span-8 lg:col-span-12 lg:flex-row lg:items-end lg:justify-between"
          style={d(0.85)}
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-5">
            <div>
              <dt className="type-label">Dates</dt>
              <dd className="mt-1.5 text-body font-semibold">18 — 19 décembre 2026</dd>
            </div>
            <div className="sm:border-l sm:border-rule sm:pl-10">
              <dt className="type-label">Lieu</dt>
              <dd className="mt-1.5 text-body font-semibold">
                {venue ? (
                  venue.name
                ) : (
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    {EVENT.city} <Pending label="Lieu exact">Lieu à annoncer</Pending>
                  </span>
                )}
              </dd>
            </div>
          </dl>
          <div className="w-full max-w-md">
            <p className="type-label mb-3">Ouverture des portes dans</p>
            <Countdown className="[--surface:rgb(23_23_23/0.72)]" />
          </div>
        </div>
      </div>

      {/* Programme band — every figure is taken from the validated programme */}
      <nav aria-label="Au programme" className="border-t border-rule bg-ink/80">
        <div className="shell grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[auto_repeat(5,minmax(0,1fr))]">
          <p className="type-label col-span-2 py-5 sm:col-span-3 lg:col-span-1 lg:py-7 lg:pr-10">Au programme</p>
          {PROGRAMME_BAND.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              style={d(1 + i * 0.06)}
              className={`enter group flex items-baseline gap-3 border-t border-rule py-5 transition-colors hover:text-accent lg:border-t-0 lg:border-l lg:py-7 lg:pl-6 ${
                i % 2 === 1 ? "border-l pl-4 sm:border-l-0 sm:pl-0" : ""
              }`}
            >
              <span className="type-condensed text-heading leading-none text-accent">{item.count}</span>
              <span className="text-small leading-tight font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </Section>
  );
}
