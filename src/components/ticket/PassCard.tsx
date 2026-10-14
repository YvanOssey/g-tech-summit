import type { ReactNode } from "react";
import { TRACK_CAPACITY, type Pass, type PassId } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";
import { formatAmount } from "@/lib/format";
import { CapacityGauge } from "./CapacityGauge";

/** How each pass is attended — shown in the ticket header. */
const MODE: Record<PassId, string> = { online: "À distance", event: "Sur place", hackathon: "Par équipe" };

interface PassCardProps {
  pass: Pass;
  index: number;
  /** Stub content under the perforation (CTA, selection state…). */
  children?: ReactNode;
  /** Visual state used by the selector. */
  selected?: boolean;
  /** Passes already sold — shows the registration gauge when given. */
  sold?: number;
  /** Hackathon only: teams registered per Cup (track code → count). Shows one gauge per Cup. */
  trackSold?: Record<string, number>;
  className?: string;
}

/**
 * A pass is drawn as a ticket: the same object becomes the order summary,
 * the e-mailed ticket and the printed badge.
 * En ligne & Présentiel = paper tickets, Hackathon = ink ticket — they read apart at a glance, even in print.
 */
export function PassCard({ pass, index, children, selected, sold, trackSold, className = "" }: PassCardProps) {
  const dark = pass.id === "hackathon";
  const surface = dark ? "bg-ink text-paper" : "bg-(--pass-surface) text-ink";
  const muted = dark ? "text-mist" : "text-smoke";
  const perforation = dark ? "border-paper/25" : "border-ink/25";

  return (
    <article
      className={`notch-y relative flex h-full flex-col overflow-hidden rounded-object [--notch-at:calc(100%_-_var(--stub-h))] [--stub-h:7.5rem] ${surface} ${className}`}
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
          <span>
            Pass {String(index).padStart(2, "0")} · {MODE[pass.id]}
          </span>
          <span>18—19.12.2026</span>
        </div>

        <h3 className="type-headline text-heading">{pass.name}</h3>

        <div className="mt-auto space-y-2">
          <p className="font-semibold">{pass.access}</p>
          <p className={`text-small leading-normal ${muted}`}>{pass.summary}</p>
        </div>

        {pass.id === "hackathon" && trackSold ? (
          <div className="space-y-4">
            {TRACKS.map((t) => (
              <div key={t.code}>
                <p className={`type-meta mb-2 ${muted}`}>{t.name}</p>
                <CapacityGauge sold={trackSold[t.code] ?? 0} total={TRACK_CAPACITY[t.code] ?? 0} unit="équipes" dark={dark} />
              </div>
            ))}
          </div>
        ) : (
          sold !== undefined && <CapacityGauge sold={sold} total={pass.capacity.total} unit={pass.capacity.unit} dark={dark} />
        )}
      </div>

      <div
        className={`flex h-(--stub-h) items-end justify-between gap-4 border-t border-dashed px-6 pb-6 sm:px-8 ${perforation}`}
      >
        <p className="flex items-baseline gap-2">
          <span className="type-condensed text-title leading-none">
            {formatAmount(pass.price)}
          </span>
          <span className={`type-meta ${muted}`}>FCFA{pass.per === "équipe" ? " / équipe" : ""}</span>
        </p>
        {children}
      </div>
    </article>
  );
}