import { revalidateTag } from "next/cache";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";
import { syncOrder } from "@/server/checkout/orders";
import { createServiceClient } from "@/server/db/clients";
import { verifyWebhook } from "@/server/payments/geniuspay";

/**
 * Genius Pay notifications. Every call is logged; only signed, recent ones
 * are acted upon, and even then the payment state is re-read from the
 * Genius Pay API rather than taken from the message.
 */
export async function POST(request: Request) {
  if (!process.env.GENIUSPAY_WEBHOOK_SECRET?.trim()) return new Response("Webhook non configuré", { status: 503 });

  const raw = await request.text();
  const valid = verifyWebhook(raw, request.headers.get("x-webhook-timestamp"), request.headers.get("x-webhook-signature"));

  let payload: { event?: string; data?: { transaction?: { reference?: string } } } | null = null;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = null;
  }
  const reference = payload?.data?.transaction?.reference ?? null;

  const db = createServiceClient();
  const { data: logged } = await db
    .from("payment_events")
    .insert({
      provider_reference: reference,
      event: payload?.event ?? request.headers.get("x-webhook-event") ?? "inconnu",
      payload: payload ?? { raw_length: raw.length },
      signature_valid: valid,
    })
    .select("id")
    .single();

  if (!valid) return new Response("Signature invalide", { status: 401 });
  if (!reference) return new Response("OK", { status: 200 });

  const { data: payment } = await db.from("payments").select("order_id").eq("provider_reference", reference).maybeSingle();
  if (!payment) {
    if (logged) await db.from("payment_events").update({ processed_at: new Date().toISOString(), error: "paiement inconnu" }).eq("id", logged.id);
    return new Response("OK", { status: 200 });
  }

  try {
    const { changed } = await syncOrder(payment.order_id);
    if (changed) revalidateTag(EVENT_SETTINGS_TAG, "max");
    if (logged) await db.from("payment_events").update({ processed_at: new Date().toISOString() }).eq("id", logged.id);
    return new Response("OK", { status: 200 });
  } catch (e) {
    if (logged) await db.from("payment_events").update({ error: e instanceof Error ? e.message.slice(0, 200) : "erreur" }).eq("id", logged.id);
    // 5xx: Genius Pay will retry later.
    return new Response("Erreur temporaire", { status: 503 });
  }
}
