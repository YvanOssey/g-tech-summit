import type { ReactNode } from "react";
import { RevealText } from "@/components/motion/RevealText";

interface PageHeroProps {
  eyebrow: string;
  lines: readonly string[];
  lead?: ReactNode;
  tone?: "light" | "dark";
  children?: ReactNode;
}

/** Opening block of inner pages: index line, poster title, lead. */
export function PageHero({ eyebrow, lines, lead, tone = "light", children }: PageHeroProps) {
  const dark = tone === "dark";
  return (
    <section className={dark ? "bg-ink text-paper" : undefined}>
      <div className="shell pt-10 pb-16 md:pt-14 md:pb-24">
        <p className={`type-meta border-t pt-3 ${dark ? "border-paper/40 text-grey-400" : "border-ink text-grey-500"}`}>
          {eyebrow}
        </p>
        <RevealText as="h1" lines={lines} className="type-condensed text-display mt-8 md:mt-12" />
        {(lead || children) && (
          <div className="grid-12 mt-10 gap-y-8 md:mt-14">
            {lead && (
              <div className={`text-lead col-span-4 md:col-span-6 lg:col-span-7 ${dark ? "text-paper" : ""}`}>{lead}</div>
            )}
            {children && <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">{children}</div>}
          </div>
        )}
      </div>
    </section>
  );
}
