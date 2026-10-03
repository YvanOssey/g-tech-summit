import type { Metadata } from "next";
import { whatsappUrl } from "@/config/event";
import { PASS_ORDER, type PassId } from "@/config/passes";
import { getEventSettings } from "@/config/settings";
import { PassSelector } from "@/components/ticket/PassSelector";
import { ButtonLink } from "@/components/ui/Button";
import { SectionIndex } from "@/components/ui/SectionIndex";

export const metadata: Metadata = {
  title: "Billetterie",
  description: "Pass Event 10 000 FCFA, Pass Hackathon 15 000 FCFA. Paiement via Wave, billet nominatif envoyé par e-mail.",
};

const STEPS = ["Choisir", "Vos informations", "Récapitulatif", "Paiement Wave", "Billet par e-mail"] as const;

function parsePass(value: string | string[] | undefined): PassId[] {
  const v = Array.isArray(value) ? value[0] : value;
  return PASS_ORDER.includes(v as PassId) ? [v as PassId] : ["event"];
}

export default async function TicketingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ pass }, settings] = await Promise.all([searchParams, getEventSettings()]);
  const initial = parsePass(pass);

  return (
    <div className="shell pt-10 pb-28 md:pt-14 md:pb-36">
      <SectionIndex index="—" label="Billetterie · G-TECH SUMMER 2026" />
      <h1 className="type-condensed text-display mt-8 md:mt-12">Choisissez votre pass</h1>

      <ol className="type-meta mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Étapes de l’inscription">
        {STEPS.map((step, i) => (
          <li key={step} className={`flex items-center gap-2 ${i === 0 ? "text-ink" : "text-grey-500"}`} aria-current={i === 0 ? "step" : undefined}>
            <span
              className={`flex size-6 items-center justify-center border ${i === 0 ? "border-signal bg-signal text-ink" : "border-grey-500/50"}`}
            >
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <PassSelector key={initial.join()} initial={initial} />
      </div>

      <div className="mt-10 grid gap-8 border-t border-ink pt-8 lg:grid-cols-[1fr_auto] lg:items-start">
        {settings.registrationOpen ? null : (
          <div className="max-w-2xl">
            <p className="type-condensed text-title">Les inscriptions en ligne ouvrent prochainement</p>
            <p className="mt-4 text-grey-500">
              Le paiement se fera directement sur ce site via Wave, sans frais ajoutés au prix affiché. Votre billet
              nominatif vous sera envoyé par e-mail dès la confirmation du paiement. Pour être informé de l’ouverture,
              écrivez-nous.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="min-h-12 cursor-not-allowed bg-grey-200 px-6 font-semibold text-grey-500"
          >
            Continuer — bientôt disponible
          </button>
          <ButtonLink href={whatsappUrl} variant="secondary">
            Être prévenu sur WhatsApp
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
