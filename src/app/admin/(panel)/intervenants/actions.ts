"use server";

import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { SPEAKER_KINDS, SPEAKER_SESSION_REFS } from "@/content/speakers";
import { SPEAKER_BUCKET } from "@/lib/speaker-photo";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { SPEAKERS_TAG } from "@/server/cache-tags";
import { readImageInfo } from "@/server/images";
import { moveRow, nextPosition } from "@/server/repositories/ordering";
import { fieldErrors, optionalText } from "@/server/validation";

const id = z.string().uuid();
/** Phone photos are often 1–2 MB: 2.5 MB keeps them usable as they are. */
const MAX_PHOTO_BYTES = 2.5 * 1024 * 1024;

const speakerSchema = z.object({
  name: z.string().trim().min(2, "Le nom est trop court.").max(120, "120 caractères maximum."),
  role: z.string().max(160, "160 caractères maximum.").nullable(),
  kind: z.enum(SPEAKER_KINDS, "Choisissez un rôle."),
  session_ref: z.enum(SPEAKER_SESSION_REFS, "Choisissez une session."),
  published: z.boolean(),
});

type Db = Awaited<ReturnType<typeof createSessionClient>>;

/** Checks and uploads a photo. Returns its storage path and size, or an error message. */
async function uploadPhoto(db: Db, file: File): Promise<{ path: string; width: number; height: number } | { error: string }> {
  if (file.size > MAX_PHOTO_BYTES) return { error: "La photo dépasse 2,5 Mo : réduisez-la avant de l’envoyer." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const info = readImageInfo(bytes);
  if (!info) return { error: "Format non accepté : PNG, JPEG ou WebP uniquement." };
  if (info.width < 200 || info.height < 200) return { error: "Photo trop petite : 200 × 200 pixels minimum." };
  if (info.width > 8000 || info.height > 8000) return { error: "Photo trop grande : 8 000 pixels de côté maximum." };

  const path = `${randomUUID()}.${info.ext}`;
  const { error } = await db.storage.from(SPEAKER_BUCKET).upload(path, bytes, { contentType: info.type, upsert: false });
  if (error) return { error: "La photo n’a pas pu être envoyée." };
  return { path, width: info.width, height: info.height };
}

export async function saveSpeaker(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = speakerSchema.safeParse({
    name: formData.get("name"),
    role: optionalText(formData.get("role")),
    kind: formData.get("kind"),
    session_ref: formData.get("session_ref"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const db = await createSessionClient();
  const existing = formData.get("id") ? id.parse(formData.get("id")) : null;
  const file = formData.get("photo");
  const removePhoto = formData.get("remove_photo") === "on";

  let photo: { path: string; width: number; height: number } | null = null;
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadPhoto(db, file);
    if ("error" in uploaded) return { fieldErrors: { photo: uploaded.error } };
    photo = uploaded;
  }
  const photoFields = photo
    ? { photo_path: photo.path, photo_width: photo.width, photo_height: photo.height }
    : removePhoto
      ? { photo_path: null, photo_width: null, photo_height: null }
      : {};

  if (existing) {
    const { data: before } = await db.from("speakers").select("photo_path").eq("id", existing).maybeSingle();
    const { error } = await db.from("speakers").update({ ...parsed.data, ...photoFields }).eq("id", existing);
    if (error) {
      if (photo) await db.storage.from(SPEAKER_BUCKET).remove([photo.path]);
      return { error: "L’intervenant n’a pas pu être enregistré." };
    }
    // Replaced or removed photo: delete the old file.
    if ((photo || removePhoto) && before?.photo_path) await db.storage.from(SPEAKER_BUCKET).remove([before.photo_path]);
    await logAction(db, admin.id, "update", "speakers", existing, {
      name: parsed.data.name,
      session: parsed.data.session_ref,
      published: parsed.data.published,
      photo: photo ? "remplacée" : removePhoto ? "retirée" : "inchangée",
    });
  } else {
    const { data, error } = await db
      .from("speakers")
      .insert({ ...parsed.data, ...photoFields, position: await nextPosition(db, "speakers") })
      .select("id")
      .single();
    if (error) {
      if (photo) await db.storage.from(SPEAKER_BUCKET).remove([photo.path]);
      return { error: "L’intervenant n’a pas pu être ajouté." };
    }
    await logAction(db, admin.id, "create", "speakers", data.id, { name: parsed.data.name, session: parsed.data.session_ref, published: parsed.data.published });
  }

  updateTag(SPEAKERS_TAG);
  redirect("/admin/intervenants?ok=enregistre");
}

export async function deleteSpeaker(formData: FormData) {
  const admin = await requireAdmin();
  const speakerId = id.parse(formData.get("id"));
  const db = await createSessionClient();
  const { data: speaker } = await db.from("speakers").select("name, photo_path").eq("id", speakerId).maybeSingle();
  if (!speaker) redirect("/admin/intervenants");

  const { error } = await db.from("speakers").delete().eq("id", speakerId);
  if (error) redirect("/admin/intervenants?erreur=suppression");
  if (speaker.photo_path) await db.storage.from(SPEAKER_BUCKET).remove([speaker.photo_path]);
  await logAction(db, admin.id, "delete", "speakers", speakerId, { name: speaker.name });
  updateTag(SPEAKERS_TAG);
  redirect("/admin/intervenants?ok=supprime");
}

export async function moveSpeaker(formData: FormData) {
  const admin = await requireAdmin();
  const speakerId = id.parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));
  const db = await createSessionClient();
  const { data: speaker } = await db.from("speakers").select("session_ref").eq("id", speakerId).maybeSingle();
  if (!speaker) redirect("/admin/intervenants");
  if (await moveRow(db, "speakers", speakerId, direction, speaker.session_ref)) {
    await logAction(db, admin.id, "move", "speakers", speakerId, { direction });
    updateTag(SPEAKERS_TAG);
  }
  redirect("/admin/intervenants");
}

export async function toggleSpeaker(formData: FormData) {
  const admin = await requireAdmin();
  const speakerId = id.parse(formData.get("id"));
  const published = formData.get("published") === "true";
  const db = await createSessionClient();
  const { error } = await db.from("speakers").update({ published }).eq("id", speakerId);
  if (error) redirect("/admin/intervenants?erreur=enregistrement");
  await logAction(db, admin.id, published ? "publish" : "unpublish", "speakers", speakerId);
  updateTag(SPEAKERS_TAG);
  redirect("/admin/intervenants");
}
