import type { NextConfig } from "next";

// Partner logos uploaded from the admin are served by Supabase Storage.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;

const nextConfig: NextConfig = {
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
