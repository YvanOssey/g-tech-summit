"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";

export async function signOut() {
  const supabase = await createSessionClient();
  // Ends this browser's session only; other devices stay signed in.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/admin/login?deconnecte=1");
}

const passwordSchema = z
  .object({
    password: z.string().min(12, "12 caractères minimum.").max(72, "72 caractères maximum."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Les deux mots de passe ne correspondent pas." });

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const parsed = passwordSchema.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { fieldErrors: { password: "Choisissez un mot de passe différent de l’actuel." } };
    if (error.code === "weak_password") return { fieldErrors: { password: "Ce mot de passe est trop faible." } };
    if (error.code === "reauthentication_needed")
      return { error: "Pour des raisons de sécurité, reconnectez-vous avant de changer votre mot de passe." };
    return { error: "Le mot de passe n’a pas pu être enregistré. Réessayez." };
  }

  await logAction(supabase, admin.id, "password_change", "admin_users", admin.id);
  redirect("/admin?mot-de-passe=ok");
}
