import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { TestBadge } from "@/components/admin/filters";
import { OrderStatusBadge } from "@/components/admin/status";
import { PageHeader } from "@/components/admin/ui";
import { PASSES } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";
import { formatFCFA } from "@/lib/format";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { loadRegistrations, participantStatus } from "@/server/repositories/registrations";
import { ActionNotices } from "../../commandes/notices";
import { TicketRows } from "../../commandes/TicketRows";
import { ParticipantForm } from "../ParticipantForm";

export const metadata: Metadata = { title: "Participant" };

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Abidjan" });

export default async function ParticipantPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [, { id }, query] = await Promise.all([requireAdmin(), params, searchParams]);
  if (!z.string().uuid().safeParse(id).success) notFound();

  const data = await loadRegistrations(await createSessionClient());
  const p = data.byId.get(id);
  if (!p) notFound();

  const relatedOrderIds = new Set([...p.orders.map((o) => o.id), ...(p.team ? [p.team.orderId] : []), ...p.tickets.map((t) => t.orderId)]);
  const orders = data.orders.filter((o) => relatedOrderIds.has(o.id));
  const back = `/admin/participants/${id}`;

  return (
    <>
      <PageHeader title={`${p.firstName} ${p.lastName}`} description={`Inscrit le ${date.format(new Date(p.createdAt))}`} />
      <ActionNotices params={query} />
      <p className="-mt-4 mb-8 flex flex-wrap items-center gap-2 text-small">
        <OrderStatusBadge status={participantStatus(p, data)} />
        {p.isTest && <TestBadge />}
        {p.team && (
          <span>
            Équipe « {p.team.name} » ({TRACKS.find((t) => t.code === p.team?.trackCode)?.name ?? p.team.trackCode})
            {p.team.members.find((m) => m.participantId === p.id)?.isCaptain && " · capitaine"}
          </span>
        )}
      </p>

      <div className="grid gap-10 xl:grid-cols-[3fr_2fr]">
        <section aria-labelledby="infos">
          <h2 id="infos" className="mb-3 font-semibold">
            Informations
          </h2>
          <ParticipantForm participant={p} />
          <p className="mt-2 text-small text-grey">Le nom figure sur le billet : corrigez-le seulement à la demande de la personne.</p>
        </section>

        <div className="space-y-10">
          <section aria-labelledby="billets">
            <h2 id="billets" className="mb-3 font-semibold">
              Billets
            </h2>
            <TicketRows tickets={p.tickets} data={data} back={back} showHolder={false} />
          </section>

          <section aria-labelledby="commandes">
            <h2 id="commandes" className="mb-3 font-semibold">
              Commandes
            </h2>
            {orders.length === 0 ? (
              <p className="text-small text-grey">Aucune commande.</p>
            ) : (
              <ul className="divide-y divide-ink/10 border border-ink/10 bg-paper text-small">
                {orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                    <span>
                      <Link href={`/admin/commandes/${o.id}`} className="font-mono hover:underline">
                        {o.reference}
                      </Link>
                      <span className="block text-grey">
                        {o.passes.map((x) => PASSES[x].name).join(" + ")} · {formatFCFA(o.total)}
                        {o.buyerId !== p.id && " · payée par un coéquipier"}
                      </span>
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
