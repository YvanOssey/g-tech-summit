import type { Metadata } from "next";
import { whatsappUrl } from "@/config/event";
import { PASS_ORDER, type PassId } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { CheckoutStart } from "@/components/ticket/CheckoutStart";
import { PassSelector } from "@/components/ticket/PassSelector";
import { Accent } from "@/components/ui/Accent";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { isCheckoutReady } from "@/server/payments/readiness";

export const metadata: Metadata = {
  title: "Billetterie",
  description:
    "Pass En ligne 2 000 FCFA, Pass Présentiel 5 000 FCFA, Pass Hackathon 15 000 FCFA par équipe. Paiement via Wave, billet nominatif envoyé par e-mail.",
};

const STEPS = [
  "Choisir",
  "Vos informations",
  "Récapitulatif",
  "Paiement Wave",
  "Billet par e-mail",
] as const;

function parsePass(value: string | string[] | undefined): PassId[] {
  const v = Array.isArray(value) ? value[0] : value;
  return PASS_ORDER.includes(v as PassId) ? [v as PassId] : ["event"];
}

export default async function TicketingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ pass }, settings] = await Promise.all([
    searchParams,
    getEventSettings(),
  ]);
  const initial = parsePass(pass);
  // Online sale only when registrations are open AND payment can be taken.
  const open = settings.registrationOpen && isCheckoutReady();

  return (
    <>
      <Section tone="signal">
        <div className="shell pt-14 pb-12 md:pt-20 md:pb-16">
          <SectionLabel>Billetterie · G-TECH SUMMIT 2026</SectionLabel>
          <h1 className="type-headline text-display mt-6 md:mt-8">
            Choisissez <Accent>votre pass</Accent>
          </h1>
          <ol
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-rule-strong pt-5"
            aria-label="Étapes de l’inscription"
          >
            {STEPS.map((step, i) => (
              <li
                key={step}
                className={`flex items-center gap-2 text-small ${i === 0 ? "font-semibold" : "text-muted"}`}
                aria-current={i === 0 ? "step" : undefined}
              >
                <span
                  className={`type-meta flex size-6 items-center justify-center ${i === 0 ? "bg-ink text-paper" : "border border-rule-strong"}`}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="paper" className="pt-14 pb-24 md:pt-20 md:pb-32">
        <div className="shell">
          <h2 className="sr-only">Les trois pass</h2>
          {open ? (
            <CheckoutStart
              key={initial.join()}
              initial={initial}
              sold={settings.sold}
              trackSold={settings.soldByTrack}
            />
          ) : (
            <>
              <PassSelector
                key={initial.join()}
                initial={initial}
                sold={settings.sold}
                trackSold={settings.soldByTrack}
              />

              <div className="mt-12 grid gap-8 border-t border-rule-strong pt-8 lg:grid-cols-[1fr_auto] lg:items-start">
                <div className="max-w-2xl">
                  <p className="type-headline text-heading">
                    Les inscriptions en ligne ouvrent prochainement
                  </p>
                  <p className="mt-4 text-muted">
                    Le paiement se fera directement sur ce site via Wave, sans
                    frais ajoutés au prix affiché. Votre billet nominatif vous
                    sera envoyé par e-mail dès la confirmation du paiement. Pour
                    être informé de l’ouverture, écrivez-nous.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="min-h-12 cursor-not-allowed rounded-pill bg-stone px-6 font-semibold text-grey"
                  >
                    Continuer — bientôt disponible
                  </button>
                  <ButtonLink href={whatsappUrl} variant="link">
                    Être prévenu sur WhatsApp
                  </ButtonLink>
                </div>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}