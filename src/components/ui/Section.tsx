import type { ComponentProps } from "react";

export type Tone = "ink" | "paper" | "stone" | "signal";

type SectionProps = ComponentProps<"section"> & { tone: Tone };

/**
 * A page band with its own theme. Everything inside reads the theme variables
 * (canvas, fg, muted, rule, accent…) — see globals.css.
 */
export function Section({ tone, className = "", ...props }: SectionProps) {
  return <section className={`theme-${tone} bg-canvas text-fg ${className}`} {...props} />;
}
