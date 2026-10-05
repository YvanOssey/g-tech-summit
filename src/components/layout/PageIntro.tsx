import type { ReactNode } from "react";
import { ParticleField } from "@/components/motion/ParticleField";
import { RevealText } from "@/components/motion/RevealText";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface PageIntroProps {
  label: string;
  /** Title lines; may contain <Accent> words (then pass `title` for the accessible label). */
  lines: readonly ReactNode[];
  title?: string;
  lead?: ReactNode;
  actions?: ReactNode;
  /** The page's own signature visual, on the right from lg. Without one, the text is centred. */
  visual?: ReactNode;
}

/**
 * Opening band of the inner pages: the headline on the left and the page's
 * signature visual on the right (terminal, ticket, logo wall…), or the
 * headline alone, centred.
 */
export function PageIntro({ label, lines, title, lead, actions, visual }: PageIntroProps) {
  const centred = !visual;

  return (
    <Section tone="ink" className="relative isolate overflow-hidden">
      <ParticleField density={0.6} className="absolute inset-0 -z-10 size-full opacity-50" />
      <div
        aria-hidden="true"
        className={`glow-signal top-1/2 -z-10 size-[min(110vw,56rem)] ${centred ? "left-1/2" : "right-0"}`}
      />

      <div
        className={`shell grid-12 items-center gap-y-14 pt-12 pb-16 md:pt-16 md:pb-24 ${
          centred ? "lg:min-h-[min(calc(100svh-var(--header-h)),46rem)]" : "lg:min-h-[calc(100svh-var(--header-h))]"
        }`}
      >
        <div
          className={
            centred
              ? "col-span-4 flex flex-col items-center text-center md:col-span-8 lg:col-span-10 lg:col-start-2"
              : "col-span-4 md:col-span-8 lg:col-span-6"
          }
        >
          <SectionLabel className={centred ? "justify-center" : ""}>{label}</SectionLabel>
          <RevealText as="h1" lines={lines} label={title} className="type-headline text-display mt-6 md:mt-8" />
          {lead && (
            <div className="rise-in mt-8 max-w-xl text-lead text-muted" style={{ animationDelay: "0.35s" }}>
              {lead}
            </div>
          )}
          {actions && (
            <div
              className={`rise-in mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 ${centred ? "justify-center" : ""}`}
              style={{ animationDelay: "0.5s" }}
            >
              {actions}
            </div>
          )}
        </div>
        {visual && (
          <div className="rise-in col-span-4 md:col-span-8 lg:col-span-6" style={{ animationDelay: "0.25s" }}>
            {visual}
          </div>
        )}
      </div>
    </Section>
  );
}
