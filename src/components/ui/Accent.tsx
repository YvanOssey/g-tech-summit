"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A strategic word inside a headline. Its look comes from the section theme
 * (see `.accent-word` in globals.css).
 *
 * On light sections the orange band is drawn once when the word scrolls into view.
 * Server render shows the band fully, so nothing depends on JavaScript; words
 * already visible on load are left as they are (no flash).
 */
export function Accent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only light themes draw a band; on ink/orange the word must stay as rendered.
    if (getComputedStyle(el).getPropertyValue("--aw-animate").trim() !== "1") return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.setAttribute("data-pending", "");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.removeAttribute("data-pending");
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="accent-word">
      {children}
    </span>
  );
}
