import Link from "next/link";
import { ActionButton } from "@/components/admin/forms";
import { PASSES } from "@/config/passes";
import type { Registrations, TicketSummary } from "@/server/repositories/registrations";
import { cancelTicket, reissueTicket, resendTickets } from "./actions";

const STATUS = { VALID: "Valide", USED: "Utilisé", CANCELLED: "Annulé" } as const;

/** Tickets with their holder, link and actions. `back` = page to return to. */
export function TicketRows({ tickets, data, back, showHolder = true }: { tickets: TicketSummary[]; data: Registrations; back: string; showHolder?: boolean }) {
  if (tickets.length === 0) return <p className="text-small text-grey">Aucun billet émis : les billets sont créés quand le paiement est confirmé.</p>;

  return (
    <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
      {tickets.map((t) => {
        const holder = data.byId.get(t.participantId);
        return (
          <li key={t.id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              {showHolder && (
                <Link href={`/admin/participants/${t.participantId}`} className="font-medium hover:underline">
                  {holder ? `${holder.firstName} ${holder.lastName}` : "—"}
                </Link>
              )}
              <p className={showHolder ? "text-grey" : "font-medium"}>
                {PASSES[t.passId].name} · {STATUS[t.status]}
                {t.checkedInAt && " · entrée scannée"}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {t.status !== "CANCELLED" && (
                <a href={`/billet/${t.token}`} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center rounded-input border border-ink/20 px-2.5 font-medium hover:border-ink">
                  Ouvrir le billet
                </a>
              )}
              {t.status === "VALID" && (
                <>
                  <form action={resendTickets}>
                    <input type="hidden" name="order_id" value={t.orderId} />
                    <input type="hidden" name="ticket_id" value={t.id} />
                    <input type="hidden" name="back" value={back} />
                    <ActionButton>Renvoyer par e-mail</ActionButton>
                  </form>
                  <form action={reissueTicket}>
                    <input type="hidden" name="ticket_id" value={t.id} />
                    <input type="hidden" name="back" value={back} />
                    <ActionButton confirm="Créer un nouveau lien pour ce billet ? L’ancien lien et l’ancien QR code ne fonctionneront plus.">
                      Nouveau lien
                    </ActionButton>
                  </form>
                  <form action={cancelTicket}>
                    <input type="hidden" name="ticket_id" value={t.id} />
                    <input type="hidden" name="back" value={back} />
                    <ActionButton danger confirm="Annuler ce billet ? Il n’ouvrira plus les portes. La commande n’est pas remboursée.">
                      Annuler le billet
                    </ActionButton>
                  </form>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
