"use client";

import Link from "next/link";
import { useState } from "react";
import type { PassId } from "@/config/passes";
import { ArrowRight } from "@/components/ui/icons";
import { PassSelector } from "./PassSelector";

/**
 * Step 1 when registrations are open: the unchanged PassSelector, plus the
 * link to step 2 carrying the selection (?pass=hackathon). The server
 * validates the selection again and recomputes the total.
 */
export function CheckoutStart({ initial, sold }: { initial: readonly PassId[]; sold?: Partial<Record<PassId, number>> }) {
  const [selection, setSelection] = useState<PassId[]>([...initial]);
  const empty = selection.length === 0;

  return (
    <>
      <PassSelector initial={initial} sold={sold} onChange={setSelection} />
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-rule-strong pt-8">
        <p className="max-w-xl text-muted">
          Étape suivante : vos informations, puis le paiement sécurisé. Votre billet nominatif vous est remis dès la confirmation du
          paiement.
        </p>
        {empty ? (
          <span aria-disabled="true" className="min-h-12 cursor-not-allowed content-center rounded-pill bg-stone px-6 font-semibold text-grey">
            Choisissez au moins un pass
          </span>
        ) : (
          <Link href={`/billetterie/inscription?pass=${selection.join(",")}`} className="btn-primary group inline-flex min-h-12 items-center gap-3 px-6 font-semibold">
            Continuer
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </>
  );
}
