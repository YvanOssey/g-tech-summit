"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton, TextArea } from "@/components/admin/forms";
import { updateParticipant } from "./actions";

interface Props {
  participant: { id: string; firstName: string; lastName: string; email: string; phone: string | null; notes: string | null };
}

export function ParticipantForm({ participant: p }: Props) {
  const [state, action] = useActionState(updateParticipant, null);
  const v = state?.values;
  const e = state?.fieldErrors;

  return (
    <form action={action} className="space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      <input type="hidden" name="id" value={p.id} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" name="first_name" required defaultValue={v?.first_name ?? p.firstName} error={e?.first_name} />
        <Field label="Nom" name="last_name" required defaultValue={v?.last_name ?? p.lastName} error={e?.last_name} />
        <Field label="E-mail" name="email" type="email" required defaultValue={v?.email ?? p.email} error={e?.email} />
        <Field label="Téléphone" name="phone" type="tel" defaultValue={v?.phone ?? p.phone ?? ""} error={e?.phone} />
      </div>
      <TextArea
        label="Note interne"
        name="notes"
        rows={3}
        defaultValue={v?.notes ?? p.notes ?? ""}
        hint="Visible uniquement par les administrateurs. Pas de données sensibles (santé, paiement…)."
        error={e?.notes}
      />
      <FormMessage state={state} />
      <div className="w-48">
        <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
