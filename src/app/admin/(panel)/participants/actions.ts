"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { teammate } from "@/server/checkout/schema";
import { fieldErrors } from "@/server/validation";

const id = z.string().uuid();
const notes = z.string().max(2000, "2 000 caractères maximum.");

/**
 * Corrects a participant's details (typo in a name or an e-mail). The name
 * appears on the ticket, so every change is logged with the fields touched.
 */
export async function updateParticipant(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const participantId = id.parse(formData.get("id"));
  const values = Object.fromEntries([...formData].filter(([k, v]) => !k.startsWith("$") && typeof v === "string")) as Record<string, string>;

  const parsed = teammate.extend({ notes }).safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: String(formData.get("phone") ?? "").trim(),
    notes: String(formData.get("notes") ?? ""),
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  const db = await createSessionClient();
  const { data: before } = await db.from("participants").select("first_name, last_name, email, phone, notes").eq("id", participantId).maybeSingle();
  if (!before) redirect("/admin/participants");

  const next = { ...parsed.data, notes: parsed.data.notes.trim() || null };
  const changed = (Object.keys(next) as (keyof typeof next)[]).filter((k) => (before[k] ?? null) !== (next[k] ?? null));
  if (changed.length === 0) return { message: "Aucune modification.", values };

  const { error } = await db.from("participants").update(next).eq("id", participantId);
  if (error) return { error: "Les informations n’ont pas pu être enregistrées.", values };

  await logAction(db, admin.id, "update", "participants", participantId, { fields: changed });
  redirect(`/admin/participants/${participantId}?ok=1`);
}
