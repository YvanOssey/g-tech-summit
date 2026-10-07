"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EVERY_MS = 4000;
const GIVE_UP_AFTER = 30; // about two minutes

/** While the payment is pending, asks the server every few seconds, then refreshes the page. */
export function PaymentWatcher({ token }: { token: string }) {
  const router = useRouter();
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let attempts = 0;
    let stopped = false;
    const tick = async () => {
      attempts += 1;
      try {
        const res = await fetch("/api/billetterie/statut", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ c: token }),
        });
        const json = (await res.json()) as { status?: string };
        if (!stopped && json.status && json.status !== "PENDING") {
          stopped = true;
          clearInterval(timer);
          router.refresh();
          return;
        }
      } catch {
        // network hiccup: try again on the next tick
      }
      if (attempts >= GIVE_UP_AFTER) {
        clearInterval(timer);
        setGaveUp(true);
      }
    };
    // First check right away: the buyer usually arrives just after paying.
    const timer = setInterval(tick, EVERY_MS);
    void tick();
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [token, router]);

  return (
    <p role="status" className="mt-4 text-small text-muted">
      {gaveUp
        ? "La confirmation prend plus de temps que prévu. Rechargez cette page dans quelques minutes : elle reste valable."
        : "Vérification du paiement en cours… cette page se met à jour toute seule."}
    </p>
  );
}
