"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { grantAccess } from "./actions";

export function GrantForm() {
  const [state, action] = useActionState(grantAccess, null);

  return (
    <form action={action} className="space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      <Field label="Adresse e-mail du compte Supabase" name="email" type="email" required error={state?.fieldErrors?.email} />
      <Field label="Nom (facultatif)" name="full_name" error={state?.fieldErrors?.full_name} />
      <div>
        <label htmlFor="role" className="block text-small font-semibold">
          Rôle
        </label>
        <select
          id="role"
          name="role"
          defaultValue="ADMIN"
          className="mt-1.5 block w-full rounded-input border border-ink/25 bg-paper px-3.5 py-2.5 focus:outline-2 focus:outline-offset-2 focus:outline-signal"
        >
          <option value="ADMIN">Administrateur — participants, programme, contenus</option>
          <option value="SUPER_ADMIN">Super administrateur — tout, y compris paramètres et comptes</option>
        </select>
      </div>
      <FormMessage state={state} />
      <div className="w-56">
        <SubmitButton pendingLabel="Enregistrement…">Donner l’accès</SubmitButton>
      </div>
    </form>
  );
}
