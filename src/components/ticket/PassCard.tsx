import type { ReactNode } from "react";
import type { Pass } from "@/config/passes";
import { formatAmount } from "@/lib/format";

interface PassCardProps {
  pass: Pass;
  index: number;
  /** Stub content under the perforation (CTA, selection state…). */
  children?: ReactNode;
  /** Visual state used by the selector. */
  selected?: boolean;
  className?: string;
}

/**
 * A pass is drawn as a ticket: the same object becomes the order summary,
 * the e-mailed ticket and the printed badge.
 * Event = paper ticket, Hackathon = ink ticket — the two read apart at a glance, even in print.
 */
export function PassCard({ pass, index, children, selected, className = "" }: PassCardProps) {
  const dark = pass.id === "hackathon";
  const surface = dark ? "bg-ink text-paper" : "bg-grey-100 text-ink";
  const muted = dark ? "text-grey-400" : "text-grey-500";
  const perforation = dark ? "border-paper/25" : "border-ink/25";

  return (
    <article
      className={`notch-y relative flex h-full flex-col [--notch-at:calc(100%_-_var(--stub-h))] [--stub-h:7.5rem] ${surface} ${className}`}
    >
      {/* Selection band — the signal colour only appears when it carries meaning */}
      <div
        aria-hidden="true"
        className={`h-1.5 w-full origin-left bg-signal transition-transform duration-(--duration-component) ease-out-quart ${
          selected ? "scale-x-100" : "scale-x-0"
        }`}
      />

      <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
        <div className={`type-meta flex justify-between gap-4 ${muted}`}>
          <span>Pass {String(index).padStart(2, "0")}</span>
          <span>18—19.12.2026</span>
        </div>

        <h3 className="type-condensed text-title">{pass.name}</h3>

        <div className="mt-auto space-y-2">
          <p className="font-semibold">{pass.access}</p>
          <p className={`text-[0.9375rem] leading-normal ${muted}`}>{pass.summary}</p>
        </div>
      </div>

      <div
        className={`flex h-(--stub-h) items-end justify-between gap-4 border-t border-dashed px-6 pb-6 sm:px-8 ${perforation}`}
      >
        <p className="flex items-baseline gap-2">
          <span className="type-condensed text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none">
            {formatAmount(pass.price)}
          </span>
          <span className={`type-meta ${muted}`}>FCFA</span>
        </p>
        {children}
      </div>
    </article>
  );
}
