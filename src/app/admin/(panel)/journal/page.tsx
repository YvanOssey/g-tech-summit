import type { Metadata } from "next";
import { EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";

export const metadata: Metadata = { title: "Journal d’activité" };

const ACTION: Record<string, string> = {
  sign_in: "Connexion",
  password_change: "Changement de mot de passe",
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  move: "Réordonnancement",
  publish: "Publication",
  unpublish: "Masquage",
  grant: "Accès donné",
  change_role: "Changement de rôle",
  activate: "Compte réactivé",
  deactivate: "Compte désactivé",
};

const ENTITY: Record<string, string> = {
  admin_users: "Administrateurs",
  faq_items: "FAQ",
  partners: "Partenaires",
  event_settings: "Paramètres",
  programme_slots: "Programme",
};

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "medium", timeZone: "Africa/Abidjan" });
const LIMIT = 200;

export default async function JournalPage() {
  await requireAdmin("SUPER_ADMIN");
  const db = await createSessionClient();
  const [{ data: entries, error }, { data: admins }] = await Promise.all([
    db.from("audit_log").select("id, admin_id, action, entity, entity_id, created_at").order("created_at", { ascending: false }).limit(LIMIT),
    db.from("admin_users").select("id, email, full_name"),
  ]);
  const who = new Map((admins ?? []).map((a) => [a.id, a.full_name ?? a.email]));

  return (
    <>
      <PageHeader title="Journal d’activité" description={`Les ${LIMIT} dernières actions dans l’administration. Il ne contient ni mot de passe ni donnée de paiement.`} />
      {error && <Notice tone="error">Le journal n’a pas pu être chargé.</Notice>}
      {entries && entries.length === 0 ? (
        <EmptyState title="Aucune action enregistrée" />
      ) : (
        <div className="overflow-x-auto border border-ink/10 bg-paper">
          <table className="w-full text-left text-small">
            <thead className="border-b border-ink/10 text-grey">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Qui</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Action</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {entries?.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-2 font-mono whitespace-nowrap text-grey tabular-nums">{date.format(new Date(e.created_at))}</td>
                  <td className="px-4 py-2">{e.admin_id ? (who.get(e.admin_id) ?? "Compte supprimé") : "Compte supprimé"}</td>
                  <td className="px-4 py-2">{ACTION[e.action] ?? e.action}</td>
                  <td className="px-4 py-2">{ENTITY[e.entity] ?? e.entity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
