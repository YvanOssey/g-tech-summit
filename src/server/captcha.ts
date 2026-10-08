import "server-only";

/**
 * Cloudflare Turnstile: an anti-robot check on the checkout form, so a script
 * cannot create order after order to hold every place. Invisible for most
 * visitors. Enforced as soon as both keys are set on the server; without
 * them the checkout works without it (admin settings show a warning).
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function read(name: string): string | null {
  return process.env[name]?.trim() || null;
}

/** Public key of the widget, given to the browser by the page (not a secret). */
export function captchaSiteKey(): string | null {
  return read("TURNSTILE_SITE_KEY") && read("TURNSTILE_SECRET_KEY") ? read("TURNSTILE_SITE_KEY") : null;
}

export function isCaptchaConfigured(): boolean {
  return captchaSiteKey() !== null;
}

/**
 * Asks Cloudflare whether the token from the form is genuine. A token is valid
 * once and for 5 minutes. Any doubt (no token, network error, timeout) is a
 * refusal: the buyer just tries again.
 */
export async function verifyCaptcha(token: unknown, ip: string): Promise<boolean> {
  const secret = read("TURNSTILE_SECRET_KEY");
  if (!secret || !isCaptchaConfigured()) return true;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "inconnu") body.set("remoteip", ip);
    const response = await fetch(VERIFY_URL, { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(8_000) });
    const json = (await response.json().catch(() => null)) as { success?: boolean; action?: string } | null;
    return json?.success === true && (!json.action || json.action === "checkout");
  } catch {
    return false;
  }
}
