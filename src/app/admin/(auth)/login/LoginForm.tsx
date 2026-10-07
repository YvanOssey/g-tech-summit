"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { signIn } from "../actions";

export function LoginForm({ suite }: { suite?: string }) {
  const [state, action] = useActionState(signIn, null);

  return (
    <form action={action} className="space-y-5" noValidate>
      {suite && <input type="hidden" name="suite" value={suite} />}
      <Field label="Adresse e-mail" name="email" type="email" autoComplete="username" required autoFocus />
      <Field label="Mot de passe" name="password" type="password" autoComplete="current-password" required />
      <FormMessage state={state} />
      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
      <p className="text-center text-small">
        <Link href="/admin/mot-de-passe-oublie" className="underline underline-offset-4 hover:text-signal-text">
          Mot de passe oublié ?
        </Link>
      </p>
    </form>
  );
}
