"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/admin/forms";
import type { EventSettingsRow } from "@/server/db/types";
import { saveHackathon } from "./actions";

type Values = Pick<EventSettingsRow, "registration_deadline" | "challenges_start" | "jury">;

export function HackathonForm({ values, lastDay }: { values: Values; lastDay: string }) {
  const [state, action] = useActionState(saveHackathon, null);
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-2xl space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      <p className="text-small text-grey">Laissez un champ vide tant que l’information n’est pas confirmée : le site affiche alors « À annoncer ».</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Date limite d’inscription des équipes"
          name="registration_deadline"
          type="date"
          max={lastDay}
          defaultValue={values.registration_deadline ?? ""}
          error={e?.registration_deadline}
        />
        <Field label="Début officiel des défis" name="challenges_start" type="date" max={lastDay} defaultValue={values.challenges_start ?? ""} error={e?.challenges_start} />
      </div>
      <TextArea
        label="Jury"
        name="jury"
        rows={5}
        defaultValue={(values.jury ?? []).join("\n")}
        hint="Un nom par ligne, avec sa fonction si besoin. Uniquement des membres confirmés."
        error={e?.jury}
      />
      <FormMessage state={state} />
      <div className="w-48">
        <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
