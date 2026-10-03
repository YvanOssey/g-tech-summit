import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json exists higher up in the user folder; pin the project root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
