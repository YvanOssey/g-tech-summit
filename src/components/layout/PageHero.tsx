import type { ReactNode } from "react";
import { ParticleField } from "@/components/motion/ParticleField";
import { RevealText } from "@/components/motion/RevealText";
import { Section, type Tone } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface PageHeroProps {
  label: string;
  /** Title lines; may contain <Accent> words (then pass `title` for the accessible label). */
  lines: readonly ReactNode[];
  title?: string;
  lead?: ReactNode;
  tone?: Tone;
  children?: ReactNode;
}

/** Opening band of inner pages: label, large institutional headline, lead. */
export function PageHero({ label, lines, title, lead, tone = "ink", children }: PageHeroProps) {
  return (
    <Section tone={tone} className="relative isolate overflow-hidden">
      {tone === "ink" && (
        <>
          <ParticleField density={0.7} className="absolute inset-0 -z-10 size-full opacity-60" />
          <div aria-hidden="true" className="glow-signal top-0 right-0 -z-10 size-[min(110vw,52rem)]" />
        </>
      )}
      <div className="shell pt-14 pb-16 md:pt-20 md:pb-24">
        <SectionLabel>{label}</SectionLabel>
        <RevealText as="h1" lines={lines} label={title} className="type-headline text-display mt-6 md:mt-8" />
        {(lead || children) && (
          <div className="rise-in grid-12 mt-10 gap-y-8 md:mt-14" style={{ animationDelay: "0.3s" }}>
            {lead && <div className="text-lead col-span-4 text-muted md:col-span-6 lg:col-span-7">{lead}</div>}
            {children && <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">{children}</div>}
          </div>
        )}
      </div>
    </Section>
  );
}
