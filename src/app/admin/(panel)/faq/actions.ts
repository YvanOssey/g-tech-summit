"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/admin/forms";
import { logAction } from "@/server/audit";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { FAQ_TAG } from "@/server/cache-tags";
import { moveRow, nextPosition } from "@/server/repositories/ordering";
import { fieldErrors } from "@/server/validation";

const id = z.string().uuid();

const faqSchema = z.object({
  question: z.string().trim().min(5, "La question est trop courte.").max(300, "300 caractères maximum."),
  answer: z.string().trim().min(5, "La réponse est trop courte.").max(3000, "3 000 caractères maximum."),
  published: z.boolean(),
});

export async function saveFaq(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = faqSchema.safeParse({
    question: formData.get("question"),
    answer: formData.get("answer"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const db = await createSessionClient();
  const existing = formData.get("id");

  if (existing) {
    const faqId = id.parse(existing);
    const { error } = await db.from("faq_items").update(parsed.data).eq("id", faqId);
    if (error) return { error: "La question n’a pas pu être enregistrée." };
    await logAction(db, admin.id, "update", "faq_items", faqId, { published: parsed.data.published });
  } else {
    const { data, error } = await db
      .from("faq_items")
      .insert({ ...parsed.data, position: await nextPosition(db, "faq_items") })
      .select("id")
      .single();
    if (error) return { error: "La question n’a pas pu être ajoutée." };
    await logAction(db, admin.id, "create", "faq_items", data.id, { published: parsed.data.published });
  }

  updateTag(FAQ_TAG);
  redirect("/admin/faq?ok=enregistre");
}

export async function deleteFaq(formData: FormData) {
  const admin = await requireAdmin();
  const faqId = id.parse(formData.get("id"));
  const db = await createSessionClient();
  const { error } = await db.from("faq_items").delete().eq("id", faqId);
  if (error) redirect("/admin/faq?erreur=suppression");
  await logAction(db, admin.id, "delete", "faq_items", faqId);
  updateTag(FAQ_TAG);
  redirect("/admin/faq?ok=supprime");
}

export async function moveFaq(formData: FormData) {
  const admin = await requireAdmin();
  const faqId = id.parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));
  const db = await createSessionClient();
  if (await moveRow(db, "faq_items", faqId, direction)) {
    await logAction(db, admin.id, "move", "faq_items", faqId, { direction });
    updateTag(FAQ_TAG);
  }
  redirect("/admin/faq");
}

export async function toggleFaq(formData: FormData) {
  const admin = await requireAdmin();
  const faqId = id.parse(formData.get("id"));
  const published = formData.get("published") === "true";
  const db = await createSessionClient();
  const { error } = await db.from("faq_items").update({ published }).eq("id", faqId);
  if (error) redirect("/admin/faq?erreur=enregistrement");
  await logAction(db, admin.id, published ? "publish" : "unpublish", "faq_items", faqId);
  updateTag(FAQ_TAG);
  redirect("/admin/faq");
}
