"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";

type Mode = "pin" | "drift" | "native";

/**
 * A horizontal track of cards driven by the vertical scroll (mouse wheel,
 * trackpad, touch):
 * - `pin` (from md): the band stays fixed on screen while the cards slide
 *   from right to left, with a progress rule;
 * - `drift` (phones): the band scrolls normally and the cards slide sideways
 *   as it passes;
 * - `native` (reduced motion): a plain horizontally scrollable row with snap.
 * Scrolling fast leans the cards slightly (skew from scroll velocity).
 */
export function HorizontalRail({ header, children, count }: { header: ReactNode; children: ReactNode; count: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("drift");
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)");
    const update = () => setMode(reduce ? "native" : mq.matches ? "pin" : "drift");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  useEffect(() => {
    const el = track.current;
    if (!el || mode === "native") return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - (el.parentElement?.clientWidth ?? 0)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const pinned = mode === "pin" && distance > 0;
  const { scrollYProgress } = useScroll({
    target: outer,
    offset: pinned ? ["start start", "end end"] : ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });
  // Drift: start slightly offset so cards are already moving when the band appears.
  const x = useTransform(smooth, [0, 1], pinned ? [0, -distance] : [distance * 0.15, -distance]);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const skewX = useTransform(velocity, [-2500, 0, 2500], [4, 0, -4], { clamp: true });

  // Keyboard: when a card receives focus, scroll the PAGE to the point where
  // that card is centred. The container uses overflow: clip (not hidden), so
  // the browser cannot scroll it sideways on focus and offset the track.
  const viewport = useRef<HTMLDivElement>(null);
  const onFocus = (e: FocusEvent<HTMLUListElement>) => {
    const box = viewport.current;
    const card = (e.target as HTMLElement).closest("li");
    const el = outer.current;
    if (!pinned || !card || !el || !box) return;
    const target = Math.min(Math.max(card.offsetLeft + card.offsetWidth / 2 - box.clientWidth / 2, 0), distance);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + target, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div ref={outer} style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}>
      <div ref={viewport} className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-x-clip" : "overflow-x-clip"}>
        {header}
        <div className={pinned ? "mt-10" : "mt-12"}>
          <motion.ul
            ref={track}
            onFocus={onFocus}
            style={mode === "native" ? undefined : { x, skewX }}
            className={`flex gap-4 pr-(--gutter) pl-[max(var(--gutter),calc((100vw-var(--page-max))/2+var(--gutter)))] ${
              mode === "native" ? "snap-x snap-mandatory overflow-x-auto pb-4" : "w-max"
            }`}
          >
            {children}
          </motion.ul>
          {mode !== "native" && (
            <div className="shell mt-8 flex items-center gap-4" aria-hidden="true">
              <span className="type-meta text-muted">01</span>
              <span className="relative h-px flex-1 bg-rule">
                <motion.span className="absolute inset-0 origin-left bg-signal" style={{ scaleX: smooth }} />
              </span>
              <span className="type-meta text-muted">{String(count).padStart(2, "0")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
