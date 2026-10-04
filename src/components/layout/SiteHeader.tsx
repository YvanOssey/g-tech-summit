"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EVENT, whatsappUrl } from "@/config/event";
import { MAIN_NAV, TICKETING } from "@/config/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { ButtonLink } from "@/components/ui/Button";

/** Solid ink capsule — no blur, no glass, no shadow. */
const pill = "flex h-12 items-center rounded-pill border border-graphite bg-ink text-paper";

/**
 * Navigation in three pills, fixed at the top: logo · links · Billetterie.
 * The homepage hero runs underneath it; on every other page an ink spacer of
 * the header's height keeps the first section clear.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  // Close the menu whenever the route changes.
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="theme-ink fixed inset-x-0 top-0 z-(--z-header)">
        <div className="shell relative z-(--z-raised) flex h-(--header-h) items-center justify-between gap-3">
          {/* Pill 1 — logo */}
          <Link href="/" className={`${pill} px-4`} aria-label={`${EVENT.name} ${EVENT.year} — accueil`}>
            <GhostechLogo width={56} variant="light" preload />
          </Link>

          {/* Pill 2 — navigation (desktop) */}
          <nav aria-label="Navigation principale" className={`${pill} hidden gap-7 px-7 lg:flex`}>
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="relative py-2 text-small font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-signal after:transition-transform after:duration-(--duration-micro) after:ease-out-quart hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Pill 3 — ticketing (+ menu toggle on small screens) */}
          <div className="flex items-center gap-2">
            <ButtonLink href={TICKETING.href} className="h-12 px-6 text-small max-xs:hidden!">
              {TICKETING.label}
            </ButtonLink>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => {
                setOpenedAt(pathname);
                setOpen((v) => !v);
              }}
              className={`${pill} type-meta gap-2 px-5 lg:hidden`}
            >
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className={`h-px bg-paper transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
                <span className={`h-px bg-paper transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
              </span>
              {open ? "Fermer" : "Menu"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="menu-mobile"
              className="fixed inset-0 overflow-y-auto bg-canvas pt-(--header-h) text-fg lg:hidden"
              initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <nav aria-label="Navigation mobile" className="shell flex min-h-full flex-col justify-between gap-12 py-8">
                <ul>
                  {[{ href: "/", label: "Accueil" }, ...MAIN_NAV, TICKETING].map((item) => (
                    <li key={item.href} className="border-b border-rule">
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="type-headline block py-4 text-title aria-[current=page]:text-accent"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="type-meta space-y-1 text-muted">
                  <p>
                    18—19.12.2026 · {EVENT.city} · Organisé par {EVENT.organiser.name}
                  </p>
                  <p>
                    <a href={`mailto:${EVENT.contact.email}`} className="text-fg underline underline-offset-4">
                      {EVENT.contact.email}
                    </a>
                  </p>
                  <p>
                    <a href={whatsappUrl} className="text-fg underline underline-offset-4">
                      WhatsApp {EVENT.contact.phoneDisplay}
                    </a>
                  </p>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Keeps inner pages clear of the fixed pills; the homepage hero runs underneath instead. */}
      {!isHome && <div aria-hidden="true" className="h-(--header-h) bg-ink" />}
    </>
  );
}
