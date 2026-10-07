"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { requestPasswordReset } from "../actions";

export function ResetRequestForm() {
  const [state, action] = useActionState(requestPasswordReset, null);

  return (
    <form action={action} className="space-y-5" noValidate>
      <Field
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="username"
        required
        autoFocus
        error={state?.fieldErrors?.email}
      />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Envoi…">Recevoir un lien</SubmitButton>
      <p className="text-center text-small">
        <Link href="/admin/login" className="underline underline-offset-4 hover:text-signal-text">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
