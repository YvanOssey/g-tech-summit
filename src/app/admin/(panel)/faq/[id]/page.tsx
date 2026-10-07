import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { FaqForm } from "../FaqForm";

export const metadata: Metadata = { title: "Modifier une question" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse((await params).id);
  if (!parsed.success) notFound();

  const db = await createSessionClient();
  const { data: item } = await db.from("faq_items").select("id, question, answer, published").eq("id", parsed.data).maybeSingle();
  if (!item) notFound();

  return (
    <>
      <PageHeader title="Modifier une question" />
      <FaqForm item={item} />
    </>
  );
}
