import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterCheckbox, FilterSearch, FilterSelect, TestBadge } from "@/components/admin/filters";
import { ORDER_STATUS_LABEL, OrderStatusBadge } from "@/components/admin/status";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { PASSES } from "@/config/passes";
import { formatFCFA } from "@/lib/format";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import type { OrderStatus } from "@/server/db/types";
import { loadRegistrations } from "@/server/repositories/registrations";

export const metadata: Metadata = { title: "Commandes & billets" };

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Abidjan" });

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const one = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const q = one("q")?.trim().toLowerCase();
  const statut = one("statut") as OrderStatus | "REMBOURSER" | undefined;
  const tests = one("tests") === "1";

  const data = await loadRegistrations(await createSessionClient());
  const rows = data.orders.filter((o) => {
    if (!tests && o.isTest) return false;
    if (statut === "REMBOURSER" ? !o.refundRequired : statut && o.status !== statut) return false;
    if (q) {
      const buyer = data.byId.get(o.buyerId);
      if (![o.reference, buyer ? `${buyer.firstName} ${buyer.lastName} ${buyer.email}` : ""].some((v) => v.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <>
      <PageHeader title="Commandes & billets" description="Chaque commande, ses pass, son paiement et ses billets nominatifs." />
      <FilterBar resetHref="/admin/commandes">
        <FilterSearch name="q" label="Recherche" defaultValue={one("q")} placeholder="Référence, nom ou e-mail de l’acheteur" />
        <FilterSelect
          name="statut"
          label="Statut"
          defaultValue={statut}
          options={[
            ...(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => ({ value: s, label: ORDER_STATUS_LABEL[s] })),
            { value: "REMBOURSER", label: "À rembourser" },
          ]}
        />
        <FilterCheckbox name="tests" label="Inclure les tests" defaultChecked={tests} />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title={data.orders.length === 0 ? "0 commande" : "Aucune commande ne correspond"}>
          <p>{data.orders.length === 0 ? "Aucune inscription pour le moment." : "Modifiez ou réinitialisez les filtres."}</p>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full text-left text-small">
            <thead className="border-b border-ink/10 text-grey">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Référence</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Acheteur</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Pass</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Montant</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Billets</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((o) => {
                const buyer = data.byId.get(o.buyerId);
                return (
                  <tr key={o.id}>
                    <td className="px-4 py-2.5 font-mono whitespace-nowrap">
                      <Link href={`/admin/commandes/${o.id}`} className="hover:underline">
                        {o.reference}
                      </Link>
                      {o.isTest && <TestBadge />}
                    </td>
                    <td className="px-4 py-2.5">{buyer ? `${buyer.firstName} ${buyer.lastName}` : "—"}</td>
                    <td className="px-4 py-2.5">{o.passes.map((p) => PASSES[p].name.replace("Pass ", "")).join(" + ")}</td>
                    <td className="px-4 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">{formatFCFA(o.total)}</td>
                    <td className="px-4 py-2.5">
                      <OrderStatusBadge status={o.status} />
                      {o.refundRequired && <span className="mt-1 block font-medium text-[#7a1a12]">À rembourser</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">{data.tickets.filter((t) => t.orderId === o.id && t.status !== "CANCELLED").length}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-grey">{date.format(new Date(o.createdAt))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
