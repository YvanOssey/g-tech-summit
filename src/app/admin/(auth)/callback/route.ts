import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { createSessionClient } from "@/server/auth/session";

/** Link types an admin can receive by e-mail. */
const ALLOWED: readonly EmailOtpType[] = ["invite", "recovery", "email"];

/**
 * Landing point of the links sent by Supabase (invitation, password reset).
 * The e-mail templates point here with ?token_hash=…&type=… ; a `code`
 * (PKCE flow) is accepted too. On success the session cookies are set and the
 * admin chooses a password; on failure, back to login with a clear message.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const code = params.get("code");

  const supabase = await createSessionClient();
  let ok = false;

  if (tokenHash && type && ALLOWED.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  if (!ok) redirect("/admin/login?erreur=lien");

  // Invited or resetting: set a password first.
  redirect(type === "email" ? "/admin" : "/admin/mot-de-passe");
}
