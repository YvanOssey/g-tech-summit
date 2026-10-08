"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Checkbox, Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { SESSION_TYPE_LABEL } from "@/content/programme";
import type { ProgrammeSlotRow } from "@/server/db/types";
import { saveSlot } from "./actions";

type Slot = Pick<
  ProgrammeSlotRow,
  "id" | "day" | "start_time" | "end_time" | "type" | "title" | "subtitle" | "detail" | "speakers" | "room" | "ref" | "published"
>;

const select =
  "mt-1.5 block w-full rounded-input border border-ink/25 bg-paper px-3.5 py-2.5 focus:outline-2 focus:outline-offset-2 focus:outline-signal aria-invalid:border-[#b42318]";

function Select({ label, name, error, children, defaultValue }: { label: string; name: string; error?: string; children: React.ReactNode; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-small font-semibold">
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue} className={select} aria-invalid={error ? true : undefined} aria-describedby={error ? `${name}-error` : undefined}>
        {children}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-small font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export function SlotForm({
  slot,
  day,
  days,
  anchors,
}: {
  slot?: Slot;
  day: 1 | 2;
  days: readonly { index: 1 | 2; label: string }[];
  anchors: readonly { id: string; label: string }[];
}) {
  const [state, action] = useActionState(saveSlot, null);
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-2xl space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      {slot && <input type="hidden" name="id" value={slot.id} />}

      <div className="grid gap-5 sm:grid-cols-3">
        <Select label="Jour" name="day" defaultValue={String(slot?.day ?? day)} error={e?.day}>
          {days.map((d) => (
            <option key={d.index} value={d.index}>
              {d.label}
            </option>
          ))}
        </Select>
        <Field label="Début" name="start_time" type="time" required defaultValue={slot?.start_time.slice(0, 5)} error={e?.start_time} />
        <Field label="Fin (facultatif)" name="end_time" type="time" defaultValue={slot?.end_time?.slice(0, 5) ?? ""} error={e?.end_time} />
      </div>

      <Select label="Type" name="type" defaultValue={slot?.type ?? "conference"} error={e?.type}>
        {Object.entries(SESSION_TYPE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Field label="Titre" name="title" required defaultValue={slot?.title} error={e?.title} hint="Ex. « Conférence 1 », « Pause déjeuner & networking libre »." />
      <Field label="Sous-titre (facultatif)" name="subtitle" defaultValue={slot?.subtitle ?? ""} error={e?.subtitle} hint="Le sujet d’une conférence ou d’un panel." />
      <Field label="Précision (facultatif)" name="detail" defaultValue={slot?.detail ?? ""} error={e?.detail} hint="Ex. « 45 min + questions »." />
      <Field
        label="Intervenants (facultatif)"
        name="speakers"
        defaultValue={slot?.speakers ?? ""}
        error={e?.speakers}
        hint="Affiché sur le site (programme). Uniquement des intervenants confirmés, séparés par des virgules. Ex. « Awa Koné (Orange CI), Jean Yao (modérateur) »."
      />
      <Field
        label="Salle (facultatif)"
        name="room"
        defaultValue={slot?.room ?? ""}
        error={e?.room}
        hint="Interne : jamais affichée sur le site tant que le lieu n’est pas annoncé."
      />
      <Select label="Description détaillée liée" name="ref" defaultValue={slot?.ref ?? ""} error={e?.ref}>
        <option value="">Aucune</option>
        {anchors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </Select>
      <Checkbox label="Publié sur le site" name="published" defaultChecked={slot?.published ?? false} hint="Décoché, le créneau reste enregistré mais n’apparaît pas dans le programme." />

      <FormMessage state={state} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-48">
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>
        <Link href="/admin/programme" className="text-small underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  );
}
