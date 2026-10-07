import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PassId } from "@/config/passes";
import type { Database, OrderStatus, TicketStatus } from "@/server/db/types";

type Db = SupabaseClient<Database>;

export interface OrderSummary {
  id: string;
  reference: string;
  status: OrderStatus;
  total: number;
  isTest: boolean;
  refundRequired: boolean;
  createdAt: string;
  paidAt: string | null;
  buyerId: string;
  passes: PassId[];
}

export interface TicketSummary {
  id: string;
  token: string;
  orderId: string;
  participantId: string;
  passId: PassId;
  status: TicketStatus;
  checkedInAt: string | null;
}

export interface TeamSummary {
  id: string;
  orderId: string;
  name: string;
  trackCode: string;
  members: { participantId: string; isCaptain: boolean }[];
}

export interface ParticipantSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string;
  notes: string | null;
  /** Tickets held by this person. */
  tickets: TicketSummary[];
  /** Orders this person paid for (as buyer). */
  orders: OrderSummary[];
  team: TeamSummary | null;
  /** True when every linked order is a sandbox test. */
  isTest: boolean;
}

export interface Registrations {
  participants: ParticipantSummary[];
  orders: OrderSummary[];
  tickets: TicketSummary[];
  teams: TeamSummary[];
  byId: Map<string, ParticipantSummary>;
}

/** A pending order whose 30-minute hold is over no longer holds anything. */
export function effectiveStatus(o: Pick<OrderSummary, "status">, expiresAt?: string | null, now = new Date()): OrderStatus {
  return o.status === "PENDING" && expiresAt && new Date(expiresAt) <= now ? "EXPIRED" : o.status;
}

/**
 * Everything about registrations, read AS the signed-in admin (RLS). Volumes
 * are small (150 places at most), so it is loaded at once and joined here.
 * Anonymised participants are left out.
 */
export async function loadRegistrations(db: Db): Promise<Registrations> {
  const [people, orders, items, tickets, teams, members] = await Promise.all([
    db.from("participants").select("id, first_name, last_name, email, phone, created_at, notes").is("anonymised_at", null).order("created_at", { ascending: false }),
    db.from("orders").select("id, reference, status, total, is_test, refund_required, created_at, paid_at, expires_at, participant_id").order("created_at", { ascending: false }),
    db.from("order_items").select("order_id, pass_id"),
    db.from("tickets").select("id, token, order_id, participant_id, pass_id, status, checked_in_at"),
    db.from("hackathon_teams").select("id, order_id, name, track_code"),
    db.from("hackathon_members").select("team_id, participant_id, is_captain"),
  ]);
  for (const r of [people, orders, items, tickets, teams, members]) {
    if (r.error) throw new Error(`[inscriptions] lecture impossible : ${r.error.code}`);
  }

  const orderList: OrderSummary[] = (orders.data ?? []).map((o) => ({
    id: o.id,
    reference: o.reference,
    status: effectiveStatus(o, o.expires_at),
    total: o.total,
    isTest: o.is_test,
    refundRequired: o.refund_required,
    createdAt: o.created_at,
    paidAt: o.paid_at,
    buyerId: o.participant_id,
    passes: (items.data ?? []).filter((i) => i.order_id === o.id).map((i) => i.pass_id),
  }));
  const ticketList: TicketSummary[] = (tickets.data ?? []).map((t) => ({
    id: t.id,
    token: t.token,
    orderId: t.order_id,
    participantId: t.participant_id,
    passId: t.pass_id,
    status: t.status,
    checkedInAt: t.checked_in_at,
  }));
  const teamList: TeamSummary[] = (teams.data ?? []).map((t) => ({
    id: t.id,
    orderId: t.order_id,
    name: t.name,
    trackCode: t.track_code,
    members: (members.data ?? []).filter((m) => m.team_id === t.id).map((m) => ({ participantId: m.participant_id, isCaptain: m.is_captain })),
  }));

  const participants: ParticipantSummary[] = (people.data ?? []).map((p) => {
    const own = orderList.filter((o) => o.buyerId === p.id);
    const held = ticketList.filter((t) => t.participantId === p.id);
    const linked = [...own.map((o) => o.isTest), ...held.map((t) => orderList.find((o) => o.id === t.orderId)?.isTest ?? false)];
    return {
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      email: p.email,
      phone: p.phone,
      createdAt: p.created_at,
      notes: p.notes,
      tickets: held,
      orders: own,
      team: teamList.find((t) => t.members.some((m) => m.participantId === p.id)) ?? null,
      isTest: linked.length > 0 && linked.every(Boolean),
    };
  });

  return { participants, orders: orderList, tickets: ticketList, teams: teamList, byId: new Map(participants.map((p) => [p.id, p])) };
}

/**
 * Status shown for a person: "PAID" if they hold a valid ticket, otherwise
 * the status of the order they belong to (as buyer or team member).
 */
export function participantStatus(p: ParticipantSummary, data: Registrations): OrderStatus {
  if (p.tickets.some((t) => t.status !== "CANCELLED")) return "PAID";
  const orderIds = new Set([...p.orders.map((o) => o.id), ...(p.team ? [p.team.orderId] : [])]);
  const order = data.orders.find((o) => orderIds.has(o.id));
  return order?.status ?? "PENDING";
}

export interface ParticipantFilters {
  q?: string;
  pass?: PassId;
  /** "paye" | "attente" | "autre" */
  statut?: string;
  /** Include sandbox test registrations. */
  tests?: boolean;
}

/** Same filters for the list and the CSV export. */
export function filterParticipants(data: Registrations, f: ParticipantFilters): ParticipantSummary[] {
  const q = f.q?.trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const plain = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return data.participants.filter((p) => {
    if (!f.tests && p.isTest) return false;
    if (q && ![`${p.firstName} ${p.lastName}`, p.email, p.phone ?? ""].some((v) => plain(v).includes(q))) return false;
    if (f.pass && !p.tickets.some((t) => t.passId === f.pass) && !p.orders.some((o) => o.passes.includes(f.pass!))) return false;
    if (f.statut) {
      const s = participantStatus(p, data);
      if (f.statut === "paye" && s !== "PAID") return false;
      if (f.statut === "attente" && s !== "PENDING") return false;
      if (f.statut === "autre" && (s === "PAID" || s === "PENDING")) return false;
    }
    return true;
  });
}

/** Reads the filters from the query string, ignoring anything unexpected. */
export function readParticipantFilters(params: Record<string, string | string[] | undefined>): ParticipantFilters {
  const one = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const pass = one("pass");
  return {
    q: one("q")?.slice(0, 100),
    pass: pass === "online" || pass === "event" || pass === "hackathon" ? pass : undefined,
    statut: ["paye", "attente", "autre"].includes(one("statut") ?? "") ? one("statut") : undefined,
    tests: one("tests") === "1",
  };
}
