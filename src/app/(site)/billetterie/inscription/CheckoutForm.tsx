"use client";

import { useActionState } from "react";
import { HOLD_MINUTES, TEAM_SIZE } from "@/config/passes";
import { Turnstile } from "@/components/ticket/Turnstile";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { startCheckout } from "./actions";

interface CheckoutFormProps {
  passes: string;
  hackathon: boolean;
  total: string;
  tracks: readonly { code: string; name: string }[];
  /** Cloudflare Turnstile public key; null when the anti-robot check is not configured. */
  captchaSiteKey: string | null;
}

function Person({
  prefix,
  legend,
  values,
  errors,
  optionalPhone = false,
}: {
  prefix: string;
  legend?: string;
  values?: Record<string, string>;
  errors?: Record<string, string>;
  optionalPhone?: boolean;
}) {
  const f = (name: string) => `${prefix}_${name}`;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {legend && <p className="font-semibold sm:col-span-2">{legend}</p>}
      <Field label="Prénom" name={f("first_name")} autoComplete={prefix === "buyer" ? "given-name" : "off"} required defaultValue={values?.[f("first_name")]} error={errors?.[f("first_name")]} />
      <Field label="Nom" name={f("last_name")} autoComplete={prefix === "buyer" ? "family-name" : "off"} required defaultValue={values?.[f("last_name")]} error={errors?.[f("last_name")]} />
      <Field label="E-mail" name={f("email")} type="email" autoComplete={prefix === "buyer" ? "email" : "off"} required defaultValue={values?.[f("email")]} error={errors?.[f("email")]} hint={prefix === "buyer" ? "Le billet y est envoyé." : "Son billet y sera envoyé."} />
      <Field
        label={optionalPhone ? "Téléphone (facultatif)" : "Téléphone"}
        name={f("phone")}
        type="tel"
        inputMode="tel"
        autoComplete={prefix === "buyer" ? "tel" : "off"}
        placeholder="07 00 00 00 00"
        required={!optionalPhone}
        defaultValue={values?.[f("phone")]}
        error={errors?.[f("phone")]}
      />
    </div>
  );
}

export function CheckoutForm({ passes, hackathon, total, tracks, captchaSiteKey }: CheckoutFormProps) {
  const [state, action] = useActionState(startCheckout, null);
  const values = state?.values;
  const errors = state?.fieldErrors;

  return (
    <form action={action} className="space-y-10" noValidate>
      <input type="hidden" name="passes" value={passes} />

      <fieldset className="space-y-5">
        <legend className="type-headline text-heading">Vos coordonnées</legend>
        <p className="text-small text-muted">
          {hackathon ? "Vous faites partie de l’équipe : vous recevez vous aussi un billet." : "Le billet est nominatif : il est établi à ces nom et prénom."}
        </p>
        <Person prefix="buyer" values={values} errors={errors} />
      </fieldset>

      {hackathon && (
        <fieldset className="space-y-6 border-t border-rule-strong pt-8">
          <legend className="type-headline text-heading">Votre équipe</legend>
          <p className="text-small text-muted">{TEAM_SIZE} personnes, vous compris : renseignez vos {TEAM_SIZE - 1} coéquipiers. Chaque membre reçoit son propre billet nominatif.</p>
          <Field label="Nom de l’équipe" name="team_name" required defaultValue={values?.team_name} error={errors?.team_name} />

          <div role="radiogroup" aria-labelledby="track-label" aria-describedby={errors?.track_code ? "track-error" : undefined}>
            <p id="track-label" className="text-small font-semibold">
              Thématique
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {tracks.map((t) => (
                <label key={t.code} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-input border border-ink/25 px-4 has-checked:border-ink has-checked:bg-stone">
                  <input type="radio" name="track_code" value={t.code} defaultChecked={values?.track_code === t.code} className="accent-ink" />
                  <span>{t.name}</span>
                </label>
              ))}
            </div>
            {errors?.track_code && (
              <p id="track-error" className="mt-1 text-small font-medium text-[#b42318]">
                {errors.track_code}
              </p>
            )}
          </div>

          {Array.from({ length: TEAM_SIZE - 1 }, (_, i) => (
            <Person key={i} prefix={`m${i + 1}`} legend={`Coéquipier ${i + 2}`} values={values} errors={errors} optionalPhone />
          ))}
          {errors?.teammates && <p className="text-small font-medium text-[#b42318]">{errors.teammates}</p>}
        </fieldset>
      )}

      <div className="space-y-5 border-t border-rule-strong pt-8">
        {captchaSiteKey && <Turnstile siteKey={captchaSiteKey} resetKey={state} />}
        <FormMessage state={state} />
        <div className="max-w-sm">
          <SubmitButton pendingLabel="Redirection vers le paiement…">{`Payer ${total}`}</SubmitButton>
        </div>
        <p className="text-small text-muted">
          Vous allez être redirigé vers la page de paiement sécurisée Genius Pay (Wave, Orange Money, MTN Money, Moov Money ou carte).
          Vos places sont réservées {HOLD_MINUTES} minutes.
        </p>
      </div>
    </form>
  );
}
