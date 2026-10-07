"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { createServiceClient } from "@/server/db/clients";
import { fieldErrors, optionalText } from "@/server/validation";

const id = z.string().uuid();
const role = z.enum(["ADMIN", "SUPER_ADMIN"]);

const grantSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(254),
  full_name: z.string().max(120, "120 caractères maximum.").nullable(),
  role,
});

/**
 * Gives back-office access to an EXISTING Supabase account (created in the
 * Supabase dashboard). Inviting by e-mail needs a custom SMTP server, which
 * is not configured yet.
 */
export async function grantAccess(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin("SUPER_ADMIN");
  const parsed = grantSchema.safeParse({
    email: formData.get("email"),
    full_name: optionalText(formData.get("full_name")),
    role: formData.get("role"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  // Looking up an account by e-mail needs the Auth admin API (server only).
  const service = createServiceClient();
  const { data: list, error: listError } = await service.auth.admin.listUsers({ perPage: 1000 });
  if (listError) return { error: "La liste des comptes Supabase n’a pas pu être lue." };
  const user = list.users.find((u) => u.email?.toLowerCase() === parsed.data.email);
  if (!user) {
    return {
      fieldErrors: {
        email: "Aucun compte Supabase avec cette adresse. Créez-le d’abord dans Supabase (Authentication → Users → Create new user).",
      },
    };
  }

  if (user.id === admin.id) return { fieldErrors: { email: "C’est votre propre compte : son accès ne se modifie pas ici." } };

  const db = await createSessionClient();
  const { data: existing } = await db.from("admin_users").select("role, active").eq("id", user.id).maybeSingle();
  if (existing?.role === "SUPER_ADMIN" && existing.active && parsed.data.role !== "SUPER_ADMIN" && (await otherActiveSuperAdmins(db, user.id)) === 0) {
    return { error: "Impossible : il doit toujours rester au moins un super administrateur actif." };
  }

  const { error } = await db
    .from("admin_users")
    .upsert({ id: user.id, email: parsed.data.email, full_name: parsed.data.full_name, role: parsed.data.role, active: true });
  if (error) return { error: "L’accès n’a pas pu être donné." };

  await logAction(db, admin.id, "grant", "admin_users", user.id, { role: parsed.data.role });
  redirect("/admin/administrateurs?ok=ajoute");
}

/** Number of active super admins other than `exceptId`. */
async function otherActiveSuperAdmins(db: Awaited<ReturnType<typeof createSessionClient>>, exceptId: string) {
  const { count } = await db
    .from("admin_users")
    .select("id", { count: "exact", head: true })
    .eq("role", "SUPER_ADMIN")
    .eq("active", true)
    .neq("id", exceptId);
  return count ?? 0;
}

export async function updateAdmin(formData: FormData) {
  const admin = await requireAdmin("SUPER_ADMIN");
  const targetId = id.parse(formData.get("id"));
  // You never change your own access: another super admin has to.
  if (targetId === admin.id) redirect("/admin/administrateurs?erreur=soi-meme");

  const change = z
    .discriminatedUnion("kind", [
      z.object({ kind: z.literal("role"), role }),
      z.object({ kind: z.literal("active"), active: z.enum(["true", "false"]).transform((v) => v === "true") }),
    ])
    .parse(Object.fromEntries(formData));

  const db = await createSessionClient();
  const { data: target } = await db.from("admin_users").select("role, active").eq("id", targetId).maybeSingle();
  if (!target) redirect("/admin/administrateurs");

  const losesSuperAdmin =
    target.role === "SUPER_ADMIN" &&
    target.active &&
    ((change.kind === "role" && change.role !== "SUPER_ADMIN") || (change.kind === "active" && !change.active));
  if (losesSuperAdmin && (await otherActiveSuperAdmins(db, targetId)) === 0) redirect("/admin/administrateurs?erreur=dernier");

  const update = change.kind === "role" ? { role: change.role } : { active: change.active };
  const { error } = await db.from("admin_users").update(update).eq("id", targetId);
  if (error) redirect("/admin/administrateurs?erreur=enregistrement");

  await logAction(db, admin.id, change.kind === "role" ? "change_role" : change.active ? "activate" : "deactivate", "admin_users", targetId, update);
  redirect("/admin/administrateurs?ok=modifie");
}
