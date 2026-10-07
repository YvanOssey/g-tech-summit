import type { Metadata } from "next";
import { ActionButton } from "@/components/admin/forms";
import { Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { ROLE_LABEL } from "@/server/auth/roles";
import { createSessionClient } from "@/server/auth/session";
import { createServiceClient } from "@/server/db/clients";
import { resetMfa, updateAdmin } from "./actions";
import { GrantForm } from "./GrantForm";

export const metadata: Metadata = { title: "Administrateurs" };

const OK: Record<string, string> = { ajoute: "Accès donné.", modifie: "Compte modifié.", mfa: "Double authentification réinitialisée : la personne pourra la réactiver." };
const ERR: Record<string, string> = {
  "soi-meme": "Vous ne pouvez pas modifier votre propre accès : demandez à un autre super administrateur.",
  dernier: "Impossible : il doit toujours rester au moins un super administrateur actif.",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Abidjan" });

export default async function AdminsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [me, params] = await Promise.all([requireAdmin("SUPER_ADMIN"), searchParams]);
  const db = await createSessionClient();
  const { data: admins } = await db
    .from("admin_users")
    .select("id, email, full_name, role, active, last_sign_in_at")
    .order("created_at");
  // Which accounts have two-factor authentication on (Auth admin API, server only).
  const { data: users } = await createServiceClient().auth.admin.listUsers({ perPage: 1000 });
  const withMfa = new Set((users?.users ?? []).filter((u) => (u.factors ?? []).some((f) => f.status === "verified")).map((u) => u.id));

  return (
    <>
      <PageHeader title="Administrateurs" description="Les comptes qui ont accès à cette administration." />
      {params.ok && OK[params.ok] && <Notice>{OK[params.ok]}</Notice>}
      {params.erreur && ERR[params.erreur] && <Notice tone="error">{ERR[params.erreur]}</Notice>}

      <div className="overflow-x-auto border border-ink/10 bg-paper">
        <table className="w-full text-left text-small">
          <thead className="border-b border-ink/10 text-grey">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Compte</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Rôle</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Statut</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Double auth.</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Dernière connexion</th>
              <th scope="col" className="px-4 py-2.5 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {admins?.map((a) => {
              const self = a.id === me.id;
              return (
                <tr key={a.id}>
                  <td className="px-4 py-2.5">
                    <span className="block font-medium">{a.full_name ?? a.email}</span>
                    {a.full_name && <span className="text-grey">{a.email}</span>}
                    {self && <span className="text-grey"> (vous)</span>}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{ROLE_LABEL[a.role]}</td>
                  <td className="px-4 py-2.5">{a.active ? "Actif" : "Désactivé"}</td>
                  <td className="px-4 py-2.5">{withMfa.has(a.id) ? "Activée" : "—"}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-grey">{a.last_sign_in_at ? date.format(new Date(a.last_sign_in_at)) : "Jamais"}</td>
                  <td className="px-4 py-2.5">
                    {!self && (
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <form action={updateAdmin}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="kind" value="role" />
                          <input type="hidden" name="role" value={a.role === "ADMIN" ? "SUPER_ADMIN" : "ADMIN"} />
                          <ActionButton confirm={a.role === "ADMIN" ? `Donner tous les droits à ${a.email} ?` : `Retirer les droits de super administrateur à ${a.email} ?`}>
                            {a.role === "ADMIN" ? "Passer super admin" : "Passer admin"}
                          </ActionButton>
                        </form>
                        {withMfa.has(a.id) && (
                          <form action={resetMfa}>
                            <input type="hidden" name="id" value={a.id} />
                            <ActionButton confirm={`Réinitialiser la double authentification de ${a.email} ? Son compte ne sera plus protégé que par le mot de passe jusqu’à ce qu’elle la réactive.`}>
                              Réinitialiser la 2FA
                            </ActionButton>
                          </form>
                        )}
                        <form action={updateAdmin}>
                          <input type="hidden" name="id" value={a.id} />
                          <input type="hidden" name="kind" value="active" />
                          <input type="hidden" name="active" value={a.active ? "false" : "true"} />
                          <ActionButton danger={a.active} confirm={a.active ? `Désactiver l’accès de ${a.email} ?` : undefined}>
                            {a.active ? "Désactiver" : "Réactiver"}
                          </ActionButton>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section aria-labelledby="ajouter" className="mt-10 max-w-2xl">
        <h2 id="ajouter" className="font-semibold">
          Donner l’accès à un compte
        </h2>
        <ol className="mt-2 mb-5 list-decimal space-y-1 pl-5 text-small text-grey">
          <li>
            Dans Supabase : Authentication → Users → Add user → <span className="text-ink">Create new user</span>, avec l’adresse de la
            personne et un mot de passe provisoire, « Auto Confirm User » coché.
          </li>
          <li>Transmettez-lui ce mot de passe par un canal privé ; elle le changera depuis l’administration.</li>
          <li>Ajoutez son adresse ci-dessous.</li>
        </ol>
        <GrantForm />
        <p className="mt-3 text-small text-grey">
          Les invitations par e-mail seront possibles une fois un service d’envoi d’e-mails (SMTP) configuré dans Supabase.
        </p>
      </section>
    </>
  );
}
