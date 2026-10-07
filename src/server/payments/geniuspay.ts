import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Genius Pay merchant API (doc: API_Documentation.md supplied by the
 * organisers). Always over HTTPS so the secret key never travels in clear.
 * Keys live in server-only environment variables.
 */
const BASE_URL = "https://geniuspay.ci/api/v1/merchant";
const TIMEOUT_MS = 15_000;

export type GeniusPayStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded";

export interface GeniusPayPayment {
  reference: string;
  external_reference?: string | null;
  amount: number;
  fees?: number | null;
  /** Absent from some creation responses (the payment is then pending). */
  status?: GeniusPayStatus;
  payment_method?: string | null;
  checkout_url?: string | null;
  environment?: "sandbox" | "live" | null;
  completed_at?: string | null;
}

export class GeniusPayError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(`Genius Pay: ${code} (${status})`);
  }
}

function keys() {
  const apiKey = process.env.GENIUSPAY_API_KEY?.trim();
  const apiSecret = process.env.GENIUSPAY_API_SECRET?.trim();
  if (!apiKey || !apiSecret) throw new GeniusPayError("NOT_CONFIGURED", 0);
  return { apiKey, apiSecret };
}

export function isGeniusPayConfigured(): boolean {
  return Boolean(process.env.GENIUSPAY_API_KEY?.trim() && process.env.GENIUSPAY_API_SECRET?.trim());
}

/** Test keys contain "sandbox": such orders are flagged as test orders. */
export function isSandbox(): boolean {
  return (process.env.GENIUSPAY_API_KEY ?? "").includes("_sandbox_");
}

async function call<T>(method: "GET" | "POST", path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
  const { apiKey, apiSecret } = keys();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "X-API-Key": apiKey,
      "X-API-Secret": apiSecret,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const json = (await response.json().catch(() => null)) as { success?: boolean; data?: T; error?: { code?: string } } | null;
  if (!response.ok || !json?.success || !json.data) throw new GeniusPayError(json?.error?.code ?? "UNEXPECTED_RESPONSE", response.status);
  return json.data;
}

/** Creates a hosted checkout. `externalReference` (our order reference) makes retries safe. */
export function createPayment(input: {
  amount: number;
  description: string;
  externalReference: string;
  customer: { name: string; email: string; phone: string };
  successUrl: string;
  errorUrl: string;
}): Promise<GeniusPayPayment> {
  return call<GeniusPayPayment>(
    "POST",
    "/payments",
    {
      amount: input.amount,
      currency: "XOF",
      description: input.description,
      external_reference: input.externalReference,
      customer: { ...input.customer, country: "CI" },
      success_url: input.successUrl,
      error_url: input.errorUrl,
      metadata: { order_reference: input.externalReference },
    },
    input.externalReference,
  );
}

export function getPayment(reference: string): Promise<GeniusPayPayment> {
  return call<GeniusPayPayment>("GET", `/payments/${encodeURIComponent(reference)}`);
}

/**
 * Webhook signature: HMAC-SHA256(secret, timestamp + "." + raw body), hex.
 * Rejects messages older than 5 minutes (replays).
 */
export function verifyWebhook(rawBody: string, timestamp: string | null, signature: string | null, now = Date.now()): boolean {
  const secret = process.env.GENIUSPAY_WEBHOOK_SECRET?.trim();
  if (!secret || !timestamp || !signature) return false;

  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || Math.abs(now / 1000 - seconds) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
