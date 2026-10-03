import { EVENT } from "@/config/event";
import { Pending } from "@/components/ui/Pending";
import { SectionIndex } from "@/components/ui/SectionIndex";

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
    <div className="shell pt-10 pb-28 md:pt-14 md:pb-36">
      <SectionIndex index="—" label="Informations légales" />
      <h1 className="type-condensed text-display mt-8 md:mt-12">{title}</h1>
      <div className="grid-12 mt-12 gap-y-10">
        <div className="col-span-4 md:col-span-5 lg:col-span-6">
          <Pending variant="block" label={title}>
            Document en cours de rédaction
          </Pending>
          <p className="mt-6 text-grey-500">
            Pour toute question en attendant sa publication :{" "}
            <a href={`mailto:${EVENT.contact.email}`} className="text-ink underline underline-offset-4 hover:decoration-signal">
              {EVENT.contact.email}
            </a>
          </p>
        </div>
        <div className="col-span-4 md:col-span-3 md:col-start-6 lg:col-span-4 lg:col-start-8">
          <p className="type-meta text-grey-500">Ce document précisera</p>
          <ul className="mt-4 border-b border-grey-200">
            {covers.map((c) => (
              <li key={c} className="border-t border-grey-200 py-3">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
