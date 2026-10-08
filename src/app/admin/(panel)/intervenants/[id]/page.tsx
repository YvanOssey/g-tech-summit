import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { SpeakerForm } from "../SpeakerForm";

export const metadata: Metadata = { title: "Modifier un intervenant" };

export default async function EditSpeakerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse((await params).id);
  if (!parsed.success) notFound();

  const db = await createSessionClient();
  const { data: speaker } = await db
    .from("speakers")
    .select("id, name, role, kind, session_ref, photo_path, photo_width, photo_height, published")
    .eq("id", parsed.data)
    .maybeSingle();
  if (!speaker) notFound();

  return (
    <>
      <PageHeader title={`Modifier ${speaker.name}`} />
      <SpeakerForm speaker={speaker} />
    </>
  );
}
