import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterCheckbox, FilterSearch, TestBadge } from "@/components/admin/filters";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { EVENT } from "@/config/event";
import { PASSES } from "@/config/passes";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { ON_SITE_PASSES, eventDay, pickDay, testTicketsRefused } from "@/server/checkin";
import { loadRegistrations } from "@/server/repositories/registrations";
import { checkIn, undoCheckIn } from "./actions";

export const metadata: Metadata = { title: "Contrôle à l’entrée" };

const RESULT: Record<string, { ok: boolean; text: string }> = {
  ok: { ok: true, text: "Entrée validée." },
  deja: { ok: false, text: "Déjà entré ce jour-là : entrée refusée." },
  annule: { ok: false, text: "Billet annulé : entrée refusée." },
  "en-ligne": { ok: false, text: "Pass En ligne : pas d’accès sur place." },
  test: { ok: false, text: "Billet de test (paiement simulé) : entrée refusée." },
  annulee: { ok: true, text: "Passage annulé." },
  erreur: { ok: false, text: "L’entrée n’a pas pu être enregistrée. Réessayez." },
};

export default async function EntrancePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const one = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const day = pickDay(one("jour")) ?? 1;
  const q = one("q")?.trim().toLowerCase() ?? "";
  const tests = one("tests") === "1";

  const db = await createSessionClient();
  const [data, { data: checkins }] = await Promise.all([loadRegistrations(db), db.from("ticket_checkins").select("ticket_id, day")]);
  const entered = new Set((checkins ?? []).filter((c) => c.day === day).map((c) => c.ticket_id));
  const testOrders = new Set(data.orders.filter((o) => o.isTest).map((o) => o.id));

  const expected = data.tickets.filter((t) => t.status !== "CANCELLED" && ON_SITE_PASSES.includes(t.passId) && (tests || !testOrders.has(t.orderId)));
  const matches = q
    ? expected.filter((t) => {
        const p = data.byId.get(t.participantId);
        return p && `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(q);
      })
    : [];
  const result = one("entree") ? RESULT[one("entree")!] : undefined;
  const refuseTests = testTicketsRefused();
  const today = eventDay();

  return (
    <>
      <PageHeader
        title="Contrôle à l’entrée"
        description={`${EVENT.days[day - 1].label} · ${expected.filter((t) => entered.has(t.id)).length} entrée${expected.filter((t) => entered.has(t.id)).length > 1 ? "s" : ""} sur ${expected.length} billet${expected.length > 1 ? "s" : ""} donnant accès sur place.`}
        actions={
          <div className="flex gap-1.5">
            {([1, 2] as const).map((d) => (
              <Link
                key={d}
                href={`/admin/controle?jour=${d}${tests ? "&tests=1" : ""}`}
                aria-current={d === day ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-input border px-4 text-small font-semibold ${d === day ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"}`}
              >
                Jour {d}
                {today === d && " (aujourd’hui)"}
              </Link>
            ))}
          </div>
        }
      />
      {result && <Notice tone={result.ok ? "info" : "error"}>{result.text}</Notice>}

      <section aria-labelledby="mode" className="mb-8 border border-ink/10 bg-paper p-5 text-small">
        <h2 id="mode" className="font-semibold">
          Scanner un billet
        </h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Sur le téléphone de contrôle, connectez-vous à cette administration (une seule fois).</li>
          <li>Ouvrez l’appareil photo du téléphone et visez le QR code du billet : il ouvre la page du billet.</li>
          <li>Le verdict s’affiche en grand : vert, appuyez sur « Valider l’entrée » ; rouge, refusez l’entrée.</li>
        </ol>
        <p className="mt-2 text-grey">Un billet ne peut entrer qu’une fois par jour. Le Pass En ligne n’ouvre pas les portes.</p>
      </section>

      <h2 className="mb-3 font-semibold">Sans QR code : rechercher la personne</h2>
      <FilterBar resetHref={`/admin/controle?jour=${day}`}>
        <input type="hidden" name="jour" value={day} />
        <FilterSearch name="q" label="Nom ou e-mail" defaultValue={one("q")} />
        <FilterCheckbox name="tests" label="Inclure les tests" defaultChecked={tests} />
      </FilterBar>

      {q &&
        (matches.length === 0 ? (
          <EmptyState title="Aucun billet ne correspond">
            <p>Vérifiez l’orthographe, ou cherchez par e-mail. Un billet annulé ou un Pass En ligne n’apparaît pas ici.</p>
          </EmptyState>
        ) : (
          <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
            {matches.map((t) => {
              const p = data.byId.get(t.participantId)!;
              const inside = entered.has(t.id);
              return (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="font-medium">
                      {p.firstName} {p.lastName}
                    </span>
                    {testOrders.has(t.orderId) && <TestBadge />}
                    <span className="block text-grey">
                      {PASSES[t.passId].name}
                      {p.team && ` · équipe ${p.team.name}`}
                    </span>
                  </span>
                  {inside ? (
                    <form action={undoCheckIn} className="flex items-center gap-3">
                      <span className="font-semibold text-[#155230]">Entré</span>
                      <input type="hidden" name="ticket_id" value={t.id} />
                      <input type="hidden" name="day" value={day} />
                      <input type="hidden" name="back" value="/admin/controle" />
                      <button type="submit" className="underline underline-offset-4">
                        Annuler
                      </button>
                    </form>
                  ) : refuseTests && testOrders.has(t.orderId) ? (
                    <span className="font-semibold text-[#b42318]">Billet de test : refusé</span>
                  ) : (
                    <form action={checkIn}>
                      <input type="hidden" name="ticket_id" value={t.id} />
                      <input type="hidden" name="day" value={day} />
                      <input type="hidden" name="back" value="/admin/controle" />
                      <button type="submit" className="min-h-11 rounded-input bg-[#1f6f3f] px-5 font-semibold text-paper hover:bg-[#185a33]">
                        Valider l’entrée
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        ))}
    </>
  );
}
