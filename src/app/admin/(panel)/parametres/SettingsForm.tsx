"use client";

import { useActionState } from "react";
import { Checkbox, Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import type { EventSettingsRow } from "@/server/db/types";
import { saveSettings } from "./actions";

type Settings = Pick<EventSettingsRow, "venue_name" | "venue_address" | "venue_map_url" | "registration_open">;

export function SettingsForm({ settings, checkoutReady }: { settings: Settings; checkoutReady: boolean }) {
  const [state, action] = useActionState(saveSettings, null);

  return (
    <form action={action} className="max-w-2xl space-y-8" noValidate>
      <fieldset className="space-y-5 border border-ink/10 bg-paper p-6">
        <legend className="px-1 font-semibold">Lieu de l’événement</legend>
        <p className="text-small text-grey">
          Laissez vide tant que le lieu n’est pas confirmé : le site affiche alors « À annoncer ». Une fois enregistré, il
          apparaît sur l’accueil et les infos pratiques.
        </p>
        <Field label="Nom du lieu" name="venue_name" defaultValue={settings.venue_name ?? ""} error={state?.fieldErrors?.venue_name} />
        <Field label="Adresse" name="venue_address" defaultValue={settings.venue_address ?? ""} error={state?.fieldErrors?.venue_address} />
        <Field
          label="Lien vers la carte (facultatif)"
          name="venue_map_url"
          type="url"
          placeholder="https://"
          defaultValue={settings.venue_map_url ?? ""}
          error={state?.fieldErrors?.venue_map_url}
        />
      </fieldset>

      <fieldset className="space-y-4 border border-ink/10 bg-paper p-6">
        <legend className="px-1 font-semibold">Inscriptions en ligne</legend>
        {checkoutReady ? (
          <Checkbox
            label="Inscriptions ouvertes"
            name="registration_open"
            defaultChecked={settings.registration_open}
            hint="Ouvertes, la billetterie permet d’acheter un pass et de payer via Wave."
          />
        ) : (
          <p className="text-small">
            <span className="font-semibold">Fermées.</span>{" "}
            <span className="text-grey">
              Elles ne pourront être ouvertes qu’une fois le paiement Genius Pay en service (phase 8). Le site affiche
              « Les inscriptions en ligne ouvrent prochainement ».
            </span>
          </p>
        )}
      </fieldset>

      <FormMessage state={state} />
      <div className="w-48">
        <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
