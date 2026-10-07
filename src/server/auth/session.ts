import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireEnv, supabaseEnv } from "@/server/db/env";
import type { Database } from "@/server/db/types";

/**
 * Supabase client acting AS the signed-in admin: every query goes through Row
 * Level Security with their identity. Create one per request, never share it.
 *
 * Session cookies are HttpOnly, Secure in production and SameSite=Lax (set by
 * @supabase/ssr). Server Components cannot write cookies: there, token
 * refreshes are written by the proxy (src/proxy.ts) instead.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    requireEnv(supabaseEnv.url, "NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv(supabaseEnv.publishableKey, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(toSet) {
          try {
            for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
          } catch {
            // Called from a Server Component: the proxy refreshes the session.
          }
        },
      },
    },
  );
}
