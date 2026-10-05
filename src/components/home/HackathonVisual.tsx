"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PHOTOS } from "@/config/media";
import { HACKATHON, TRACKS } from "@/content/hackathon";
import { Tilt } from "@/components/motion/Tilt";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Hackathon visual — the organisers' portrait printed as a ticket: picture on
 * top, a perforation, then a stub with the real hackathon facts. Same object
 * as the pass tickets, so the section reads as part of the identity.
 *
 * Motion stays physical: the ticket is pinned slightly askew and straightens
 * and leans towards the mouse on hover; the picture opens like a curtain on
 * arrival and drifts inside its frame while scrolling.
 */
export function HackathonVisual({ className = "" }: { className?: string }) {
  const photo = PHOTOS.cyborg;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Driven from the root: a fully clipped frame would never report as visible.
  const on = useInView(ref, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!photo) return null;

  return (
    <div ref={ref} className={`group ${className}`} aria-hidden="true">
      <Tilt max={5}>
        <div className="-rotate-2 transition-[rotate] duration-(--duration-reveal) ease-out-quart group-hover:rotate-0">
          <article className="notch-y relative overflow-hidden rounded-object bg-paper text-ink [--notch-at:calc(100%_-_var(--stub-h))] [--stub-h:8.5rem]">
            {/* Picture */}
            <motion.div
              className="relative m-3 mb-0 aspect-[4/4.2] overflow-hidden rounded-[0.75rem] bg-ink"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={on ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <motion.div className="absolute -inset-y-[8%] inset-x-0" style={reduce ? undefined : { y: drift }}>
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.15 }}
                  animate={on ? { scale: 1 } : undefined}
                  transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                >
                  <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-[50%_30%]" />
                </motion.div>
              </motion.div>
              <p className="type-meta absolute top-4 left-4 rounded-pill bg-ink/80 px-3 py-1.5 text-paper">
                {HACKATHON.edition}
              </p>
            </motion.div>

            {/* Stub */}
            <div className="flex h-(--stub-h) flex-col justify-end gap-3 border-t border-dashed border-ink/25 px-6 pb-5 sm:px-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="type-meta text-smoke">{HACKATHON.name}</p>
                  <p className="type-headline mt-1 text-heading leading-none">Finale sur scène</p>
                </div>
                <p className="text-right">
                  <span className="type-condensed block text-title leading-none">19.12</span>
                  <span className="type-meta text-smoke">{HACKATHON.finale.pitch.time}</span>
                </p>
              </div>
              <ul className="type-meta flex gap-1.5 text-smoke">
                {TRACKS.map((t) => (
                  <li key={t.code} className="rounded-pill border border-ink/20 px-2 py-0.5">
                    {t.code}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </Tilt>
    </div>
  );
}
