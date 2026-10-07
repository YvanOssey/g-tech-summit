"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { SESSION_TYPE_LABEL, type SessionType } from "@/content/programme";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { PROGRAMME_TAG } from "@/server/cache-tags";
import { fieldErrors, optionalText } from "@/server/validation";
import { PROGRAMME_ANCHORS } from "./anchors";

const id = z.string().uuid();
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure au format HH:MM.");
const TYPES = Object.keys(SESSION_TYPE_LABEL) as [SessionType, ...SessionType[]];

const slotSchema = z
  .object({
    day: z.coerce.number().pipe(z.union([z.literal(1), z.literal(2)])),
    start_time: time,
    end_time: time.nullable(),
    type: z.enum(TYPES, "Choisissez un type."),
    title: z.string().min(3, "Le titre est trop court.").max(160, "160 caractères maximum."),
    subtitle: z.string().max(200, "200 caractères maximum.").nullable(),
    detail: z.string().max(300, "300 caractères maximum.").nullable(),
    speakers: z.string().max(300, "300 caractères maximum.").nullable(),
    room: z.string().max(120, "120 caractères maximum.").nullable(),
    ref: z
      .string()
      .refine((v) => PROGRAMME_ANCHORS.some((a) => a.id === v), "Description inconnue.")
      .nullable(),
    published: z.boolean(),
  })
  .refine((v) => !v.end_time || v.end_time > v.start_time, { path: ["end_time"], message: "La fin doit être après le début." });

export async function saveSlot(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = slotSchema.safeParse({
    day: formData.get("day"),
    start_time: formData.get("start_time"),
    end_time: optionalText(formData.get("end_time")),
    type: formData.get("type"),
    title: optionalText(formData.get("title")) ?? "",
    subtitle: optionalText(formData.get("subtitle")),
    detail: optionalText(formData.get("detail")),
    speakers: optionalText(formData.get("speakers")),
    room: optionalText(formData.get("room")),
    ref: optionalText(formData.get("ref")),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const db = await createSessionClient();
  const existing = formData.get("id") ? id.parse(formData.get("id")) : null;

  if (existing) {
    const { error } = await db.from("programme_slots").update(parsed.data).eq("id", existing);
    if (error) return { error: "Le créneau n’a pas pu être enregistré." };
    await logAction(db, admin.id, "update", "programme_slots", existing, { day: parsed.data.day, published: parsed.data.published });
  } else {
    const { data, error } = await db.from("programme_slots").insert(parsed.data).select("id").single();
    if (error) return { error: "Le créneau n’a pas pu être ajouté." };
    await logAction(db, admin.id, "create", "programme_slots", data.id, { day: parsed.data.day, published: parsed.data.published });
  }

  updateTag(PROGRAMME_TAG);
  redirect(`/admin/programme?ok=enregistre#jour-${parsed.data.day}`);
}

export async function deleteSlot(formData: FormData) {
  const admin = await requireAdmin();
  const slotId = id.parse(formData.get("id"));
  const db = await createSessionClient();
  const { error } = await db.from("programme_slots").delete().eq("id", slotId);
  if (error) redirect("/admin/programme?erreur=suppression");
  await logAction(db, admin.id, "delete", "programme_slots", slotId);
  updateTag(PROGRAMME_TAG);
  redirect("/admin/programme?ok=supprime");
}

export async function toggleSlot(formData: FormData) {
  const admin = await requireAdmin();
  const slotId = id.parse(formData.get("id"));
  const published = formData.get("published") === "true";
  const db = await createSessionClient();
  const { error } = await db.from("programme_slots").update({ published }).eq("id", slotId);
  if (error) redirect("/admin/programme?erreur=enregistrement");
  await logAction(db, admin.id, published ? "publish" : "unpublish", "programme_slots", slotId);
  updateTag(PROGRAMME_TAG);
  redirect("/admin/programme");
}
