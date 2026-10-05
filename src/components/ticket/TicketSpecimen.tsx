import { EVENT } from "@/config/event";
import { PASSES, type PassId } from "@/config/passes";
import { Pending } from "@/components/ui/Pending";
import { SignalSquare } from "@/components/ui/icons";

interface TicketSpecimenProps {
  passes: readonly PassId[];
}

/**
 * Design specimen of the participant ticket (e-mail / PDF / badge).
 * Clearly marked "Spécimen": it carries no real participant, reference or QR code.
 * The real ticket is generated server-side only after a verified payment.
 */
export function TicketSpecimen({ passes }: TicketSpecimenProps) {
  const rights: { label: string; detail: string }[] = [];
  if (passes.includes("event")) {
    rights.push({ label: PASSES.event.name, detail: `${EVENT.days[0].short} · ${EVENT.days[1].short}` });
  }
  if (passes.includes("hackathon")) {
    rights.push({ label: PASSES.hackathon.name, detail: "Participation au hackathon" });
  }

  return (
    <article
      aria-label="Spécimen de billet"
      className="notch-y lg:notch-x relative grid overflow-hidden rounded-object bg-paper text-ink ring-1 ring-ink ring-inset [--notch-at:calc(100%_-_var(--stub))] [--stub:19rem] lg:grid-cols-[1fr_var(--stub)] lg:[--stub:17rem]"
    >
      <span
        aria-hidden="true"
        className="type-meta pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 text-display tracking-[0.3em] text-ink/[0.06] select-none"
      >
        Spécimen
      </span>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        <div className="type-meta flex flex-wrap justify-between gap-4 text-grey">
          <span>Billet nominatif</span>
          <span>Réf. ——————</span>
        </div>

        <div>
          <p className="type-condensed text-title">
            G-Tech
            <br />
            Summit <span className="text-signal-text">26</span>
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-5 sm:grid-cols-4">
          <div className="col-span-2">
            <dt className="type-meta text-grey">Participant</dt>
            <dd className="mt-1 font-semibold">Prénom NOM</dd>
          </div>
          <div>
            <dt className="type-meta text-grey">Dates</dt>
            <dd className="mt-1 font-semibold">18—19.12.2026</dd>
          </div>
          <div>
            <dt className="type-meta text-grey">Lieu</dt>
            <dd className="mt-1">
              <Pending label="Lieu" />
            </dd>
          </div>
        </dl>

        <ul className="space-y-2">
          {rights.map((r) => (
            <li key={r.label} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <SignalSquare />
              <span className="font-semibold">{r.label}</span>
              <span className="type-meta text-grey">{r.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex h-(--stub) flex-col items-center justify-center gap-4 border-t border-dashed border-ink/40 p-6 lg:h-auto lg:border-t-0 lg:border-l">
        <div className="flex size-48 items-center justify-center rounded-input border border-dashed border-ink/50 text-center">
          <span className="type-meta px-6 text-grey">QR code unique, généré à l’émission</span>
        </div>
        <p className="type-meta max-w-[14rem] text-center text-grey">
          Une validation par jour et par accès
        </p>
      </div>
    </article>
  );
}
