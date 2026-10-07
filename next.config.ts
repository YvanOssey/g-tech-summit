import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // A stray package-lock.json exists higher up in the user folder; pin the project root.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Admin forms send partner logos (1 MB max) through Server Actions: keep room for the form overhead.
    serverActions: { bodySizeLimit: "1.2mb" },
  },
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/partners/**" }]
      : [],
  },
};

export default nextConfig;
