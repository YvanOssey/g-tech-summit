import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { AdminRole, AdminUserRow } from "@/server/db/types";
import { hasRole } from "./roles";
import { createSessionClient } from "./session";

export type Admin = Pick<AdminUserRow, "id" | "email" | "full_name" | "role">;

/**
 * The signed-in account, if it is an active admin. The user is verified with
 * the Supabase Auth server (the proxy only looks for a cookie), then must
 * exist in admin_users and be active. `mfaPending`: two-factor
 * authentication is on for this account but the code was not entered yet.
 * Memoised for one request, so layouts, pages and actions can all call it.
 */
const getSession = cache(async (): Promise<{ admin: Admin; mfaPending: boolean } | null> => {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS lets a user read their own admin_users row only (even before the 2FA code).
  const { data } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();
  if (!data || !data.active) return null;

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const mfaPending = aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2";
  return { admin: { id: data.id, email: data.email, full_name: data.full_name, role: data.role }, mfaPending };
});

/** The signed-in administrator, fully authenticated (2FA code entered if enabled), or null. */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const session = await getSession();
  return session && !session.mfaPending ? session.admin : null;
});

/** Signed in with the password but the two-factor code is still expected. */
export async function isMfaPending(): Promise<boolean> {
  return (await getSession())?.mfaPending ?? false;
}

/**
 * Call at the top of EVERY admin page, Server Action and Route Handler.
 * A layout check alone is not enough: Server Actions can be called directly.
 * - not signed in, or not an active admin → login page;
 * - two-factor code expected → verification page;
 * - signed in without the required role → "access denied" page.
 */
export async function requireAdmin(required: AdminRole = "ADMIN"): Promise<Admin> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.mfaPending) redirect("/admin/verification");
  if (!hasRole(session.admin.role, required)) redirect("/admin/acces-refuse");
  return session.admin;
}
