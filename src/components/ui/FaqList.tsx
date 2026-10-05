import type { FaqItem } from "@/content/faq";

/**
 * Native <details> accordion: accessible, works without JavaScript. Follows the section theme.
 * Opens smoothly where the browser can animate `::details-content` (see `.faq` in globals.css).
 * `numbered` adds an index before each question.
 */
export function FaqList({ items, numbered = false }: { items: readonly FaqItem[]; numbered?: boolean }) {
  return (
    <div className="border-b border-rule-strong">
      {items.map((item, i) => (
        <details key={item.q} className="faq group border-t border-rule-strong">
          <summary className="flex cursor-pointer list-none items-start gap-5 py-5 transition-colors duration-(--duration-micro) hover:text-accent [&::-webkit-details-marker]:hidden md:py-6">
            {numbered && <span className="type-meta w-6 shrink-0 pt-1 text-muted">{String(i + 1).padStart(2, "0")}</span>}
            <span className="flex-1 text-body font-semibold leading-snug md:text-lead">{item.q}</span>
            <span
              aria-hidden="true"
              className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-pill border border-rule-strong transition-[background-color,border-color,rotate] duration-(--duration-component) ease-out-quart group-open:rotate-45 group-open:border-mark group-open:bg-mark"
            >
              <span className="absolute h-0.5 w-3 bg-fg group-open:bg-ink" />
              <span className="absolute h-3 w-0.5 bg-fg group-open:bg-ink" />
            </span>
          </summary>
          <p className={`max-w-[62ch] pb-6 text-muted ${numbered ? "pl-11" : ""}`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
