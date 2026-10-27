import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { EVENT } from "@/config/event";
import { ALL_PASSES, type PassId } from "@/config/passes";
import type { Database, OrderStatus, ProgrammeSlotRow } from "@/server/db/types";

type Db = SupabaseClient<Database>;

export interface PassSales {
  id: PassId;
  /** Paid orders. */
  paid: number;
  /** Pending orders still holding their place. */
  pending: number;
}

export interface RecentOrder {
  reference: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  passes: PassId[];
  buyer: string;
}

export interface UpcomingSlot {
  startsAt: Date;
  slot: Pick<ProgrammeSlotRow, "id" | "day" | "start_time" | "type" | "title" | "subtitle">;
}

export interface DashboardData {
  participants: number;
  ticketsIssued: number;
  sales: PassSales[];
  ordersByStatus: Record<OrderStatus, number>;
  /** FCFA, paid orders only. */
  revenue: number;
  recent: RecentOrder[];
  upcoming: UpcomingSlot[];
  registrationOpen: boolean;
  /** Sandbox orders, kept out of every figure above. */
  testOrders: number;
  /** Paid with no place left: to refund. */
  toRefund: number;
}

const STATUSES: readonly OrderStatus[] = ["PAID", "PENDING", "FAILED", "CANCELLED", "EXPIRED", "REFUNDED"];

/**
 * Everything the dashboard shows, read AS the signed-in admin (RLS applies).
 * Real rows only: an empty database gives zeros and empty lists.
 * Volumes are small (150 places at most), so totals are computed here.
 */
export async function getDashboardData(db: Db, now = new Date()): Promise<DashboardData> {
  const [participants, tickets, orders, items, slots, settings] = await Promise.all([
    db.from("participants").select("id", { count: "exact", head: true }).is("anonymised_at", null),
    db.from("tickets").select("order_id").neq("status", "CANCELLED"),
    db.from("orders").select("id, reference, status, total, created_at, expires_at, participant_id, is_test, refund_required").order("created_at", { ascending: false }),
    db.from("order_items").select("order_id, pass_id"),
    db.from("programme_slots").select("id, day, start_time, type, title, subtitle").eq("published", true).order("day").order("start_time"),
    db.from("event_settings").select("registration_open").maybeSingle(),
  ]);

  for (const r of [participants, tickets, orders, items, slots, settings]) {
    if (r.error) throw new Error(`[dashboard] lecture impossible : ${r.error.code}`);
  }

  const allOrders = orders.data ?? [];
  const orderRows = allOrders.filter((o) => !o.is_test);
  const byOrder = new Map(orderRows.map((o) => [o.id, o]));

  // Sales per pass.
  const sales: PassSales[] = ALL_PASSES.map((id) => ({ id, paid: 0, pending: 0 }));
  for (const item of items.data ?? []) {
    const order = byOrder.get(item.order_id);
    const line = sales.find((s) => s.id === item.pass_id);
    if (!order || !line) continue;
    if (order.status === "PAID") line.paid += 1;
    else if (order.status === "PENDING" && order.expires_at && new Date(order.expires_at) > now) line.pending += 1;
  }

  const ordersByStatus = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  let revenue = 0;
  for (const o of orderRows) {
    // A pending order whose 30-minute hold is over no longer holds anything.
    const status = o.status === "PENDING" && o.expires_at && new Date(o.expires_at) <= now ? "EXPIRED" : o.status;
    ordersByStatus[status] += 1;
    if (o.status === "PAID") revenue += o.total;
  }

  // Five most recent orders, with the buyer's name.
  const latest = orderRows.slice(0, 5);
  const buyerIds = [...new Set(latest.map((o) => o.participant_id))];
  const buyers = buyerIds.length
    ? ((await db.from("participants").select("id, first_name, last_name").in("id", buyerIds)).data ?? [])
    : [];
  const recent: RecentOrder[] = latest.map((o) => {
    const b = buyers.find((p) => p.id === o.participant_id);
    return {
      reference: o.reference,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
      passes: (items.data ?? []).filter((i) => i.order_id === o.id).map((i) => i.pass_id),
      buyer: b ? `${b.first_name} ${b.last_name}` : "—",
    };
  });

  // Next published slots. Abidjan is UTC+0 all year.
  const upcoming: UpcomingSlot[] = (slots.data ?? [])
    .map((slot) => ({ slot, startsAt: new Date(`${EVENT.days[slot.day - 1].iso}T${slot.start_time}Z`) }))
    .filter((u) => u.startsAt > now)
    .slice(0, 5);

  return {
    participants: participants.count ?? 0,
    ticketsIssued: (tickets.data ?? []).filter((t) => byOrder.has(t.order_id)).length,
    sales,
    ordersByStatus,
    revenue,
    recent,
    upcoming,
    registrationOpen: settings.data?.registration_open ?? false,
    testOrders: allOrders.length - orderRows.length,
    toRefund: orderRows.filter((o) => o.refund_required).length,
  };
}
