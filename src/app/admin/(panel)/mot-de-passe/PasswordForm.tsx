"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { updatePassword } from "../actions";

export function PasswordForm() {
  const [state, action] = useActionState(updatePassword, null);

  return (
    <form action={action} className="space-y-5" noValidate>
      <Field
        label="Nouveau mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={12}
        hint="12 caractères minimum. Une phrase de plusieurs mots est plus sûre et plus facile à retenir."
        error={state?.fieldErrors?.password}
      />
      <Field
        label="Confirmer le mot de passe"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        error={state?.fieldErrors?.confirm}
      />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}
