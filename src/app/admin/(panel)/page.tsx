import type { Metadata } from "next";
import Link from "next/link";
import { ORDER_STATUS_LABEL, OrderStatusBadge } from "@/components/admin/status";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { PASSES } from "@/config/passes";
import { SESSION_TYPE_LABEL } from "@/content/programme";
import { formatAmount, formatFCFA } from "@/lib/format";
import { getDashboardData } from "@/server/repositories/dashboard";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";

export const metadata: Metadata = { title: "Tableau de bord" };

const dateTime = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Abidjan",
});
const dayTime = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Abidjan" });

function plural(n: number, one: string, many: string) {
  return `${formatAmount(n)} ${n > 1 ? many : one}`;
}

/** Real figures only: an empty database shows zeros and empty states. */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const data = await getDashboardData(await createSessionClient());

  const figures = [
    { label: "Participants", value: formatAmount(data.participants) },
    { label: "Billets émis", value: formatAmount(data.ticketsIssued) },
    { label: "Commandes payées", value: formatAmount(data.ordersByStatus.PAID) },
    { label: "Chiffre d’affaires", value: formatFCFA(data.revenue) },
  ];

  return (
    <>
      {params["mot-de-passe"] === "ok" && <Notice>Votre mot de passe a été enregistré.</Notice>}
      {data.toRefund > 0 && (
        <Notice tone="error">
          {data.toRefund} commande{data.toRefund > 1 ? "s" : ""} payée{data.toRefund > 1 ? "s" : ""} sans place restante : à rembourser.
        </Notice>
      )}
      {data.testOrders > 0 && (
        <Notice>
          {data.testOrders} commande{data.testOrders > 1 ? "s" : ""} de test (paiement simulé) ne {data.testOrders > 1 ? "sont" : "est"} pas
          comptée{data.testOrders > 1 ? "s" : ""} dans ces chiffres.
        </Notice>
      )}
      <PageHeader
        title="Tableau de bord"
        description={
          data.registrationOpen
            ? "Inscriptions en ligne ouvertes."
            : "Inscriptions en ligne fermées : aucune vente n’est possible pour le moment."
        }
      />

      {/* Key figures: one bordered strip, not a wall of cards. */}
      <dl className="grid grid-cols-2 border border-ink/10 bg-paper lg:grid-cols-4">
        {figures.map((f, i) => (
          <div key={f.label} className={`px-5 py-4 ${i % 2 ? "border-l border-ink/10" : ""} ${i >= 2 ? "border-t border-ink/10 lg:border-t-0 lg:border-l" : ""}`}>
            <dt className="text-small text-grey">{f.label}</dt>
            <dd className="mt-1 font-mono text-[1.375rem] leading-tight font-medium tabular-nums">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 xl:grid-cols-[3fr_2fr]">
        <section aria-labelledby="ventes">
          <h2 id="ventes" className="mb-3 font-semibold">
            Ventes par pass
          </h2>
          <div className="overflow-x-auto border border-ink/10 bg-paper">
            <table className="w-full text-left text-small">
              <thead className="border-b border-ink/10 text-grey">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Pass</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Payés</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">En attente</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium">Restants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {data.sales.map((s) => {
                  const pass = PASSES[s.id];
                  const left = Math.max(pass.capacity.total - s.paid - s.pending, 0);
                  return (
                    <tr key={s.id}>
                      <th scope="row" className="px-4 py-2.5 font-medium">
                        {pass.name}
                        <span className="block font-normal text-grey">
                          {formatFCFA(pass.price)} / {pass.per} · {pass.capacity.total} {pass.capacity.unit}
                        </span>
                      </th>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{s.paid}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{s.pending}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                        {left} / {pass.capacity.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="paiements">
          <h2 id="paiements" className="mb-3 font-semibold">
            Commandes par statut
          </h2>
          <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
            {(Object.keys(data.ordersByStatus) as (keyof typeof data.ordersByStatus)[]).map((status) => (
              <li key={status} className="flex items-center justify-between px-4 py-2.5">
                <span>{ORDER_STATUS_LABEL[status]}</span>
                <span className="font-mono tabular-nums">{data.ordersByStatus[status]}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-[3fr_2fr]">
        <section aria-labelledby="recentes">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 id="recentes" className="font-semibold">
              Inscriptions récentes
            </h2>
            {data.recent.length > 0 && (
              <Link href="/admin/commandes" className="text-small underline underline-offset-4 hover:text-signal-text">
                Toutes les commandes
              </Link>
            )}
          </div>
          {data.recent.length === 0 ? (
            <EmptyState title={plural(0, "participant", "participants")}>
              <p>Aucune inscription pour le moment.</p>
            </EmptyState>
          ) : (
            <div className="overflow-x-auto border border-ink/10 bg-paper">
              <table className="w-full text-left text-small">
                <thead className="border-b border-ink/10 text-grey">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Référence</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Acheteur</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Pass</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Montant</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {data.recent.map((o) => (
                    <tr key={o.reference}>
                      <td className="px-4 py-2.5 font-mono">{o.reference}</td>
                      <td className="px-4 py-2.5">{o.buyer}</td>
                      <td className="px-4 py-2.5">{o.passes.map((p) => PASSES[p].name.replace("Pass ", "")).join(" + ")}</td>
                      <td className="px-4 py-2.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums whitespace-nowrap">{formatFCFA(o.total)}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-grey">{dateTime.format(new Date(o.createdAt))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="a-venir">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 id="a-venir" className="font-semibold">
              Programme à venir
            </h2>
            <Link href="/admin/programme" className="text-small underline underline-offset-4 hover:text-signal-text">
              Programme
            </Link>
          </div>
          {data.upcoming.length === 0 ? (
            <EmptyState title="Aucun créneau à venir">
              <p>Aucun créneau publié n’est prévu après aujourd’hui.</p>
            </EmptyState>
          ) : (
            <ol className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
              {data.upcoming.map(({ slot, startsAt }) => (
                <li key={slot.id} className="grid grid-cols-[6.5rem_1fr] gap-3 px-4 py-2.5">
                  <span className="font-mono text-grey tabular-nums">{dayTime.format(startsAt)}</span>
                  <span>
                    <span className="font-medium">{slot.title}</span>
                    {slot.subtitle && <span className="text-grey"> — {slot.subtitle}</span>}
                    <span className="block text-grey">{SESSION_TYPE_LABEL[slot.type]}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
