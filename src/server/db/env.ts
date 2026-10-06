import "server-only";

/**
 * Supabase settings, read on the server only.
 * The publishable key is safe in the browser (RLS protects the data); the
 * secret key bypasses RLS and must never leave the server.
 */
function read(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export const supabaseEnv = {
  url: read("NEXT_PUBLIC_SUPABASE_URL"),
  publishableKey: read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  secretKey: read("SUPABASE_SECRET_KEY"),
};

/** True when the public site can read from the database. */
export const hasDatabase = Boolean(supabaseEnv.url && supabaseEnv.publishableKey);

export function requireEnv(value: string | null, name: string): string {
  if (!value) throw new Error(`[db] ${name} n’est pas défini (voir .env.example).`);
  return value;
}
