"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { PARTNER_BUCKET, isStoredLogo } from "@/lib/partner-logo";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { PARTNERS_TAG } from "@/server/cache-tags";
import { readImageInfo } from "@/server/images";
import { moveRow, nextPosition } from "@/server/repositories/ordering";
import { fieldErrors, optionalText } from "@/server/validation";

const id = z.string().uuid();
const MAX_LOGO_BYTES = 1024 * 1024;

const partnerSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(120, "120 caractères maximum."),
  website_url: z
    .string()
    .url("Adresse invalide.")
    .startsWith("https://", "L’adresse doit commencer par https://")
    .max(300)
    .nullable(),
  category: z.string().max(60, "60 caractères maximum.").nullable(),
  published: z.boolean(),
});

type Db = Awaited<ReturnType<typeof createSessionClient>>;

/** Checks and uploads a logo. Returns its storage path and size, or an error message. */
async function uploadLogo(db: Db, file: File): Promise<{ path: string; width: number; height: number } | { error: string }> {
  if (file.size > MAX_LOGO_BYTES) return { error: "Le logo dépasse 1 Mo." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const info = readImageInfo(bytes);
  if (!info) return { error: "Format non accepté : PNG, JPEG ou WebP uniquement (pas de SVG)." };
  if (info.width < 40 || info.height < 40 || info.width > 4000 || info.height > 4000)
    return { error: "Dimensions inattendues : entre 40 et 4 000 pixels de côté." };

  const path = `${randomUUID()}.${info.ext}`;
  const { error } = await db.storage.from(PARTNER_BUCKET).upload(path, bytes, { contentType: info.type, upsert: false });
  if (error) return { error: "Le logo n’a pas pu être envoyé." };
  return { path, width: info.width, height: info.height };
}

export async function savePartner(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = partnerSchema.safeParse({
    name: formData.get("name"),
    website_url: optionalText(formData.get("website_url")),
    category: optionalText(formData.get("category")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const db = await createSessionClient();
  const existing = formData.get("id") ? id.parse(formData.get("id")) : null;
  const file = formData.get("logo");
  const hasFile = file instanceof File && file.size > 0;

  if (!existing && !hasFile) return { fieldErrors: { logo: "Ajoutez le logo du partenaire." } };

  let logo: { path: string; width: number; height: number } | null = null;
  if (hasFile) {
    const uploaded = await uploadLogo(db, file);
    if ("error" in uploaded) return { fieldErrors: { logo: uploaded.error } };
    logo = uploaded;
  }
  const logoFields = logo ? { logo_path: logo.path, logo_width: logo.width, logo_height: logo.height } : {};

  if (existing) {
    const { data: before } = await db.from("partners").select("logo_path").eq("id", existing).maybeSingle();
    const { error } = await db.from("partners").update({ ...parsed.data, ...logoFields }).eq("id", existing);
    if (error) return { error: "Le partenaire n’a pas pu être enregistré." };
    // Replaced logo: remove the old uploaded file (files shipped in /public stay).
    if (logo && before && isStoredLogo(before.logo_path)) await db.storage.from(PARTNER_BUCKET).remove([before.logo_path]);
    await logAction(db, admin.id, "update", "partners", existing, { name: parsed.data.name, published: parsed.data.published, logo: Boolean(logo) });
  } else if (logo) {
    const { data, error } = await db
      .from("partners")
      .insert({ ...parsed.data, ...logoFields, logo_path: logo.path, logo_width: logo.width, logo_height: logo.height, position: await nextPosition(db, "partners") })
      .select("id")
      .single();
    if (error) {
      await db.storage.from(PARTNER_BUCKET).remove([logo.path]);
      return { error: "Le partenaire n’a pas pu être ajouté." };
    }
    await logAction(db, admin.id, "create", "partners", data.id, { name: parsed.data.name, published: parsed.data.published });
  }

  updateTag(PARTNERS_TAG);
  redirect("/admin/partenaires?ok=enregistre");
}

export async function deletePartner(formData: FormData) {
  const admin = await requireAdmin();
  const partnerId = id.parse(formData.get("id"));
  const db = await createSessionClient();
  const { data: partner } = await db.from("partners").select("name, logo_path").eq("id", partnerId).maybeSingle();
  if (!partner) redirect("/admin/partenaires");

  const { error } = await db.from("partners").delete().eq("id", partnerId);
  if (error) redirect("/admin/partenaires?erreur=suppression");
  if (isStoredLogo(partner.logo_path)) await db.storage.from(PARTNER_BUCKET).remove([partner.logo_path]);
  await logAction(db, admin.id, "delete", "partners", partnerId, { name: partner.name });
  updateTag(PARTNERS_TAG);
  redirect("/admin/partenaires?ok=supprime");
}

export async function movePartner(formData: FormData) {
  const admin = await requireAdmin();
  const partnerId = id.parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));
  const db = await createSessionClient();
  if (await moveRow(db, "partners", partnerId, direction)) {
    await logAction(db, admin.id, "move", "partners", partnerId, { direction });
    updateTag(PARTNERS_TAG);
  }
  redirect("/admin/partenaires");
}

export async function togglePartner(formData: FormData) {
  const admin = await requireAdmin();
  const partnerId = id.parse(formData.get("id"));
  const published = formData.get("published") === "true";
  const db = await createSessionClient();
  const { error } = await db.from("partners").update({ published }).eq("id", partnerId);
  if (error) redirect("/admin/partenaires?erreur=enregistrement");
  await logAction(db, admin.id, published ? "publish" : "unpublish", "partners", partnerId);
  updateTag(PARTNERS_TAG);
  redirect("/admin/partenaires");
}
