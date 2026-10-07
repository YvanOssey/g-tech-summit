"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Checkbox, FormMessage, SubmitButton, TextArea } from "@/components/admin/forms";
import type { FaqItemRow } from "@/server/db/types";
import { saveFaq } from "./actions";

export function FaqForm({ item }: { item?: Pick<FaqItemRow, "id" | "question" | "answer" | "published"> }) {
  const [state, action] = useActionState(saveFaq, null);

  return (
    <form action={action} className="max-w-2xl space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      {item && <input type="hidden" name="id" value={item.id} />}
      <TextArea label="Question" name="question" rows={2} required defaultValue={item?.question} error={state?.fieldErrors?.question} />
      <TextArea
        label="Réponse"
        name="answer"
        rows={7}
        required
        defaultValue={item?.answer}
        hint="Texte simple, sans mise en forme. N’écrivez que des informations validées par les organisateurs."
        error={state?.fieldErrors?.answer}
      />
      <Checkbox label="Publiée sur le site" name="published" defaultChecked={item?.published ?? false} hint="Décochée, la question reste enregistrée mais n’apparaît pas sur le site." />
      <FormMessage state={state} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-48">
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>
        <Link href="/admin/faq" className="text-small underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  );
}
