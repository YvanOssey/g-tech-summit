import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/require-admin";

/**
 * Any unknown /admin/… address: answered with the admin 404 (inside the
 * panel layout), and only to a signed-in admin — visitors go to login first.
 */
export default async function UnknownAdminPage() {
  await requireAdmin();
  notFound();
}
