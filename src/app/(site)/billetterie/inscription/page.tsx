import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PASSES, orderTotal } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { TRACKS } from "@/content/hackathon";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatFCFA } from "@/lib/format";
import { captchaSiteKey } from "@/server/captcha";
import { parsePassList } from "@/server/checkout/schema";
import { isCheckoutReady } from "@/server/payments/readiness";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Vos informations",
  robots: { index: false, follow: false },
};

/** Step 2 of registration: who is coming, then payment. */
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ pass }, settings] = await Promise.all([searchParams, getEventSettings()]);
  const passes = parsePassList(Array.isArray(pass) ? pass[0] : pass);
  if (!passes || !settings.registrationOpen || !isCheckoutReady()) redirect("/billetterie");

  const total = orderTotal(passes);
  const hackathon = passes.includes("hackathon");

  return (
    <Section tone="paper" className="pt-14 pb-24 md:pt-20 md:pb-32">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="max-w-2xl">
          <SectionLabel>Billetterie · Étape 2</SectionLabel>
          <h1 className="type-headline text-title mt-6">Vos informations</h1>
          <div className="mt-10">
            <CheckoutForm passes={passes.join(",")} hackathon={hackathon} total={formatFCFA(total)} tracks={TRACKS.map((t) => ({ code: t.code, name: t.name }))} captchaSiteKey={captchaSiteKey()} />
          </div>
        </div>

        <aside aria-labelledby="recap" className="h-fit border border-rule-strong p-6 lg:sticky lg:top-28">
          <h2 id="recap" className="type-meta text-muted">
            Récapitulatif
          </h2>
          <ul className="mt-4 divide-y divide-rule">
            {passes.map((id) => (
              <li key={id} className="flex items-baseline justify-between gap-4 py-3">
                <span>
                  <span className="font-semibold">{PASSES[id].name}</span>
                  <span className="block text-small text-muted">{PASSES[id].access}</span>
                </span>
                <span className="whitespace-nowrap tabular-nums">
                  {formatFCFA(PASSES[id].price)}
                  {PASSES[id].per === "équipe" && <span className="block text-right text-small text-muted">/ équipe</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-baseline justify-between border-t border-rule-strong pt-4">
            <span className="type-meta">Total</span>
            <span className="type-condensed text-heading tabular-nums">{formatFCFA(total)}</span>
          </p>
          <p className="mt-1 text-small text-muted">Sans frais ajoutés.</p>
          <Link href={`/billetterie?pass=${passes[0]}`} className="mt-5 inline-block text-small underline underline-offset-4">
            Modifier mes pass
          </Link>
        </aside>
      </div>
    </Section>
  );
}
