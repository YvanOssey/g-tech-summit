"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { PASSES, PASS_ORDER } from "@/config/passes";
import { formatFCFA } from "@/lib/format";
import { ArrowRight } from "@/components/ui/icons";

/** Passes on sale only (not those kept for past orders): "Pass Entrée · 2 500 FCFA", or "Pass dès …" when several. */
const PRICE_LINE =
  PASS_ORDER.length === 1
    ? `${PASSES[PASS_ORDER[0]].name} · ${formatFCFA(PASSES[PASS_ORDER[0]].price)}`
    : `Pass dès ${formatFCFA(Math.min(...PASS_ORDER.map((id) => PASSES[id].price)))}`;

/**
 * Thumb-reachable ticket shortcut on phones and tablets.
 * Appears once the visitor has scrolled past the first screen; hidden on the ticketing page.
 */
export function MobileTicketBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/billetterie")) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-(--z-sticky) border-t border-ink bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden"
          initial={reduce ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduce ? undefined : { y: "100%" }}
          transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
        >
          <Link href="/billetterie" className="shell flex h-16 items-center justify-between gap-4">
            <span>
              <span className="type-meta block text-grey">18—19.12.2026</span>
              <span className="font-semibold">{PRICE_LINE}</span>
            </span>
            <span className="flex min-h-11 items-center gap-2 rounded-pill bg-signal px-5 font-semibold">
              Billetterie <ArrowRight className="size-4" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
