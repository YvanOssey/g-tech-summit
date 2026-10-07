// Plain JavaScript on purpose: on hosts whose system is too old for the
// native Next.js compiler (Hostinger: glibc < 2.29), the WebAssembly fallback
// cannot load a TypeScript config. See docs/mise-en-ligne.md.
import { fileURLToPath } from "node:url";

// Partner logos uploaded from the admin are served by Supabase Storage.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

/**
 * Security headers on every response:
 * - the site cannot be shown inside another site's frame (clickjacking);
 * - forms only post to this site or to the Genius Pay checkout;
 * - no plugin content, no <base> hijacking, no MIME sniffing;
 * - HTTPS remembered by the browser (ignored on http://localhost).
 * Scripts are not restricted by CSP yet: Next.js and the intro curtain use
 * inline scripts, which would need nonces.
 */
const SECURITY_HEADERS = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' https://geniuspay.ci",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera kept for this site only: the entrance QR scanner will need it.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // A stray package-lock.json exists higher up in the user folder; pin the project root (dev only).
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },
  experimental: {
    serverActions: {
      // Admin forms send partner logos (1 MB max): keep room for the form overhead.
      bodySizeLimit: "1.2mb",
      // Production address, accepted even if the host's proxy rewrites the Host header.
      allowedOrigins: ["summit.ghostech.tech"],
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/partners/**" }]
      : [],
  },
};

export default nextConfig;
