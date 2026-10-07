"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { hasRole } from "@/server/auth/roles";
import type { AdminRole } from "@/server/db/types";
import { ADMIN_NAV, isActive } from "./nav";

function NavLinks({ role, onNavigate }: { role: AdminRole; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration" className="space-y-6">
      {ADMIN_NAV.map((group) => {
        const items = group.items.filter((item) => !item.role || hasRole(role, item.role));
        if (items.length === 0) return null;
        return (
          <div key={group.label ?? "root"}>
            {group.label && <p className="mb-1.5 px-3 font-mono text-[0.6875rem] tracking-wider text-grey uppercase">{group.label}</p>}
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = isActive(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-10 items-center border-l-2 px-3 text-small transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal ${
                        active ? "border-signal bg-stone font-semibold" : "border-transparent hover:bg-stone/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/** Desktop (1024 px and up): fixed column beside the content. */
export function DesktopNav({ role }: { role: AdminRole }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-ink/10 bg-paper px-3 py-6 lg:sticky lg:top-15 lg:block lg:h-[calc(100dvh-3.75rem)] lg:overflow-y-auto">
      <NavLinks role={role} />
    </aside>
  );
}

/**
 * Below 1024 px: a "Menu" button opening a drawer (Escape, "Fermer" or a click
 * outside closes it; focus returns to the button).
 */
export function MobileNav({ role }: { role: AdminRole }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="admin-drawer"
        className="min-h-10 rounded-input border border-ink/20 px-3 text-small font-medium hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal lg:hidden"
      >
        Menu
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            id="admin-drawer"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de l’administration"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-paper px-3 py-5"
          >
            <div className="mb-5 flex items-center justify-between px-3">
              <p className="text-small font-semibold">Menu</p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  button.current?.focus();
                }}
                className="min-h-10 px-2 text-small underline underline-offset-4"
              >
                Fermer
              </button>
            </div>
            <NavLinks role={role} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
