"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";

export type Enrollment = { factorId: string; qr: string; secret: string } | { error: string };

/** Step 1: creates a pending authenticator and returns its QR code. */
export async function startMfaEnrollment(): Promise<Enrollment> {
  await requireAdmin();
  const supabase = await createSessionClient();

  // An abandoned earlier attempt would block a new one: remove it.
  const { data: factors } = await supabase.auth.mfa.listFactors();
  for (const f of factors?.all ?? []) {
    if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
  }

  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Admin G-TECH SUMMIT", issuer: "G-TECH SUMMIT" });
  if (error || !data) return { error: "La double authentification n’a pas pu être préparée. Réessayez." };
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

/** Step 2: the first code from the app proves the setup works, then it is on. */
export async function confirmMfaEnrollment(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const factorId = z.string().uuid().safeParse(formData.get("factor_id"));
  const code = z.string().trim().regex(/^\d{6}$/).safeParse(formData.get("code"));
  if (!factorId.success) return { error: "Recommencez l’activation." };
  if (!code.success) return { fieldErrors: { code: "Le code compte 6 chiffres." } };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factorId.data, code: code.data });
  if (error) return { fieldErrors: { code: "Code incorrect. Saisissez le code affiché maintenant dans l’application." } };

  await logAction(supabase, admin.id, "mfa_enable", "admin_users", admin.id);
  redirect("/admin/securite?ok=active");
}

export async function disableMfa(formData: FormData) {
  const admin = await requireAdmin();
  const factorId = z.string().uuid().parse(formData.get("factor_id"));
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) redirect("/admin/securite?erreur=1");
  await logAction(supabase, admin.id, "mfa_disable", "admin_users", admin.id);
  redirect("/admin/securite?ok=desactive");
}
