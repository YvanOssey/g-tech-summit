import { checkIn, undoCheckIn } from "@/app/admin/(panel)/controle/actions";
import { PASSES, type PassId } from "@/config/passes";
import { ON_SITE_PASSES } from "@/server/checkin";
import type { TicketStatus } from "@/server/db/types";

interface EntrancePanelProps {
  ticket: { id: string; token: string; status: TicketStatus; passId: PassId; isTest: boolean };
  holder: string;
  /** Check-ins already recorded for this ticket: day → time and who. */
  checkins: { day: 1 | 2; at: string; by: string | null }[];
  /** Event day being controlled; null outside the event (pick one). */
  day: 1 | 2 | null;
  /** Result of the last action (?entree=…). */
  result?: string;
  /** Test tickets are refused (the site takes real payments). */
  testRefused: boolean;
}

const time = new Intl.DateTimeFormat("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" });

function Verdict({ ok, title, detail }: { ok: boolean; title: string; detail?: string }) {
  return (
    <div role="status" className={`p-5 text-center ${ok ? "bg-[#1f6f3f] text-paper" : "bg-[#b42318] text-paper"}`}>
      <p className="text-heading font-semibold">{title}</p>
      {detail && <p className="mt-1">{detail}</p>}
    </div>
  );
}

/**
 * Shown on a ticket page to a signed-in admin only: the door decision for
 * the day, in large colours, and the button that records the entry.
 */
export function EntrancePanel({ ticket, holder, checkins, day, result, testRefused }: EntrancePanelProps) {
  const back = `/billet/${ticket.token}`;
  const today = day ? checkins.find((c) => c.day === day) : undefined;
  const onSite = ON_SITE_PASSES.includes(ticket.passId);
  const refusedTest = ticket.isTest && testRefused;

  let verdict: React.ReactNode;
  if (ticket.status === "CANCELLED") verdict = <Verdict ok={false} title="Billet annulé" detail="Refuser l’entrée." />;
  else if (!onSite) verdict = <Verdict ok={false} title="Pass En ligne" detail="Ce pass ne donne pas accès sur place." />;
  else if (refusedTest) verdict = <Verdict ok={false} title="Billet de test" detail="Paiement simulé : refuser l’entrée." />;
  else if (result === "ok" && today) verdict = <Verdict ok title="Entrée validée" detail={`${holder} · ${PASSES[ticket.passId].name}`} />;
  else if (today)
    verdict = <Verdict ok={false} title={`Déjà entré — jour ${today.day}`} detail={`Scanné ${time.format(new Date(today.at))}${today.by ? ` par ${today.by}` : ""}.`} />;

  return (
    <section aria-labelledby="controle" className="mx-auto mt-6 w-full max-w-3xl border-2 border-ink bg-paper p-5">
      <h2 id="controle" className="type-meta text-grey">
        Contrôle à l’entrée {day ? `· jour ${day}` : ""}
      </h2>
      {ticket.isTest && !testRefused && (
        <p className="mt-2 border border-signal px-3 py-1 text-small">
          Billet de test : accepté tant que le site est en mode test (sandbox), refusé dès que les vraies clés de paiement sont en place.
        </p>
      )}
      {result === "erreur" && <p className="mt-2 text-small font-medium text-[#7a1a12]">L’entrée n’a pas pu être enregistrée. Réessayez.</p>}
      {result === "annulee" && <p className="mt-2 text-small">Passage annulé.</p>}

      <div className="mt-4">{verdict}</div>

      {ticket.status !== "CANCELLED" && onSite && !refusedTest && !today && (
        <div className="mt-4 flex flex-wrap gap-3">
          {(day ? [day] : ([1, 2] as const)).map((d) => (
            <form key={d} action={checkIn} className="flex-1">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <input type="hidden" name="day" value={d} />
              <input type="hidden" name="back" value={back} />
              <button
                type="submit"
                className="min-h-16 w-full rounded-input bg-[#1f6f3f] px-6 text-heading font-semibold text-paper hover:bg-[#185a33] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                Valider l’entrée{day ? "" : ` — jour ${d}`}
              </button>
            </form>
          ))}
        </div>
      )}
      {!day && <p className="mt-3 text-small text-grey">Hors des jours de l’événement : choisissez le jour à valider (test).</p>}

      {checkins.length > 0 && (
        <ul className="mt-4 space-y-1 border-t border-ink/10 pt-3 text-small">
          {checkins.map((c) => (
            <li key={c.day} className="flex flex-wrap items-center justify-between gap-2">
              <span>
                Jour {c.day} : entré {time.format(new Date(c.at))}
                {c.by && ` · ${c.by}`}
              </span>
              <form action={undoCheckIn}>
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <input type="hidden" name="day" value={c.day} />
                <input type="hidden" name="back" value={back} />
                <button type="submit" className="text-small underline underline-offset-4">
                  Annuler ce passage
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
