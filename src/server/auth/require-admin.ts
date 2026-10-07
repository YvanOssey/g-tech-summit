import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { AdminRole, AdminUserRow } from "@/server/db/types";
import { hasRole } from "./roles";
import { createSessionClient } from "./session";

export type Admin = Pick<AdminUserRow, "id" | "email" | "full_name" | "role">;

/**
 * The signed-in administrator, or null. This is the real check (the proxy only
 * looks for a cookie): the user is verified with the Supabase Auth server, then
 * must exist in admin_users and be active.
 * Memoised for one request, so layouts, pages and actions can all call it.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS lets a user read their own admin_users row only.
  const { data } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, active")
    .eq("id", user.id)
    .maybeSingle();
  if (!data || !data.active) return null;

  return { id: data.id, email: data.email, full_name: data.full_name, role: data.role };
});

/**
 * Call at the top of EVERY admin page, Server Action and Route Handler.
 * A layout check alone is not enough: Server Actions can be called directly.
 * - not signed in, or not an active admin → login page;
 * - signed in without the required role → "access denied" page.
 */
export async function requireAdmin(required: AdminRole = "ADMIN"): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (!hasRole(admin.role, required)) redirect("/admin/acces-refuse");
  return admin;
}
