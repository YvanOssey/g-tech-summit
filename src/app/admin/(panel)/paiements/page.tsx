import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterCheckbox, TestBadge } from "@/components/admin/filters";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { formatFCFA } from "@/lib/format";
import { requireAdmin } from "@/server/auth/require-admin";
import { hasRole } from "@/server/auth/roles";
import { createSessionClient } from "@/server/auth/session";

export const metadata: Metadata = { title: "Paiements" };

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Abidjan" });

const STATUS: Record<string, string> = {
  pending: "En attente",
  processing: "En cours",
  completed: "Réussi",
  failed: "Échoué",
  cancelled: "Annulé",
  refunded: "Remboursé",
};

/** Read-only: statuses come from Genius Pay, never from a manual entry. */
export default async function PaymentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const tests = params.tests === "1";
  const db = await createSessionClient();
  const [{ data: payments }, { data: orders }] = await Promise.all([
    db.from("payments").select("id, order_id, provider_reference, status, amount, fees, payment_method, environment, created_at").order("created_at", { ascending: false }),
    db.from("orders").select("id, reference, is_test"),
  ]);
  const orderOf = new Map((orders ?? []).map((o) => [o.id, o]));
  const rows = (payments ?? []).filter((p) => tests || !orderOf.get(p.order_id)?.is_test);
  const completed = rows.filter((p) => p.status === "completed");
  const fees = completed.reduce((sum, p) => sum + (p.fees ?? 0), 0);

  // Webhook log: super admins only (RLS).
  const superAdmin = hasRole(admin.role, "SUPER_ADMIN");
  const { data: events } = superAdmin
    ? await db.from("payment_events").select("id, provider_reference, event, signature_valid, received_at, processed_at, error").order("received_at", { ascending: false }).limit(50)
    : { data: null };

  return (
    <>
      <PageHeader
        title="Paiements"
        description={`Les transactions Genius Pay. ${completed.length} réussi${completed.length > 1 ? "s" : ""}, ${formatFCFA(fees)} de frais Genius Pay.`}
      />
      <FilterBar resetHref="/admin/paiements">
        <FilterCheckbox name="tests" label="Inclure les tests (sandbox)" defaultChecked={tests} />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title="Aucun paiement">
          <p>Aucun paiement n’a encore été créé.</p>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full text-left text-small">
            <thead className="border-b border-ink/10 text-grey">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Référence Genius Pay</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Commande</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Moyen</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Montant</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Frais</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((p) => {
                const order = orderOf.get(p.order_id);
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-2.5 font-mono">{p.provider_reference ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono whitespace-nowrap">
                      <Link href={`/admin/commandes/${p.order_id}`} className="hover:underline">
                        {order?.reference ?? "—"}
                      </Link>
                      {order?.is_test && <TestBadge />}
                    </td>
                    <td className="px-4 py-2.5">{STATUS[p.status] ?? p.status}</td>
                    <td className="px-4 py-2.5">{p.payment_method ?? "—"}</td>
                    <td className="px-4 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">{formatFCFA(p.amount)}</td>
                    <td className="px-4 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">{p.fees != null ? formatFCFA(p.fees) : "—"}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-grey">{date.format(new Date(p.created_at))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {superAdmin && (
        <section aria-labelledby="webhooks" className="mt-10">
          <h2 id="webhooks" className="mb-1 font-semibold">
            Notifications Genius Pay (webhooks)
          </h2>
          <p className="mb-3 text-small text-grey">Les 50 dernières. Une signature invalide est refusée et n’a aucun effet.</p>
          {(events ?? []).length === 0 ? (
            <EmptyState title="Aucune notification reçue">
              <p>Normal tant que le site n’est pas en ligne et que le webhook n’est pas déclaré chez Genius Pay.</p>
            </EmptyState>
          ) : (
            <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
              {events!.map((e) => (
                <li key={e.id} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[10rem_1fr_auto]">
                  <span className="font-mono text-grey">{date.format(new Date(e.received_at))}</span>
                  <span>
                    {e.event} · <span className="font-mono">{e.provider_reference ?? "—"}</span>
                    {e.error && <span className="block text-[#7a1a12]">{e.error}</span>}
                  </span>
                  <span className={e.signature_valid ? "" : "font-medium text-[#7a1a12]"}>
                    {e.signature_valid ? (e.processed_at ? "traitée" : "reçue") : "signature invalide"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
