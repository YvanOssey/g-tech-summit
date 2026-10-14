"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { HACKATHON } from "@/content/hackathon";

/** The hackathon from team to podium — validated facts only (TDR XII). */
const STEPS = [
  { title: "Formez votre équipe", when: null, text: "Participation en équipe uniquement ; les équipes multidisciplinaires sont encouragées." },
  { title: "Choisissez une thématique", when: null, text: "Une seule par équipe, parmi les deux, pour un problème réel en Côte d’Ivoire ou en Afrique." },
  { title: "Construisez", when: null, text: "Le projet, original, est développé pendant la période du hackathon." },
  {
    title: "Pitchez",
    when: `Sam. 19 déc. · ${HACKATHON.finale.pitch.time}`,
    text: `${HACKATHON.pitchFormat.presentation}, ${HACKATHON.pitchFormat.questions.replace("questions-réponses", "questions")} — et le vote du public.`,
  },
  { title: "Résultats", when: `Sam. 19 déc. · ${HACKATHON.finale.awards.time}`, text: "Annonce des vainqueurs et remise des prix." },
] as const;

/**
 * Five steps on a rail. The orange rail fills as the block scrolls through
 * the window (horizontal on large screens, vertical below).
 */
export function HackathonSteps({
  className = "",
  headingLevel = 4,
  showUpcoming = false,
}: {
  className?: string;
  /** Level of the step titles, one below the section's own heading. */
  headingLevel?: 3 | 4;
  /** false: the jury is not mentioned (see "Informations à venir" in the admin settings). */
  showUpcoming?: boolean;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h4";
  const steps = STEPS.map((s) => (showUpcoming ? s : { ...s, text: s.text.replace(" avec le jury", "") }));
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const fill = reduce ? 1 : progress;

  return (
    <ol ref={ref} className={`relative grid gap-10 lg:grid-cols-5 lg:gap-(--gutter) ${className}`}>
      {/* Rail: vertical on small screens, horizontal on large */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-graphite lg:top-[0.4375rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      <motion.span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[0.4375rem] w-px origin-top bg-signal lg:hidden"
        style={{ scaleY: fill }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-[0.4375rem] right-0 left-0 hidden h-px origin-left bg-signal lg:block"
        style={{ scaleX: fill }}
      />

      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          data-reveal=""
          className="relative pl-10 lg:pt-10 lg:pl-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }}
        >
          <span aria-hidden="true" className="absolute top-0 left-0 size-3.5 rounded-pill border-2 border-signal bg-ink" />
          <p className="type-meta text-muted">{String(i + 1).padStart(2, "0")}</p>
          <Heading className="type-headline mt-2 text-heading">{s.title}</Heading>
          {s.when && <p className="type-label mt-2">{s.when}</p>}
          <p className="mt-3 text-small text-muted">{s.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}