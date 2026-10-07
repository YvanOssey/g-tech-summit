"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { verifySecondFactor } from "../actions";

export function VerifyForm({ suite }: { suite?: string }) {
  const [state, action] = useActionState(verifySecondFactor, null);

  return (
    <form action={action} className="space-y-5" noValidate>
      {suite && <input type="hidden" name="suite" value={suite} />}
      <Field
        label="Code à 6 chiffres"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d{6}"
        maxLength={6}
        required
        autoFocus
        error={state?.fieldErrors?.code}
      />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Vérification…">Valider</SubmitButton>
    </form>
  );
}
