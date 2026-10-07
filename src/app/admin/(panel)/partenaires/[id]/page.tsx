import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { PartnerForm } from "../PartnerForm";

export const metadata: Metadata = { title: "Modifier un partenaire" };

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse((await params).id);
  if (!parsed.success) notFound();

  const db = await createSessionClient();
  const { data: partner } = await db
    .from("partners")
    .select("id, name, logo_path, logo_width, logo_height, website_url, category, published")
    .eq("id", parsed.data)
    .maybeSingle();
  if (!partner) notFound();

  return (
    <>
      <PageHeader title={`Modifier ${partner.name}`} />
      <PartnerForm partner={partner} />
    </>
  );
}
