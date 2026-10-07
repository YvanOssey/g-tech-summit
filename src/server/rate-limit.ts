import "server-only";
import { headers } from "next/headers";

/**
 * Small in-memory limiter for the public entry points (sign-in, password
 * reset, checkout, payment status). Enough for a single Node process as on
 * Hostinger; it resets on restart, which is acceptable for its purpose:
 * slowing down password guessing and form flooding.
 */
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, times] of hits) if (times.every((t) => now - t > 3_600_000)) hits.delete(key);
}

/**
 * The visitor's address as seen by the host's proxy. The FIRST value of
 * x-forwarded-for is whatever the client sent (forgeable); the proxy's own
 * x-real-ip, or else the LAST value it appended, cannot be chosen by the client.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "inconnu";
}

/**
 * Records one attempt for `key` and tells whether it is still allowed:
 * at most `limit` attempts per `windowMs`.
 */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length <= limit;
}
