// Plain JavaScript on purpose: on hosts whose system is too old for the
// native Next.js compiler (Hostinger: glibc < 2.29), the WebAssembly fallback
// cannot load a TypeScript config. See docs/mise-en-ligne.md.
import { fileURLToPath } from "node:url";
import { CSP_HEADER } from "./src/config/csp.mjs";

// Partner logos uploaded from the admin are served by Supabase Storage.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

/**
 * Security headers on every response:
 * - the site cannot be shown inside another site's frame (clickjacking);
 * - Content Security Policy (src/config/csp.mjs, also set as a <meta> tag
 *   because Hostinger's CDN replaces this header);
 * - no MIME sniffing;
 * - HTTPS remembered by the browser (ignored on http://localhost).
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP_HEADER },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera kept for this site only: the entrance QR scanner will need it.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
  // includeSubDomains only covers *.summit.ghostech.tech (none today), never the ghostech.tech site.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
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
