import { revalidateTag } from "next/cache";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";
import { syncOrder } from "@/server/checkout/orders";
import { createServiceClient } from "@/server/db/clients";

/**
 * Called by the confirmation page while a payment is pending: asks Genius Pay
 * for the real state (never trusts the browser) and applies it. The order is
 * identified by its secret access token, never by its readable reference.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { c?: unknown } | null;
  const token = typeof body?.c === "string" && /^[A-Za-z0-9_-]{43}$/.test(body.c) ? body.c : null;
  if (!token) return Response.json({ error: "invalid" }, { status: 400 });

  const db = createServiceClient();
  const { data: order } = await db.from("orders").select("id, status").eq("access_token", token).maybeSingle();
  if (!order) return Response.json({ error: "not_found" }, { status: 404 });
  if (order.status !== "PENDING") return Response.json({ status: order.status });

  try {
    const { status, changed } = await syncOrder(order.id);
    // Sold places change the public gauges.
    if (changed) revalidateTag(EVENT_SETTINGS_TAG, "max");
    return Response.json({ status });
  } catch {
    return Response.json({ status: order.status, retry: true });
  }
}
