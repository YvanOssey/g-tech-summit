"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EVENT, whatsappUrl } from "@/config/event";
import { MAIN_NAV, TICKETING } from "@/config/navigation";
import { GhostechLogo } from "@/components/brand/GhostechLogo";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.25, 1, 0.5, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    <header className="theme-ink sticky top-0 z-(--z-header) border-b border-rule bg-canvas text-fg">
      <div className="shell flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-4" aria-label={`${EVENT.name} ${EVENT.year} — accueil`}>
          <GhostechLogo width={64} variant="light" priority />
          <span className="hidden border-l border-rule pl-4 leading-none xs:block">
            <span className="type-headline block text-body">G-TECH SUMMER</span>
            <span className="type-label mt-1 block text-caption">18—19.12.2026</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="relative py-2 text-small font-medium after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-mark after:transition-transform after:duration-(--duration-micro) after:ease-out-quart hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href={TICKETING.href} className="min-h-10! px-5!">
            {TICKETING.label}
          </ButtonLink>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <ButtonLink href={TICKETING.href} className="min-h-10! px-4! text-small">
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
            className="type-meta flex min-h-10 items-center gap-2 rounded-pill border border-rule-strong px-4"
          >
            <span aria-hidden="true" className="flex w-4 flex-col gap-1">
              <span className={`h-px bg-fg transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
              <span className={`h-px bg-fg transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
            </span>
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-x-0 top-(--header-h) bottom-0 z-(--z-menu) overflow-y-auto border-t border-rule bg-canvas text-fg lg:hidden"
            initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? undefined : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Navigation mobile" className="shell flex min-h-full flex-col justify-between gap-12 py-8">
              <ul>
                {[{ href: "/", label: "Accueil" }, ...MAIN_NAV, TICKETING].map((item, i) => (
                  <motion.li
                    key={item.href}
                    className="border-b border-rule"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.15 + i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="flex items-baseline gap-4 py-4 aria-[current=page]:text-accent"
                      onClick={() => setOpen(false)}
                    >
                      <span className="type-meta text-muted">{String(i).padStart(2, "0")}</span>
                      <span className="type-headline text-title leading-none">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="type-meta space-y-1 text-muted">
                <p>18—19.12.2026 · {EVENT.city}</p>
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
  );
}
