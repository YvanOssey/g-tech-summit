import { EVENT } from "@/config/event";
import { Pending } from "@/components/ui/Pending";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface LegalPlaceholderProps {
  title: string;
  /** What the final document will cover — listed so visitors know what to expect. */
  covers: readonly string[];
}

/**
 * Legal pages exist from day one but their content is not written yet.
 * Nothing is invented: the page says it is being drafted and how to reach the organiser.
 */
export function LegalPlaceholder({ title, covers }: LegalPlaceholderProps) {
  return (
    <>
      <Section tone="ink">
        <div className="shell pt-14 pb-14 md:pt-20 md:pb-20">
          <SectionLabel>Informations légales</SectionLabel>
          <h1 className="type-headline text-display mt-6 md:mt-8">{title}</h1>
        </div>
      </Section>
      <Section tone="paper" className="section-compact">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-5 lg:col-span-6">
            <Pending variant="block" label={title}>
              Document en cours de rédaction
            </Pending>
            <p className="mt-6 text-muted">
              Pour toute question en attendant sa publication :{" "}
              <a href={`mailto:${EVENT.contact.email}`} className="text-fg underline underline-offset-4 hover:decoration-mark">
                {EVENT.contact.email}
              </a>
            </p>
          </div>
          <div className="col-span-4 md:col-span-3 md:col-start-6 lg:col-span-4 lg:col-start-8">
            <p className="type-label">Ce document précisera</p>
            <ul className="mt-4 border-b border-rule">
              {covers.map((c) => (
                <li key={c} className="border-t border-rule py-3">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
