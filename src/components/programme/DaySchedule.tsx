import Link from "next/link";
import { SESSION_TYPE_LABEL, type Slot } from "@/content/programme";
import { Pending } from "@/components/ui/Pending";

interface DayScheduleProps {
  slots: readonly Slot[];
  /** Compact: time + title only (homepage). */
  compact?: boolean;
}

const HIGHLIGHT = new Set(["conference", "panel", "formation", "atelier", "pitch"]);

export function DaySchedule({ slots, compact = false }: DayScheduleProps) {
  return (
    <ol className="border-b border-rule-strong">
      {slots.map((slot) => {
        const strong = HIGHLIGHT.has(slot.type);
        const title = (
          <>
            <span className={strong ? "font-semibold" : ""}>{slot.title}</span>
            {slot.subtitle !== undefined && (
              <span className="block">
                {slot.subtitle === null ? <Pending label="Intitulé">Intitulé à confirmer</Pending> : slot.subtitle}
              </span>
            )}
          </>
        );

        if (compact) {
          return (
            <li key={slot.start + slot.title} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-rule py-3">
              <span className={`type-meta pt-1 ${strong ? "text-accent" : "text-muted"}`}>{slot.start}</span>
              <span className="leading-snug">{title}</span>
            </li>
          );
        }

        return (
          <li
            key={slot.start + slot.title}
            className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 border-t border-rule-strong py-5 md:grid-cols-[8rem_9rem_1fr_11rem] md:gap-x-(--gutter)"
          >
            <p className={`type-meta pt-1 ${strong ? "text-accent" : ""}`}>
              {slot.start}
              {slot.end && <span className="block text-muted">→ {slot.end}</span>}
            </p>
            <p className="type-meta order-last col-span-2 flex items-center gap-2 text-muted md:order-none md:col-span-1 md:items-start md:pt-1">
              {strong && <span aria-hidden="true" className="inline-block size-2 bg-mark md:mt-1" />}
              {SESSION_TYPE_LABEL[slot.type]}
            </p>
            <div className="text-body leading-snug">
              {slot.ref ? (
                <Link href={`/programme#${slot.ref}`} className="hover:underline hover:decoration-mark hover:underline-offset-4">
                  {title}
                </Link>
              ) : (
                title
              )}
              {slot.detail && <p className="mt-1 text-small text-muted">{slot.detail}</p>}
            </div>
            <p className="type-meta hidden pt-1 text-muted md:block">{slot.zone}</p>
          </li>
        );
      })}
    </ol>
  );
}
