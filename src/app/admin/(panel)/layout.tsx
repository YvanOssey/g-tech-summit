import Link from "next/link";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { requireAdmin } from "@/server/auth/require-admin";
import { ROLE_LABEL } from "@/server/auth/roles";
import { signOut } from "./actions";

/**
 * Everything under (panel) requires an active administrator. Pages and
 * actions still call requireAdmin() themselves: this layout is not the only lock.
 * The sidebar comes in phase 3.
 */
export default async function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <>
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <GhostechLogo width={26} />
            <span className="text-small font-semibold">Admin G-TECH SUMMIT</span>
          </Link>
          <div className="flex items-center gap-4 text-small">
            <span className="text-right leading-tight">
              <span className="block font-medium">{admin.full_name ?? admin.email}</span>
              <span className="text-grey">{ROLE_LABEL[admin.role]}</span>
            </span>
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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </>
  );
}
