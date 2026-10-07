import type { Metadata } from "next";

/**
 * Back office root. Lives outside the (site) group: no public header, footer,
 * intro curtain or ticket bar. Access control happens in (panel)/layout.tsx,
 * in every action (requireAdmin) and in the database (RLS).
 */
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Admin G-TECH SUMMIT" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh bg-[#f6f4ef] text-ink">{children}</div>;
}
