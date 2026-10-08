import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_OPTIONS, withSessionLifetime } from "@/server/auth/cookie-policy";

/** Admin pages reachable without a session. */
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/callback", "/admin/mot-de-passe-oublie"];

/**
 * Runs for /admin only (see `config.matcher`): the public site never goes
 * through it.
 *
 * 1. Refreshes the Supabase session and writes the new cookies.
 * 2. Optimistic check: no valid session → login page.
 *
 * This is NOT the authorisation: every admin page, action and route calls
 * requireAdmin() (src/server/auth/require-admin.ts), and RLS protects the data.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const { pathname, search } = request.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  let signedIn = false;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(toSet, headers) {
          for (const { name, value } of toSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) response.cookies.set(name, value, withSessionLifetime(options));
          for (const [h, v] of Object.entries(headers ?? {})) response.headers.set(h, v);
        },
      },
    });
    // Verifies the token signature; refreshes it when it has expired.
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims?.sub);
  }

  if (!signedIn && !isPublic) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = pathname === "/admin" ? "" : `?suite=${encodeURIComponent(pathname + search)}`;
    response = NextResponse.redirect(login);
  }

  // The back office is never indexed nor cached by shared caches.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
