import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterCheckbox, FilterSearch, FilterSelect, TestBadge } from "@/components/admin/filters";
import { OrderStatusBadge } from "@/components/admin/status";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { ALL_PASSES, PASSES } from "@/config/passes";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { filterParticipants, loadRegistrations, participantStatus, readParticipantFilters } from "@/server/repositories/registrations";

export const metadata: Metadata = { title: "Participants" };

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Abidjan" });

export default async function ParticipantsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin(), searchParams]);
  const filters = readParticipantFilters(params);
  const data = await loadRegistrations(await createSessionClient());
  const rows = filterParticipants(data, filters);
  const exportQuery = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => typeof e[1] === "string")).toString();

  return (
    <>
      <PageHeader
        title="Participants"
        description="Toutes les personnes inscrites : acheteurs et membres d’équipe."
        actions={
          rows.length > 0 && (
            <a
              href={`/api/admin/export/participants${exportQuery ? `?${exportQuery}` : ""}`}
              className="inline-flex min-h-10 items-center rounded-input border border-ink/25 px-4 text-small font-semibold hover:border-ink"
            >
              Exporter en CSV ({rows.length})
            </a>
          )
        }
      />

      <FilterBar resetHref="/admin/participants">
        <FilterSearch name="q" label="Recherche" defaultValue={filters.q} placeholder="Nom, e-mail ou téléphone" />
        <FilterSelect name="pass" label="Pass" defaultValue={filters.pass} options={ALL_PASSES.map((id) => ({ value: id, label: PASSES[id].name }))} />
        <FilterSelect
          name="statut"
          label="Statut"
          defaultValue={filters.statut}
          options={[
            { value: "paye", label: "Payé" },
            { value: "attente", label: "En attente" },
            { value: "autre", label: "Échoué, annulé, expiré, remboursé" },
          ]}
        />
        <FilterCheckbox name="tests" label="Inclure les tests" defaultChecked={filters.tests} />
      </FilterBar>

      {rows.length === 0 ? (
        <EmptyState title={data.participants.length === 0 ? "0 participant" : "Aucun participant ne correspond"}>
          <p>{data.participants.length === 0 ? "Aucune inscription pour le moment." : "Modifiez ou réinitialisez les filtres."}</p>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full text-left text-small">
            <thead className="border-b border-ink/10 text-grey">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Participant</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Contact</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Pass</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Équipe</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((p) => {
                const passes = [...new Set([...p.tickets.map((t) => t.passId), ...p.orders.flatMap((o) => o.passes)])];
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/participants/${p.id}`} className="font-medium hover:underline">
                        {p.firstName} {p.lastName}
                      </Link>
                      {p.isTest && <TestBadge />}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="block">{p.email}</span>
                      <span className="text-grey">{p.phone ?? "—"}</span>
                    </td>
                    <td className="px-4 py-2.5">{passes.map((id) => PASSES[id].name.replace("Pass ", "")).join(", ") || "—"}</td>
                    <td className="px-4 py-2.5">{p.team?.name ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <OrderStatusBadge status={participantStatus(p, data)} />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-grey">{date.format(new Date(p.createdAt))}</td>
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
