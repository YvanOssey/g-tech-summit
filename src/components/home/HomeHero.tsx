import Image from "next/image";
import { EVENT } from "@/config/event";
import { PHOTOS } from "@/config/media";
import type { Venue } from "@/config/settings";
import { RevealText } from "@/components/motion/RevealText";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";

interface HomeHeroProps {
  venue: Venue | null;
}

/**
 * Homepage hero — the visual fills the band and runs under the fixed pill
 * navigation; the event lockup is centred on it, closed by the countdown to
 * the opening of the doors.
 * Only the H1 animates (CSS, once, on first paint).
 */
export function HomeHero({ venue }: HomeHeroProps) {
  const photo = PHOTOS.hero;

  return (
    <Section tone="ink" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {photo && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src={photo.src}
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-[80%_50%] lg:object-[0%_50%]"
          />
          {/* Flat veil — no gradient. The centred text crosses the bright glass, hence the weight. */}
          <div className="absolute inset-0 bg-ink/65 lg:bg-ink/60" />
        </div>
      )}

      <div className="shell flex min-h-svh flex-col items-center justify-center pt-[calc(var(--header-h)+2rem)] pb-10 text-center md:pb-14 lg:min-h-[min(100svh,60rem)]">
        <div className="flex w-full max-w-4xl flex-col items-center">
          <RevealText
            as="h1"
            id="hero-title"
            label={`${EVENT.name} ${EVENT.year}`}
            lines={[
              <span key="name">
                <Accent>G-TECH</Accent> SUMMER <Accent>2026</Accent>
              </span>,
            ]}
            className="type-headline text-display uppercase"
          />

          <div className="mt-6 w-full border-t border-rule-strong pt-6">
            <p className="type-headline text-heading">
              <span className="text-signal">18</span>—<span className="text-signal">19</span> décembre 2026
            </p>
            <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-lead">
              {venue ? (
                venue.name
              ) : (
                <>
                  {EVENT.city} <Pending label="Lieu exact">Lieu exact à annoncer</Pending>
                </>
              )}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-body text-paper">{EVENT.summary}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <ButtonLink href="/billetterie" arrow>
              Voir les pass
            </ButtonLink>
            <ButtonLink href="/programme" variant="link" arrow>
              Programme
            </ButtonLink>
          </div>

          <div className="mt-10 w-full max-w-md">
            <p className="type-label mb-1 text-paper">Ouverture des portes {EVENT.doorsOpen.label}</p>
            <Countdown centered alternate className="[--muted:var(--color-paper)]" />
          </div>
        </div>
      </div>
    </Section>
  );
}
