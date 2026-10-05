import type { ReactNode } from "react";
import { Tilt } from "@/components/motion/Tilt";

export interface TicketField {
  k: string;
  v: ReactNode;
}

/**
 * The practical information printed as one oversized ticket: a header with the
 * event, the fields, a perforation, and a stub with the prices. Same object as
 * the pass tickets of the identity. Purely informative — not a real ticket
 * (no code, no name).
 */
export function EventTicket({
  title,
  subtitle,
  fields,
  stub,
}: {
  title: string;
  subtitle: string;
  fields: readonly TicketField[];
  stub: ReactNode;
}) {
  return (
    <Tilt max={5}>
      <div className="float-y">
        <article className="notch-x relative overflow-hidden rounded-object bg-paper text-ink shadow-[0_40px_90px_-30px_rgb(242_140_24/0.45)] [--notch-at:calc(100%_-_var(--stub-w))] [--stub-w:9rem] sm:[--stub-w:11rem]">
          <div className="grid grid-cols-[1fr_var(--stub-w)]">
            {/* Main part */}
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="type-meta text-smoke">{subtitle}</p>
                  <p className="type-condensed mt-1 text-title leading-none">{title}</p>
                </div>
                <span className="size-3 shrink-0 rounded-pill bg-signal" aria-hidden="true" />
              </div>
              <dl className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.k} className="border-t border-ink/15 pt-3">
                    <dt className="type-meta text-smoke">{f.k}</dt>
                    <dd className="mt-1 font-semibold leading-snug">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Stub */}
            <div className="flex flex-col justify-between border-l border-dashed border-ink/30 bg-signal p-5 sm:p-6">{stub}</div>
          </div>
        </article>
      </div>
    </Tilt>
  );
}
