import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { HOLD_MINUTES, PASSES, orderTotal, type PassId } from "@/config/passes";
import { createServiceClient } from "@/server/db/clients";
import { sendOrderEmails } from "@/server/email/tickets";
import type { OrderStatus } from "@/server/db/types";
import { GeniusPayError, createPayment, getPayment, isSandbox, type GeniusPayStatus } from "@/server/payments/geniuspay";
import type { CheckoutInput } from "./schema";

const CAPACITIES = Object.fromEntries(Object.values(PASSES).map((p) => [p.id, p.capacity.total])) as Record<PassId, number>;

/** GTS- + 6 characters without look-alikes (0/O, 1/I/L). */
function newReference(): string {
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  return `GTS-${Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join("")}`;
}

export type StartResult = { ok: true; checkoutUrl: string } | { ok: false; error: string };

/**
 * Creates the order (places checked and held atomically in the database),
 * then the Genius Pay checkout. Prices and the total come from passes.ts,
 * never from the browser.
 */
export async function startOrder(input: CheckoutInput, siteUrl: string): Promise<StartResult> {
  const db = createServiceClient();
  await releaseEarlierHolds(input.buyer.email, input.buyer.phone);
  const accessToken = randomBytes(32).toString("base64url");
  const total = orderTotal(input.passes);

  const team = input.team
    ? {
        name: input.team.name,
        track_code: input.team.track_code,
        members: [
          // Captain not asked online: can be set later from the admin.
          { is_buyer: true, is_captain: false },
          ...input.team.teammates.map((t) => ({ is_buyer: false, is_captain: false, ...t })),
        ],
      }
    : null;

  let orderId: string | null = null;
  let reference = "";
  for (let attempt = 0; attempt < 3 && !orderId; attempt++) {
    reference = newReference();
    const { data, error } = await db.rpc("create_order", {
      p_order: {
        reference,
        access_token: accessToken,
        is_test: isSandbox(),
        total,
        buyer: input.buyer,
        items: input.passes.map((id) => ({ pass_id: id, unit_price: PASSES[id].price })),
        team,
      },
      p_capacities: CAPACITIES,
      p_hold_minutes: HOLD_MINUTES,
    });
    if (error?.message.startsWith("SOLD_OUT:")) {
      const pass = error.message.split(":")[1] as PassId;
      return { ok: false, error: `Il n’y a plus de place pour le ${PASSES[pass]?.name ?? "pass choisi"}.` };
    }
    if (error && error.code !== "23505") {
      console.error(`[checkout] commande non créée (${error.code})`);
      return { ok: false, error: "Votre commande n’a pas pu être enregistrée. Réessayez dans un instant." };
    }
    orderId = data ?? null; // 23505 = reference already used: try another one
  }
  if (!orderId) return { ok: false, error: "Votre commande n’a pas pu être enregistrée. Réessayez dans un instant." };

  const back = `${siteUrl}/billetterie/confirmation?c=${accessToken}`;
  try {
    const payment = await createPayment({
      amount: total,
      description: `G-TECH SUMMIT 2026 — ${input.passes.map((id) => PASSES[id].name).join(" + ")} — ${reference}`,
      externalReference: reference,
      customer: { name: `${input.buyer.first_name} ${input.buyer.last_name}`, email: input.buyer.email, phone: input.buyer.phone },
      successUrl: back,
      errorUrl: back,
    });
    const checkoutUrl = payment.checkout_url ?? "";
    if (!new URL(checkoutUrl).hostname.endsWith("geniuspay.ci")) throw new GeniusPayError("UNEXPECTED_CHECKOUT_URL", 0);

    const saved = await db.from("payments").insert({
      order_id: orderId,
      provider_reference: payment.reference,
      // The creation response may omit some fields: a new payment is pending, for the order total.
      status: payment.status ?? "pending",
      amount: payment.amount ?? total,
      fees: payment.fees ?? null,
      checkout_url: checkoutUrl,
      environment: payment.environment ?? null,
    });
    // Without this row the payment could never be matched to the order: stop before the buyer pays.
    if (saved.error) {
      console.error(`[checkout] paiement ${payment.reference} non enregistré (${saved.error.code}: ${saved.error.message})`);
      throw new GeniusPayError("PAYMENT_NOT_RECORDED", 0);
    }
    return { ok: true, checkoutUrl };
  } catch (e) {
    // Free the places straight away.
    await db.from("orders").update({ status: "CANCELLED", cancelled_at: new Date().toISOString() }).eq("id", orderId);
    console.error(`[checkout] paiement non créé pour ${reference} (${e instanceof GeniusPayError ? e.code : "erreur réseau"})`);
    return { ok: false, error: "Le service de paiement ne répond pas. Aucun montant n’a été prélevé : réessayez dans un instant." };
  }
}

