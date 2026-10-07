import Link from "next/link";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { DesktopNav, MobileNav } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/server/auth/require-admin";
import { ROLE_LABEL } from "@/server/auth/roles";
import { signOut } from "./actions";

/**
 * Everything under (panel) requires an active administrator. Pages and
 * actions still call requireAdmin() themselves: this layout is not the only lock.
 */
export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#admin-contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-signal focus:px-4 focus:py-3 focus:font-semibold"
      >
        Aller au contenu
      </a>

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <MobileNav role={admin.role} />
            <Link href="/admin" className="flex items-center gap-2.5">
              <GhostechLogo width={24} />
              <span className="text-small font-semibold">
                Admin <span className="hidden sm:inline">G-TECH SUMMIT</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3 text-small sm:gap-4">
            <Link href="/" target="_blank" className="hidden underline underline-offset-4 hover:text-signal-text md:inline">
              Voir le site
            </Link>
            <Link href="/admin/securite" className="hidden text-right leading-tight sm:block" title="Sécurité du compte">
              <span className="block font-medium">{admin.full_name ?? admin.email}</span>
              <span className="text-grey">{ROLE_LABEL[admin.role]}</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-10 rounded-input border border-ink/20 px-3 font-medium hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <DesktopNav role={admin.role} />
        <main id="admin-contenu" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
