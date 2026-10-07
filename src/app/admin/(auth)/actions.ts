"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { SITE_URL } from "@/config/site";
import { logAction } from "@/server/audit";
import { safeNext } from "@/server/auth/safe-next";
import { createSessionClient } from "@/server/auth/session";
import { hasDatabase } from "@/server/db/env";
import { allow, clientIp } from "@/server/rate-limit";

/** Same message whatever went wrong: never reveal whether an address has an account. */
const INVALID = "Adresse e-mail ou mot de passe incorrect.";
const TOO_MANY = "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
const NOT_CONFIGURED = "La base de données n’est pas configurée sur ce serveur.";

const email = z.string().trim().toLowerCase().email().max(254);

const signInSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!hasDatabase) return { error: NOT_CONFIGURED };

  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: INVALID };

  // 5 attempts per 10 minutes for one address from one network, 20 per network overall.
  const ip = await clientIp();
  if (!allow(`signin:${ip}:${parsed.data.email}`, 5, 600_000) || !allow(`signin:${ip}`, 20, 600_000)) return { error: TOO_MANY };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: error?.status === 429 ? TOO_MANY : INVALID };

  // A valid Supabase account is not enough: it must be an active administrator.
  const { data: admin } = await supabase.from("admin_users").select("active").eq("id", data.user.id).maybeSingle();
  if (!admin?.active) {
    await supabase.auth.signOut();
    return { error: INVALID };
  }

  await supabase.from("admin_users").update({ last_sign_in_at: new Date().toISOString() }).eq("id", data.user.id);
  await logAction(supabase, data.user.id, "sign_in", "admin_users", data.user.id);

  redirect(safeNext(formData.get("suite")));
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!hasDatabase) return { error: NOT_CONFIGURED };

  const parsed = email.safeParse(formData.get("email"));
  if (!parsed.success) return { fieldErrors: { email: "Saisissez une adresse e-mail valide." } };
  if (!allow(`reset:${await clientIp()}`, 3, 900_000)) return { error: TOO_MANY };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${SITE_URL}/admin/callback` });
  if (error?.status === 429) return { error: TOO_MANY };

  // Same answer whether or not the address exists.
  return {
    message:
      "Si cette adresse correspond à un compte administrateur, un lien de réinitialisation vient d’être envoyé. Il est valable une heure.",
  };
}
