import "server-only";
import { isCaptchaConfigured } from "@/server/captcha";
import { isGeniusPayConfigured } from "./geniuspay";

/**
 * Online registration can only be opened when the checkout can actually take
 * a payment: Genius Pay keys present on the server. Until then the admin
 * cannot open registrations, even by crafting a request.
 */
export function isCheckoutReady(): boolean {
  return isGeniusPayConfigured();
}

/** Without the webhook secret, payments are only confirmed when the buyer comes back to the site. */
export function hasWebhookSecret(): boolean {
  return Boolean(process.env.GENIUSPAY_WEBHOOK_SECRET?.trim());
}

/** Without Turnstile keys, the checkout has no anti-robot check. */
export function hasCaptcha(): boolean {
  return isCaptchaConfigured();
}
