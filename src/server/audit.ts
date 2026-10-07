import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/server/db/types";

/**
 * Appends to the audit log as the signed-in admin (RLS: admin_id must be them).
 * `changes` holds field names and non-sensitive values only — never payment
 * data, never passwords. A failure is reported without personal data and
 * never blocks the action itself.
 */
export async function logAction(
  supabase: SupabaseClient<Database>,
  adminId: string,
  action: string,
  entity: string,
  entityId?: string | null,
  changes?: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("audit_log")
    .insert({ admin_id: adminId, action, entity, entity_id: entityId ?? null, changes: changes ?? null });
  if (error) console.error(`[audit] ${action} on ${entity} not logged: ${error.code}`);
}
