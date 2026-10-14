"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { EVENT } from "@/config/event";
import { PHOTOS } from "@/config/media";
import type { Venue } from "@/config/settings";
import { Magnetic } from "@/components/motion/Magnetic";
import { ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { ArrowRight, MapPin } from "@/components/ui/icons";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";

interface HomeHeroProps {
  venue: Venue | null;
  /** Show the "exact venue to be announced" placeholder when the venue is not set. */
  showUpcoming?: boolean;
}

/** First-paint entrance delay (CSS — runs before hydration, and without JavaScript). */
const at = (delay: number): CSSProperties => ({ animationDelay: `${delay}s` });

/**
 * Headline words, revealed letter by letter. "SUMMIT" joins "G-TECH" on one
 * line from `sm`, and sits on its own line on phones.
 */
const WORDS = [
  { text: "G-TECH", className: "inline-block text-signal" },
  { text: "SUMMIT", className: "block sm:ml-[0.25em] sm:inline-block" },
  { text: "2026", className: "block text-outline-signal" },
] as const;

/**
 * Embers drifting up through the warm light — fixed positions so server and
 * client render the same thing. x / size in %, duration and delay in s.
 */
const EMBERS = [
  { x: 52, size: 3, duration: 9, delay: 0 },
  { x: 58, size: 2, duration: 11, delay: 2.5 },
  { x: 63, size: 4, duration: 8, delay: 5 },
  { x: 67, size: 2, duration: 12, delay: 1 },
  { x: 72, size: 3, duration: 10, delay: 6.5 },
  { x: 76, size: 2, duration: 9, delay: 3.5 },
  { x: 81, size: 3, duration: 13, delay: 0.5 },
  { x: 86, size: 2, duration: 10, delay: 7.5 },
  { x: 90, size: 4, duration: 11, delay: 4 },
  { x: 94, size: 2, duration: 9, delay: 8.5 },
  { x: 47, size: 2, duration: 12, delay: 9.5 },
  { x: 84, size: 3, duration: 8, delay: 10.5 },
] as const;

const SPRING = { stiffness: 60, damping: 20, mass: 0.8 };

/**
 * Homepage hero — the VR portrait fills the band; the lockup sits on its
 * left half (over the Ghostech "G"), behind a left-to-right veil, so the face
 * and the outline of Africa stay visible on the right.
 *
 * Motion:
 * - entrance: the picture comes out of the dark and settles from a zoom, then
 *   the visor and the Africa outline light up; the headline rises letter by
 *   letter, the rest follows;
 * - idle: the visor light and Africa breathe, embers drift up;
 * - pointer: the picture moves a little against the mouse (depth);
 * - scroll: the picture drifts slower than the page and zooms, the lockup
 *   lifts and fades.
 */
export function HomeHero({ venue, showUpcoming = false }: HomeHeroProps) {
  const photo = PHOTOS.hero;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Pointer depth: the picture moves against the mouse.
  const px = useSpring(0, SPRING);
  const py = useSpring(0, SPRING);
  const pictureX = useTransform(px, (v) => v * -24);
  const pictureY = useTransform(py, (v) => v * -16);
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <Section
      ref={ref}
      tone="ink"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      className="relative isolate overflow-hidden"
    >
      {/* ── Picture ── */}
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10" style={reduce ? undefined : { y: stageY, scale: stageScale }}>
        <motion.div className="absolute -inset-6" style={reduce ? undefined : { x: pictureX, y: pictureY }}>
          <div className="stage-in absolute inset-0">
            {photo && (
              <Image
                src={photo.src}
                alt=""
                fill
                preload
                sizes="100vw"
                className="object-cover object-[68%_30%] lg:object-[60%_35%]"
              />
            )}
            {/* Lights of the picture: visor and Africa outline (positions follow the crop on lg) */}
            <span className="hero-light absolute top-[29%] left-[70%] size-[30vmax] max-lg:hidden" style={at(1.4)} />
            <span className="hero-light absolute top-[71%] left-[87%] size-[24vmax] max-lg:hidden" style={at(2)} />
          </div>
        </motion.div>

        {/* Embers */}
        <div className="absolute inset-0">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="ember absolute bottom-[-2%] rounded-pill bg-signal"
              style={{
                left: `${e.x}%`,
                width: e.size,
                height: e.size,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Veils: from the left on large screens, from the bottom on phones */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-ink)_10%,rgb(23_23_23/0.82)_50%,rgb(23_23_23/0.55)_72%,rgb(23_23_23/0.2)_92%)] lg:bg-[linear-gradient(to_right,var(--color-ink)_12%,rgb(23_23_23/0.8)_38%,rgb(23_23_23/0.1)_62%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgb(23_23_23/0.7),transparent)]" />
      </motion.div>

      {/* ── Lockup ── */}
      <motion.div
        className="shell flex min-h-svh flex-col justify-end pt-[calc(var(--header-h)+1.5rem)] pb-12 lg:min-h-[min(100svh,62rem)] lg:justify-center lg:pl-[max(var(--gutter),4vw)]"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-2xl">
          <p
            className="rise-in type-meta inline-flex items-center gap-3 rounded-pill border border-rule-strong bg-ink/60 px-4 py-2 text-paper"
            style={at(0.6)}
          >
            <MapPin className="size-4 shrink-0 text-signal" />
            {EVENT.edition} · {EVENT.city}
          </p>

          <h1
            id="hero-title"
            aria-label={`${EVENT.name} ${EVENT.year}`}
            className="mt-6 font-[Arial,Helvetica,sans-serif] [text-shadow:0_2px_28px_rgb(23_23_23/0.85),0_0_2px_rgb(23_23_23/0.6)] text-[clamp(3rem,15vw,5rem)] leading-[0.95] font-bold tracking-[-0.02em] whitespace-nowrap sm:text-[clamp(3rem,0.5rem+6.4vw,7.5rem)]"
          >
            {WORDS.map((word, wi) => (
              <span key={word.text} aria-hidden="true" className={`overflow-hidden pb-[0.06em] align-top ${word.className}`}>
                {[...word.text].map((ch, ci) => (
                  <span key={ci} className="char-in inline-block" style={at(0.8 + wi * 0.16 + ci * 0.035)}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div className="rise-in mt-7 max-w-xl border-l-2 border-signal pl-5" style={at(1.5)}>
            <p className="type-headline text-heading">
              <span className="text-signal">18</span>—<span className="text-signal">19</span> décembre 2026
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-lead">
              {venue ? (
                venue.name
              ) : showUpcoming ? (
                <>
                  {EVENT.city} <Pending label="Lieu exact">IMPACT HUB ABIDJAN</Pending>
                </>
              ) : (
                EVENT.city
              )}
            </p>
            <p className="mt-3 text-body text-paper">{EVENT.summary}</p>
          </div>

          <div className="rise-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={at(1.65)}>
            <Magnetic>
              <ButtonLink href="/billetterie" arrow>
                Voir les pass
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="/programme" variant="link" arrow>
              Programme
            </ButtonLink>
          </div>

          <div className="rise-in mt-9 max-w-lg" style={at(1.8)}>
            <p className="type-label mb-1 text-paper">Ouverture des portes {EVENT.doorsOpen.label}</p>
            <Countdown alternate className="[--muted:var(--color-paper)]" />
          </div>
        </div>
      </motion.div>

      {/* Rotating caption — scroll cue to the next band */}
      <a
        href="#chiffres"
        aria-label="Découvrir l’événement"
        className="group rise-in absolute right-(--gutter) bottom-10 hidden size-28 rounded-pill lg:block"
        style={at(2.2)}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true" className="spin-slow absolute inset-0 size-full">
          <defs>
            <path id="hero-badge-circle" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
          </defs>
          <text className="fill-paper font-mono uppercase" style={{ fontSize: 8.5, letterSpacing: "0.18em" }}>
            <textPath href="#hero-badge-circle" textLength="296" lengthAdjust="spacing">
              G-TECH SUMMIT 2026 · 18—19 décembre · {EVENT.city} ·
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 m-auto flex size-11 items-center justify-center rounded-pill bg-signal text-ink transition-transform duration-(--duration-component) ease-out-quart group-hover:scale-110">
          <ArrowRight className="size-5 rotate-90" />
        </span>
      </a>
    </Section>
  );
}