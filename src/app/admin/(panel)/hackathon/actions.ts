"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { EVENT } from "@/config/event";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";
import { fieldErrors, optionalText } from "@/server/validation";

const LAST_DAY = EVENT.days[EVENT.days.length - 1].iso;

/** ISO date (YYYY-MM-DD), on or before the last day of the event. */
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Date invalide.")
  .refine((v) => v <= LAST_DAY, "La date doit précéder la fin de l’événement.")
  .nullable();

const hackathonSchema = z
  .object({
    registration_deadline: date,
    challenges_start: date,
    jury: z.array(z.string().max(120, "Un nom dépasse 120 caractères.")).max(20, "20 membres au maximum."),
  })
  .refine((v) => !v.registration_deadline || !v.challenges_start || v.registration_deadline <= v.challenges_start, {
    path: ["registration_deadline"],
    message: "La date limite d’inscription doit précéder le début des défis.",
  });

export async function saveHackathon(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const jury = String(formData.get("jury") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = hackathonSchema.safeParse({
    registration_deadline: optionalText(formData.get("registration_deadline")),
    challenges_start: optionalText(formData.get("challenges_start")),
    jury,
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const db = await createSessionClient();
  const { error } = await db
    .from("event_settings")
    .update({ ...parsed.data, jury: parsed.data.jury.length ? parsed.data.jury : null, updated_by: admin.id })
    .eq("id", 1);
  if (error) return { error: "Les informations du hackathon n’ont pas pu être enregistrées." };

  await logAction(db, admin.id, "update", "event_settings", "hackathon", {
    registration_deadline: parsed.data.registration_deadline,
    challenges_start: parsed.data.challenges_start,
    jury_count: parsed.data.jury.length,
  });
  updateTag(EVENT_SETTINGS_TAG);
  redirect("/admin/hackathon?ok=1");
}
