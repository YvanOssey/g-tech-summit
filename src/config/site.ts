/**
 * Public URL of the site. No domain yet — set NEXT_PUBLIC_SITE_URL once it exists.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
