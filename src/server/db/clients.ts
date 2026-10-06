import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireEnv, supabaseEnv } from "./env";
import type { Database } from "./types";

const NO_SESSION = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } } as const;

/**
 * Anonymous client for the public site: sees only what RLS lets visitors see
 * (published content, settings, pass_sales()). No cookies, so its results can
 * be cached and shared between visitors.
 */
export function createPublicClient() {
  return createClient<Database>(
    requireEnv(supabaseEnv.url, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(supabaseEnv.publishableKey, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    NO_SESSION,
  );
}

/**
 * Privileged client that BYPASSES Row Level Security. Only for server code
 * that is not acting for a signed-in admin: checkout, the payment webhook,
 * admin invitations. Never use it to answer an admin page directly — those go
 * through the admin's own session (phase 2) so RLS still applies.
 */
export function createServiceClient() {
  return createClient<Database>(
    requireEnv(supabaseEnv.url, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(supabaseEnv.secretKey, "SUPABASE_SECRET_KEY"),
    NO_SESSION,
  );
}
