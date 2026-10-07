"use server";

import { randomBytes } from "node:crypto";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";
import { syncOrder } from "@/server/checkout/orders";
import { isMailConfigured } from "@/server/email/mailer";
import { sendOrderEmails } from "@/server/email/tickets";
import { GeniusPayError, refundPayment } from "@/server/payments/geniuspay";

const id = z.string().uuid();

/**
 * Sends the tickets of an order again by e-mail: the whole order, or one
 * ticket (`ticket_id`). Only valid tickets of a paid order are sent.
 */
export async function resendTickets(formData: FormData) {
  const admin = await requireAdmin();
  const orderId = id.parse(formData.get("order_id"));
  const ticketId = formData.get("ticket_id") ? id.parse(formData.get("ticket_id")) : null;
  if (!isMailConfigured()) back(formData, "erreur=smtp");

  let sent = 0;
  try {
    sent = await sendOrderEmails(orderId, { force: true, ...(ticketId ? { ticketIds: [ticketId] } : {}) });
  } catch {
    back(formData, "erreur=email");
  }
  await logAction(await createSessionClient(), admin.id, "resend_email", ticketId ? "tickets" : "orders", ticketId ?? orderId, { sent });
  back(formData, sent > 0 ? "ok=envoye" : "erreur=rien-a-envoyer");
}

/** Where to come back after an action: an admin page only. */
function back(formData: FormData, notice: string): never {
  const raw = String(formData.get("back") ?? "");
  const path = raw.startsWith("/admin/") && !raw.startsWith("//") ? raw.split("?")[0] : "/admin/commandes";
  redirect(`${path}?${notice}`);
}

/** Asks Genius Pay for the real state of the payment and applies it. */
export async function resyncOrder(formData: FormData) {
  const admin = await requireAdmin();
  const orderId = id.parse(formData.get("order_id"));
  let notice = "ok=verifie";
  try {
    const { changed } = await syncOrder(orderId);
    if (changed) revalidateTag(EVENT_SETTINGS_TAG, "max");
    await logAction(await createSessionClient(), admin.id, "resync", "orders", orderId, { changed });
  } catch {
    notice = "erreur=genius";
  }
  back(formData, notice);
}

/**
 * Full refund through Genius Pay, super admins only. Then the order is marked
 * refunded and its tickets cancelled, so they no longer open the doors.
 */
export async function refundOrder(formData: FormData) {
  const admin = await requireAdmin("SUPER_ADMIN");
  const orderId = id.parse(formData.get("order_id"));
  const reason = z.string().trim().min(3).max(200).safeParse(formData.get("reason"));
  if (!reason.success) back(formData, "erreur=motif");

  const db = await createSessionClient();
  const { data: order } = await db.from("orders").select("id, reference, status, refund_required").eq("id", orderId).maybeSingle();
  const { data: payment } = await db
    .from("payments")
    .select("id, provider_reference, status")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!order || !payment?.provider_reference || !(order.status === "PAID" || order.refund_required)) back(formData, "erreur=non-remboursable");

  try {
    await refundPayment(payment!.provider_reference!, `${order!.reference} — ${reason.data}`);
  } catch (e) {
    console.error(`[admin] remboursement refusé pour ${order!.reference} (${e instanceof GeniusPayError ? e.code : "erreur"})`);
    back(formData, e instanceof GeniusPayError && e.code === "REFUND_NOT_ALLOWED" ? "erreur=non-remboursable" : "erreur=genius");
  }

  const now = new Date().toISOString();
  await db.from("orders").update({ status: "REFUNDED", refunded_at: now, refund_required: false }).eq("id", orderId);
  await db.from("tickets").update({ status: "CANCELLED" }).eq("order_id", orderId);
  await db.from("payments").update({ status: "refunded" }).eq("id", payment!.id);
  await logAction(db, admin.id, "refund", "orders", orderId, { reason: reason.data });
  revalidateTag(EVENT_SETTINGS_TAG, "max");
  back(formData, "ok=rembourse");
}

/** A cancelled ticket no longer opens the doors (the order stays paid). */
export async function cancelTicket(formData: FormData) {
  const admin = await requireAdmin();
  const ticketId = id.parse(formData.get("ticket_id"));
  const db = await createSessionClient();
  const { error } = await db.from("tickets").update({ status: "CANCELLED" }).eq("id", ticketId).eq("status", "VALID");
  if (error) back(formData, "erreur=enregistrement");
  await logAction(db, admin.id, "cancel_ticket", "tickets", ticketId);
  back(formData, "ok=billet-annule");
}

/** New secret link and QR code for a ticket (e.g. the link was shared by mistake): the old one stops working. */
export async function reissueTicket(formData: FormData) {
  const admin = await requireAdmin();
  const ticketId = id.parse(formData.get("ticket_id"));
  const db = await createSessionClient();
  const { error } = await db.from("tickets").update({ token: randomBytes(32).toString("hex") }).eq("id", ticketId).eq("status", "VALID");
  if (error) back(formData, "erreur=enregistrement");
  await logAction(db, admin.id, "reissue_ticket", "tickets", ticketId);
  back(formData, "ok=nouveau-lien");
}

/** Designates the captain of a hackathon team (not asked online). */
export async function setCaptain(formData: FormData) {
  const admin = await requireAdmin();
  const teamId = id.parse(formData.get("team_id"));
  const participantId = id.parse(formData.get("participant_id"));
  const db = await createSessionClient();
  const reset = await db.from("hackathon_members").update({ is_captain: false }).eq("team_id", teamId);
  const set = await db.from("hackathon_members").update({ is_captain: true }).eq("team_id", teamId).eq("participant_id", participantId);
  if (reset.error || set.error) back(formData, "erreur=enregistrement");
  await logAction(db, admin.id, "set_captain", "hackathon_teams", teamId);
  back(formData, "ok=capitaine");
}
