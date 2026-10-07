import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterCheckbox, TestBadge } from "@/components/admin/filters";
import { OrderStatusBadge } from "@/components/admin/status";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { PASSES } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { loadRegistrations } from "@/server/repositories/registrations";

export const metadata: Metadata = { title: "Équipes hackathon" };

export default async function TeamsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const tests = params.tests === "1";
  const data = await loadRegistrations(await createSessionClient());
  const teams = data.teams
    .map((t) => ({ team: t, order: data.orders.find((o) => o.id === t.orderId) }))
    .filter(({ order }) => order && (tests || !order.isTest));
  const confirmed = teams.filter(({ order }) => order?.status === "PAID").length;

  return (
    <>
      <PageHeader
        title="Équipes hackathon"
        description={`${confirmed} équipe${confirmed > 1 ? "s" : ""} confirmée${confirmed > 1 ? "s" : ""} sur ${PASSES.hackathon.capacity.total}. Le capitaine se désigne depuis la fiche commande.`}
      />
      <FilterBar resetHref="/admin/equipes">
        <FilterCheckbox name="tests" label="Inclure les tests" defaultChecked={tests} />
      </FilterBar>

      {teams.length === 0 ? (
        <EmptyState title="Aucune équipe inscrite">
          <p>Les équipes apparaissent ici dès leur inscription en ligne.</p>
        </EmptyState>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {teams.map(({ team, order }) => (
            <li key={team.id} className="border border-ink/10 bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {team.name}
                    {order?.isTest && <TestBadge />}
                  </p>
                  <p className="text-small text-grey">{TRACKS.find((t) => t.code === team.trackCode)?.name ?? team.trackCode}</p>
                </div>
                {order && <OrderStatusBadge status={order.status} />}
              </div>
              <ul className="mt-3 space-y-1 text-small">
                {team.members.map((m) => {
                  const person = data.byId.get(m.participantId);
                  return (
                    <li key={m.participantId}>
                      <Link href={`/admin/participants/${m.participantId}`} className="hover:underline">
                        {person ? `${person.firstName} ${person.lastName}` : "—"}
                      </Link>
                      {m.isCaptain && <span className="font-semibold"> · capitaine</span>}
                      {person && <span className="text-grey"> · {person.email}</span>}
                    </li>
                  );
                })}
              </ul>
              {order && (
                <p className="mt-3 text-small">
                  <Link href={`/admin/commandes/${order.id}`} className="underline underline-offset-4">
                    Commande {order.reference}
                  </Link>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
