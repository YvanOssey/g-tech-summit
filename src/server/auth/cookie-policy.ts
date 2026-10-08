/**
 * How the admin session cookies are written (audit F-07).
 *
 * - HttpOnly: page scripts cannot read them, so even an injected script
 *   could not steal an admin session. Possible because the browser never
 *   talks to Supabase directly: every request goes through the server.
 * - Secure in production, SameSite=Lax.
 * - 12 hours: @supabase/ssr always asks for 400 days, so the lifetime is
 *   replaced when the cookie is written. Each admin page rewrites it (token
 *   refresh), so in practice an admin is signed out after 12 hours without
 *   activity. A lifetime of 0 (sign-out) is kept as is.
 *
 * No "server-only": also used by the proxy.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

const SESSION_MAX_AGE = 12 * 60 * 60;

export function withSessionLifetime<T extends { maxAge?: number }>(options: T): T {
  return options.maxAge === 0 ? options : { ...options, maxAge: SESSION_MAX_AGE };
}