/**
 * One buyer holds places for one order at a time: a new order cancels the
 * same buyer's unpaid orders still on hold (same e-mail or same phone). A
 * buyer starting again frees their earlier places, and one person cannot
 * stack orders to block a pass. Should an earlier order be paid anyway, it is
 * only accepted if places are left, otherwise flagged for refund
 * (finalize_order).
 */
async function releaseEarlierHolds(email: string, phone: string): Promise<void> {
  const db = createServiceClient();
  const [byEmail, byPhone] = await Promise.all([
    db.from("participants").select("id").eq("email", email),
    db.from("participants").select("id").eq("phone", phone),
  ]);
  const ids = [...new Set([...(byEmail.data ?? []), ...(byPhone.data ?? [])].map((p) => p.id))];
  if (ids.length === 0) return;
  const { error } = await db
    .from("orders")
    .update({ status: "CANCELLED", cancelled_at: new Date().toISOString() })
    .in("participant_id", ids)
    .eq("status", "PENDING")
    .eq("is_test", isSandbox())
    .gt("expires_at", new Date().toISOString());
  if (error) console.error(`[checkout] anciennes réservations non libérées (${error.code})`);
}

/**
 * Asks Genius Pay for the real state of an order's payment and applies it.
 * Never trusts the browser nor the webhook body: the API is the source.
 * Safe to call any number of times. Returns the order status afterwards.
 */
export async function syncOrder(orderId: string): Promise<{ status: OrderStatus; changed: boolean }> {
  const db = createServiceClient();
  const { data: order } = await db.from("orders").select("id, reference, status, total, refund_required").eq("id", orderId).maybeSingle();
  if (!order) throw new Error("[checkout] commande introuvable");

  const { data: payment } = await db
    .from("payments")
    .select("id, provider_reference")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!payment?.provider_reference || order.status === "REFUNDED") return { status: order.status, changed: false };

  const gp = await getPayment(payment.provider_reference);

  await db
    .from("payments")
    .update({
      status: gp.status,
      fees: gp.fees ?? null,
      payment_method: gp.payment_method ?? null,
      completed_at: gp.completed_at ?? null,
      ...(gp.environment ? { environment: gp.environment } : {}),
    })
    .eq("id", payment.id);

  if (gp.status === "completed") {
    if (gp.amount !== order.total || (gp.external_reference && gp.external_reference !== order.reference)) {
      console.error(`[checkout] ${order.reference} : montant ou référence Genius Pay incohérents, commande non validée`);
      return { status: order.status, changed: false };
    }
    const { data: result, error } = await db.rpc("finalize_order", {
      p_order_id: order.id,
      p_completed_at: gp.completed_at ?? new Date().toISOString(),
      p_capacities: CAPACITIES,
    });
    if (error) throw new Error(`[checkout] validation impossible (${error.code})`);
    if (result === "no_place") console.warn(`[checkout] ${order.reference} payée sans place restante : à rembourser`);
    // Tickets by e-mail, in the background: a mail failure never blocks the order (admins can re-send).
    if (result === "paid") {
      void sendOrderEmails(order.id).catch((e) => console.error(`[email] billets de ${order.reference} non envoyés (${e instanceof Error ? e.message.slice(0, 120) : "erreur"})`));
    }
    const { data: after } = await db.from("orders").select("status").eq("id", order.id).single();
    return { status: after?.status ?? order.status, changed: result !== "already_paid" };
  }

  const next: Partial<Record<GeniusPayStatus, OrderStatus>> = { failed: "FAILED", cancelled: "CANCELLED", refunded: "REFUNDED" };
  const target = next[gp.status ?? "pending"];
  if (target && (order.status === "PENDING" || target === "REFUNDED")) {
    const now = new Date().toISOString();
    await db
      .from("orders")
      .update({
        status: target,
        ...(target === "REFUNDED" ? { refunded_at: now, refund_required: false } : { cancelled_at: now }),
      })
      .eq("id", order.id);
    return { status: target, changed: true };
  }
  return { status: order.status, changed: false };
}
