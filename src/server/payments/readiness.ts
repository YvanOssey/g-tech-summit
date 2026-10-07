import "server-only";

/**
 * Online registration can only be opened once the checkout and the Genius Pay
 * integration exist and are configured (phase 8). Until then the admin
 * cannot open registrations, even by crafting a request.
 */
export function isCheckoutReady(): boolean {
  const CHECKOUT_IMPLEMENTED = false; // set to true in phase 8
  return (
    CHECKOUT_IMPLEMENTED &&
    Boolean(process.env.GENIUSPAY_API_KEY && process.env.GENIUSPAY_API_SECRET && process.env.GENIUSPAY_WEBHOOK_SECRET)
  );
}
