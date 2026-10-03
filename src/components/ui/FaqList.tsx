import type { FaqItem } from "@/content/faq";

/** Native <details> accordion: accessible, works without JavaScript. */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="border-b border-ink">
      {items.map((item) => (
        <details key={item.q} className="group border-t border-ink">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <span className="text-[1.125rem] font-semibold leading-snug">{item.q}</span>
            <span
              aria-hidden="true"
              className="relative mt-1.5 size-3.5 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-ink after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-ink after:transition-transform after:duration-(--duration-micro) group-open:after:scale-y-0 group-open:before:bg-signal-ink"
            />
          </summary>
          <p className="max-w-[62ch] pb-6 text-grey-500">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
