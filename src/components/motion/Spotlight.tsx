"use client";

import type { ComponentProps, PointerEvent } from "react";

/**
 * Wraps a group of `.spotlight` cards: an orange light follows the pointer
 * across every card of the group (see `.spotlight` in globals.css).
 * Pointer only — touch and keyboard users get the regular card states.
 */
export function SpotlightGroup({ className = "", onPointerMove, ...props }: ComponentProps<"div">) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (e.pointerType !== "mouse") return;
    for (const card of e.currentTarget.querySelectorAll<HTMLElement>(".spotlight")) {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
  };

  return <div className={`spotlight-group ${className}`} onPointerMove={handleMove} {...props} />;
}
