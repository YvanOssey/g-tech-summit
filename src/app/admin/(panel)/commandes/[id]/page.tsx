import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { TestBadge } from "@/components/admin/filters";
import { ActionButton } from "@/components/admin/forms";
import { OrderStatusBadge } from "@/components/admin/status";
import { Notice, PageHeader } from "@/components/admin/ui";
import { PASSES } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";
import { formatFCFA } from "@/lib/format";
import { requireAdmin } from "@/server/auth/require-admin";
import { hasRole } from "@/server/auth/roles";
import { createSessionClient } from "@/server/auth/session";
import { loadRegistrations } from "@/server/repositories/registrations";
import { refundOrder, resendTickets, resyncOrder, setCaptain } from "../actions";
import { ActionNotices } from "../notices";
import { TicketRows } from "../TicketRows";

export const metadata: Metadata = { title: "Commande" };

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Abidjan" });

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, { id }, query] = await Promise.all([requireAdmin(), params, searchParams]);
  if (!z.string().uuid().safeParse(id).success) notFound();

  const db = await createSessionClient();
  const data = await loadRegistrations(db);
  const order = data.orders.find((o) => o.id === id);
  if (!order) notFound();

  const { data: payments } = await db
    .from("payments")
    .select("provider_reference, status, amount, fees, payment_method, environment, created_at, completed_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });
  const buyer = data.byId.get(order.buyerId);
  const team = data.teams.find((t) => t.orderId === id);
  const tickets = data.tickets.filter((t) => t.orderId === id);
  const back = `/admin/commandes/${id}`;
  const superAdmin = hasRole(admin.role, "SUPER_ADMIN");
  const refundable = order.status === "PAID" || order.refundRequired;

  return (
    <>
      <PageHeader
        title={`Commande ${order.reference}`}
        description={`Créée le ${date.format(new Date(order.createdAt))}${order.paidAt ? ` · payée le ${date.format(new Date(order.paidAt))}` : ""}`}
        actions={
          <>
            {order.status === "PAID" && (
              <form action={resendTickets}>
                <input type="hidden" name="order_id" value={order.id} />
                <input type="hidden" name="back" value={back} />
                <ActionButton confirm="Renvoyer par e-mail tous les billets de cette commande à leurs titulaires ?">Renvoyer tous les billets</ActionButton>
              </form>
            )}
            <form action={resyncOrder}>
              <input type="hidden" name="order_id" value={order.id} />
              <input type="hidden" name="back" value={back} />
              <ActionButton>Revérifier le paiement</ActionButton>
            </form>
          </>
        }
      />
      <ActionNotices params={query} />
      {order.refundRequired && (
        <Notice tone="error">Payée après la fin de la réservation, sans place restante : cette commande doit être remboursée.</Notice>
      )}

      <dl className="mb-10 grid gap-x-8 gap-y-4 border border-ink/10 bg-paper p-5 text-small sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-grey">Statut</dt>
          <dd className="mt-1">
            <OrderStatusBadge status={order.status} />
            {order.isTest && <TestBadge />}
          </dd>
        </div>
        <div>
          <dt className="text-grey">Acheteur</dt>
          <dd className="mt-1">
            {buyer ? (
              <Link href={`/admin/participants/${buyer.id}`} className="font-medium hover:underline">
                {buyer.firstName} {buyer.lastName}
              </Link>
            ) : (
              "—"
            )}
            {buyer && <span className="block text-grey">{buyer.email}</span>}
          </dd>
        </div>
        <div>
          <dt className="text-grey">Pass</dt>
          <dd className="mt-1">{order.passes.map((p) => PASSES[p].name).join(" + ")}</dd>
        </div>
        <div>
          <dt className="text-grey">Montant</dt>
          <dd className="mt-1 font-mono tabular-nums">{formatFCFA(order.total)}</dd>
        </div>
      </dl>

      <div className="grid gap-10 xl:grid-cols-2">
        <section aria-labelledby="billets">
          <h2 id="billets" className="mb-3 font-semibold">
            Billets
          </h2>
          <TicketRows tickets={tickets} data={data} back={back} />
        </section>

        <section aria-labelledby="paiement">
          <h2 id="paiement" className="mb-3 font-semibold">
            Paiement Genius Pay
          </h2>
          {(payments ?? []).length === 0 ? (
            <p className="text-small text-grey">Aucun paiement créé pour cette commande.</p>
          ) : (
            <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
              {payments!.map((p) => (
                <li key={p.provider_reference ?? p.created_at} className="grid gap-1 px-4 py-3 sm:grid-cols-2">
                  <span className="font-mono">{p.provider_reference ?? "—"}</span>
                  <span>
                    {p.status}
                    {p.environment && ` · ${p.environment}`}
                  </span>
                  <span className="text-grey">
                    {formatFCFA(p.amount)}
                    {p.fees != null && ` · frais ${formatFCFA(p.fees)}`}
                  </span>
                  <span className="text-grey">
                    {p.payment_method ?? "moyen non indiqué"}
                    {p.completed_at && ` · ${date.format(new Date(p.completed_at))}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {team && (
        <section aria-labelledby="equipe" className="mt-10">
          <h2 id="equipe" className="mb-3 font-semibold">
            Équipe « {team.name} » · {TRACKS.find((t) => t.code === team.trackCode)?.name ?? team.trackCode}
          </h2>
          <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
            {team.members.map((m) => {
              const person = data.byId.get(m.participantId);
              return (
                <li key={m.participantId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <span>
                    {person ? `${person.firstName} ${person.lastName}` : "—"}
                    {m.isCaptain && <span className="ml-2 font-semibold">· Capitaine</span>}
                  </span>
                  {!m.isCaptain && (
                    <form action={setCaptain}>
                      <input type="hidden" name="team_id" value={team.id} />
                      <input type="hidden" name="participant_id" value={m.participantId} />
                      <input type="hidden" name="back" value={back} />
                      <ActionButton>Désigner capitaine</ActionButton>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {superAdmin && refundable && (
        <section aria-labelledby="rembourser" className="mt-10 max-w-xl border border-[#b42318]/30 bg-paper p-5">
          <h2 id="rembourser" className="font-semibold">
            Rembourser
          </h2>
          <p className="mt-1 text-small text-grey">
            Remboursement total de {formatFCFA(order.total)} via Genius Pay. Tous les billets de la commande sont annulés. Action
            irréversible, inscrite au journal.
          </p>
          <form action={refundOrder} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="order_id" value={order.id} />
            <input type="hidden" name="back" value={back} />
            <label className="min-w-64 flex-1 text-small font-semibold">
              Motif
              <input
                name="reason"
                required
                minLength={3}
                maxLength={200}
                className="mt-1 block min-h-10 w-full rounded-input border border-ink/25 bg-paper px-3 font-normal"
                placeholder="Ex. plus de place, annulation demandée…"
              />
            </label>
            <ActionButton danger confirm={`Rembourser ${formatFCFA(order.total)} pour la commande ${order.reference} ? Les billets seront annulés.`}>
              Rembourser
            </ActionButton>
          </form>
        </section>
      )}
    </>
  );
}
