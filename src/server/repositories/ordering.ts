import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/server/db/types";

type OrderedTable = "faq_items" | "partners";

/**
 * Swaps a row with its neighbour above or below. Positions are renumbered
 * 1…n first, so gaps or duplicates left by earlier edits never block a move.
 * Returns false when the row is already first/last or does not exist.
 */
export async function moveRow(
  db: SupabaseClient<Database>,
  table: OrderedTable,
  id: string,
  direction: "up" | "down",
): Promise<boolean> {
  const { data, error } = await db.from(table).select("id, position").order("position").order("created_at");
  if (error || !data) throw new Error(`[ordering] ${table}: ${error?.code}`);

  const ids = data.map((r) => r.id);
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= ids.length) return false;

  [ids[from], ids[to]] = [ids[to], ids[from]];
  const updates = ids
    .map((rowId, i) => ({ id: rowId, position: i + 1 }))
    .filter((r) => data.find((d) => d.id === r.id)?.position !== r.position);

  for (const u of updates) {
    const res = await db.from(table).update({ position: u.position }).eq("id", u.id);
    if (res.error) throw new Error(`[ordering] ${table}: ${res.error.code}`);
  }
  return true;
}

/** Position for a new row: after the last one. */
export async function nextPosition(db: SupabaseClient<Database>, table: OrderedTable): Promise<number> {
  const { data } = await db.from(table).select("position").order("position", { ascending: false }).limit(1);
  return (data?.[0]?.position ?? 0) + 1;
}
