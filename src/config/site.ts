/**
 * Public URL of the site (no trailing slash). Used for canonical URLs, the
 * sitemap, robots.txt and social previews.
 *
 * It MUST be set at the host for production (see .env.example): without it,
 * every absolute URL would point to localhost.
 */
const FALLBACK = "http://localhost:3000";

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL n’est pas défini : les URL absolues (sitemap, robots, aperçus de partage) pointeront vers ${FALLBACK}.`,
  );
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK).replace(/\/$/, "");
