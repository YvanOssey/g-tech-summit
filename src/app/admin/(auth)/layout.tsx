import { GhostechLogo } from "@/components/brand/GhostechLogo";

/** Sign-in screens: one narrow card, centred. */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <GhostechLogo width={32} />
          <p className="text-small leading-tight">
            <span className="block font-semibold">G-TECH SUMMIT 2026</span>
            <span className="text-grey">Administration</span>
          </p>
        </div>
        <div className="border border-ink/10 bg-paper p-6 sm:p-8">{children}</div>
      </div>
    </main>
  );
}
