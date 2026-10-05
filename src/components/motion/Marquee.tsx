import type { CSSProperties, ReactNode } from "react";

interface MarqueeProps {
  items: readonly ReactNode[];
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Accessible list label; when omitted the whole band is decorative. */
  label?: string;
}

/**
 * Endless horizontal band (CSS only). The row is rendered twice; the copy is
 * hidden from assistive technology. Pauses on hover, stops with reduced motion.
 */
export function Marquee({ items, duration = 40, reverse = false, className = "", label }: MarqueeProps) {
  const row = (copy: boolean) => (
    <ul
      aria-hidden={copy || !label ? true : undefined}
      aria-label={copy ? undefined : label}
      className="marquee-row flex min-w-full shrink-0 items-center justify-around"
    >
      {items.map((item, i) => (
        <li key={i} className="flex shrink-0 items-center">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee flex overflow-hidden ${reverse ? "marquee-reverse" : ""} ${className}`}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      {row(false)}
      {row(true)}
    </div>
  );
}
