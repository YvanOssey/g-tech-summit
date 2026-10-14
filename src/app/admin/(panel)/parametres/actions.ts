"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";
import { isCheckoutReady } from "@/server/payments/readiness";
import { fieldErrors, optionalText } from "@/server/validation";

const settingsSchema = z
  .object({
    venue_name: z.string().max(160, "160 caractères maximum.").nullable(),
    venue_address: z.string().max(300, "300 caractères maximum.").nullable(),
    venue_map_url: z.string().url("Adresse invalide.").startsWith("https://", "L’adresse doit commencer par https://").max(500).nullable(),
    registration_open: z.boolean(),
    show_upcoming: z.boolean(),
  })
  .refine((v) => Boolean(v.venue_name) === Boolean(v.venue_address), {
    path: ["venue_address"],
    message: "Le nom et l’adresse du lieu vont ensemble : remplissez les deux, ou aucun.",
  });

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin("SUPER_ADMIN");
  const parsed = settingsSchema.safeParse({
    venue_name: optionalText(formData.get("venue_name")),
    venue_address: optionalText(formData.get("venue_address")),
    venue_map_url: optionalText(formData.get("venue_map_url")),
    registration_open: formData.get("registration_open") === "on",
    show_upcoming: formData.get("show_upcoming") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  // Never open registrations while payment cannot be taken.
  const values = { ...parsed.data, registration_open: isCheckoutReady() && parsed.data.registration_open };

  const db = await createSessionClient();
  const { error } = await db
    .from("event_settings")
    .update({ ...values, updated_by: admin.id })
    .eq("id", 1);
  if (error) return { error: "Les paramètres n’ont pas pu être enregistrés." };

  await logAction(db, admin.id, "update", "event_settings", "1", {
    venue: Boolean(values.venue_name),
    registration_open: values.registration_open,
    show_upcoming: values.show_upcoming,
  });
  updateTag(EVENT_SETTINGS_TAG);
  redirect("/admin/parametres?ok=1");
}