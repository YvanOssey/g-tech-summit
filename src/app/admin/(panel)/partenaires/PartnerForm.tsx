"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { Checkbox, Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { partnerLogoUrl } from "@/lib/partner-logo";
import type { PartnerRow } from "@/server/db/types";
import { savePartner } from "./actions";

type Partner = Pick<PartnerRow, "id" | "name" | "logo_path" | "logo_width" | "logo_height" | "website_url" | "category" | "published">;

export function PartnerForm({ partner }: { partner?: Partner }) {
  const [state, action] = useActionState(savePartner, null);

  return (
    <form action={action} className="max-w-2xl space-y-5 border border-ink/10 bg-paper p-6" noValidate>
      {partner && <input type="hidden" name="id" value={partner.id} />}
      <Field label="Nom" name="name" required defaultValue={partner?.name} error={state?.fieldErrors?.name} hint="Orthographe exacte, validée par le partenaire." />

      {partner && (
        <div>
          <p className="text-small font-semibold">Logo actuel</p>
          <div className="mt-1.5 flex h-24 w-56 items-center justify-center border border-ink/10 bg-paper p-3">
            <Image
              src={partnerLogoUrl(partner.logo_path)}
              alt={`Logo ${partner.name}`}
              width={partner.logo_width}
              height={partner.logo_height}
              className="max-h-full w-auto object-contain"
            />
          </div>
        </div>
      )}
      <Field
        label={partner ? "Remplacer le logo" : "Logo"}
        name="logo"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        required={!partner}
        hint="PNG, JPEG ou WebP, 1 Mo maximum. Couleurs d’origine du partenaire, fond transparent de préférence."
        error={state?.fieldErrors?.logo}
      />
      <Field
        label="Site web (facultatif)"
        name="website_url"
        type="url"
        inputMode="url"
        placeholder="https://"
        defaultValue={partner?.website_url ?? ""}
        error={state?.fieldErrors?.website_url}
      />
      <Field label="Catégorie (facultatif)" name="category" defaultValue={partner?.category ?? ""} error={state?.fieldErrors?.category} />
      <Checkbox label="Publié sur le site" name="published" defaultChecked={partner?.published ?? false} hint="Décoché, le partenaire reste enregistré mais n’apparaît pas sur le site." />
      <FormMessage state={state} />
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-48">
          <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
        </div>
        <Link href="/admin/partenaires" className="text-small underline underline-offset-4">
          Annuler
        </Link>
      </div>
    </form>
  );
}
