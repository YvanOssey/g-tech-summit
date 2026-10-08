"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { Checkbox, Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { SPEAKER_KINDS, SPEAKER_KIND_LABEL, SPEAKER_SESSIONS } from "@/content/speakers";
import { speakerPhotoUrl } from "@/lib/speaker-photo";
import type { SpeakerRow } from "@/server/db/types";
import { saveSpeaker } from "./actions";

type Speaker = Pick<SpeakerRow, "id" | "name" | "role" | "kind" | "session_ref" | "photo_path" | "photo_width" | "photo_height" | "published">;

const select =
  "mt-1.5 block w-full rounded-input border border-ink/25 bg-paper px-3.5 py-2.5 focus:outline-2 focus:outline-offset-2 focus:outline-signal aria-invalid:border-[#b42318]";

function Select({ label, name, error, hint, children, defaultValue }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-small font-semibold">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-small text-grey">{hint}</p>}
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

export function SpeakerForm({ speaker, session }: { speaker?: Speaker; session?: string }) {
  const [state, action] = useActionState(saveSpeaker, null);
  const e = state?.fieldErrors;

  return (
    <form action={action} className="max-w-2xl space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      {speaker && <input type="hidden" name="id" value={speaker.id} />}
      <Field label="Nom" name="name" required defaultValue={speaker?.name} error={e?.name} hint="Prénom et nom, orthographe validée par l’intervenant." />
      <Field
        label="Fonction et structure (facultatif)"
        name="role"
        defaultValue={speaker?.role ?? ""}
        error={e?.role}
        hint="Affiché sous le nom. Ex. « Directrice digitale, Orange Côte d’Ivoire »."
      />

      <Select label="Session" name="session_ref" defaultValue={speaker?.session_ref ?? session ?? ""} error={e?.session_ref}>
        <option value="" disabled>
          Choisir…
        </option>
        {SPEAKER_SESSIONS.map((s) => (
          <option key={s.ref} value={s.ref}>
            {s.title ? `${s.kind} — ${s.title}` : s.kind}
          </option>
        ))}
      </Select>
      <Select label="Rôle dans la session" name="kind" defaultValue={speaker?.kind ?? ""} error={e?.kind}>
        <option value="" disabled>
          Choisir…
        </option>
        {SPEAKER_KINDS.map((k) => (
          <option key={k} value={k}>
            {SPEAKER_KIND_LABEL[k]}
          </option>
        ))}
      </Select>

      {speaker?.photo_path && speaker.photo_width && speaker.photo_height && (
        <div>
          <p className="text-small font-semibold">Photo actuelle</p>
          <Image
            src={speakerPhotoUrl(speaker.photo_path)}
            alt={`Photo de ${speaker.name}`}
            width={speaker.photo_width}
            height={speaker.photo_height}
            className="mt-1.5 aspect-square w-32 border border-ink/10 object-cover"
          />
          <div className="mt-2">
            <Checkbox label="Retirer la photo" name="remove_photo" hint="Le site affiche alors les initiales." />
          </div>
        </div>
      )}
      <Field
        label={speaker?.photo_path ? "Remplacer la photo" : "Photo (facultatif)"}
        name="photo"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hint="PNG, JPEG ou WebP, 2,5 Mo maximum, 200 × 200 pixels minimum. Visage centré : la photo est recadrée en carré."
        error={e?.photo}
      />
      <Checkbox label="Publié sur le site" name="published" defaultChecked={speaker?.published ?? false} hint="Décoché, l’intervenant reste enregistré mais n’apparaît pas sur le site." />
      <FormMessage state={state} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-48">
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>
        <Link href="/admin/intervenants" className="text-small underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  );
}
