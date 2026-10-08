"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { ON_SITE_PASSES, testTicketsRefused } from "@/server/checkin";

const id = z.string().uuid();
const day = z.enum(["1", "2"]).transform((v): 1 | 2 => (v === "1" ? 1 : 2));

/** Back to the page the scan came from (ticket page or entrance list). */
function back(formData: FormData, result: string): never {
  const raw = String(formData.get("back") ?? "");
  const safe = /^\/(admin\/controle|billet\/[a-f0-9]{64})$/.test(raw.split("?")[0]) ? raw.split("?")[0] : "/admin/controle";
  const jour = formData.get("day") === "2" ? "2" : "1";
  redirect(`${safe}?jour=${jour}&entree=${result}`);
}

/**
 * Lets a ticket holder in for one event day. Refused for a cancelled
 * ticket, the online pass, a test ticket once the site takes real payments,
 * or a ticket already scanned that day (the database refuses a second
 * check-in for the same day).
 */
export async function checkIn(formData: FormData) {
  const admin = await requireAdmin();
  const ticketId = id.parse(formData.get("ticket_id"));
  const d = day.parse(formData.get("day"));
  const db = await createSessionClient();

  const { data: ticket } = await db.from("tickets").select("status, pass_id, order_id").eq("id", ticketId).maybeSingle();
  if (!ticket || ticket.status === "CANCELLED") back(formData, "annule");
  if (!ON_SITE_PASSES.includes(ticket!.pass_id)) back(formData, "en-ligne");
  if (testTicketsRefused()) {
    const { data: order } = await db.from("orders").select("is_test").eq("id", ticket!.order_id).maybeSingle();
    if (!order || order.is_test) back(formData, "test");
  }

  const { error } = await db.from("ticket_checkins").insert({ ticket_id: ticketId, day: d, checked_by: admin.id });
  if (error?.code === "23505") back(formData, "deja");
  if (error) back(formData, "erreur");

  await logAction(db, admin.id, "checkin", "tickets", ticketId, { day: d });
  back(formData, "ok");
}

/** Cancels a check-in recorded by mistake. */
export async function undoCheckIn(formData: FormData) {
  const admin = await requireAdmin();
  const ticketId = id.parse(formData.get("ticket_id"));
  const d = day.parse(formData.get("day"));
  const db = await createSessionClient();
  const { error } = await db.from("ticket_checkins").delete().eq("ticket_id", ticketId).eq("day", d);
  if (error) back(formData, "erreur");
  await logAction(db, admin.id, "undo_checkin", "tickets", ticketId, { day: d });
  back(formData, "annulee");
}
