"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EXCLUSIVE, PASSES, PASS_ORDER, orderTotal, withExclusions, type PassId } from "@/config/passes";
import { formatAmount } from "@/lib/format";
import { Check } from "@/components/ui/icons";
import { PassCard } from "./PassCard";

interface PassSelectorProps {
  initial?: readonly PassId[];
  onChange?: (selection: PassId[]) => void;
  /** Passes already sold, for the registration gauges. */
  sold?: Partial<Record<PassId, number>>;
  /** Hackathon teams registered per Cup (track code → count). */
  trackSold?: Record<string, number>;
}

/**
 * Step 1 of registration: one participant picks one pass (passes do not combine).
 * The total shown here is informative — the server recomputes it from `config/passes`.
 */
export function PassSelector({ initial = ["event"], onChange, sold, trackSold }: PassSelectorProps) {
  const [selection, setSelection] = useState<PassId[]>([...initial]);
  const reduce = useReducedMotion();
  const total = orderTotal(selection);

  function toggle(id: PassId) {
    // Picking a pass drops the ones it cannot be combined with (all of them).
    const ordered = selection.includes(id) ? selection.filter((p) => p !== id) : withExclusions(selection, id);
    setSelection(ordered);
    onChange?.(ordered);
  }

  return (
    <fieldset>
      <legend className="sr-only">Choisissez votre pass</legend>

      <div className="grid gap-4 md:grid-cols-2 md:gap-(--gutter) lg:grid-cols-3">
        {PASS_ORDER.map((id, i) => {
          const pass = PASSES[id];
          const checked = selection.includes(id);
          const dark = id === "hackathon";
          return (
            <label key={id} className="group block cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={() => toggle(id)}
              />
              <PassCard
                pass={pass}
                index={i + 1}
                selected={checked}
                sold={sold?.[id]}
                trackSold={id === "hackathon" ? trackSold : undefined}
                className="transition-transform duration-(--duration-micro) ease-out-quart group-hover:-translate-y-0.5"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-input border outline-offset-4 transition-colors duration-(--duration-micro) group-has-[input:focus-visible]:outline-2 group-has-[input:focus-visible]:outline-signal ${
                    checked
                      ? "border-signal bg-signal text-ink"
                      : dark
                        ? "border-paper/50 text-transparent"
                        : "border-ink/50 text-transparent"
                  }`}
                >
                  <Check className="size-5" />
                  <span className="sr-only">{checked ? "Sélectionné" : "Non sélectionné"}</span>
                </span>
              </PassCard>
            </label>
          );
        })}
      </div>

      {EXCLUSIVE.length > 0 && (
        <p className="mt-4 text-small text-muted">
          Un seul pass par inscription : choisir un pass retire l’autre. Le Pass Hackathon inclut l’accès sur place à
          l’événement pour chaque membre de l’équipe.
        </p>
      )}

      <div
        className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-rule-strong pt-4"
        aria-live="polite"
      >
        <p className="type-meta text-muted">
          {selection.length === 0
            ? "Aucun pass sélectionné"
            : selection.map((id) => PASSES[id].name).join(" + ")}
        </p>
        <p className="flex items-baseline gap-3">
          <span className="type-meta text-muted">Total</span>
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={total}
                className="type-condensed text-heading tabular-nums"
                initial={reduce ? false : { y: "100%" }}
                animate={{ y: "0%" }}
                exit={reduce ? undefined : { y: "-100%" }}
                transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
              >
                {formatAmount(total)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="type-meta">FCFA</span>
        </p>
      </div>
    </fieldset>
  );
}
