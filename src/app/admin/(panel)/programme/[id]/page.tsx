import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PageHeader } from "@/components/admin/ui";
import { EVENT } from "@/config/event";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { PROGRAMME_ANCHORS } from "../anchors";
import { SlotForm } from "../SlotForm";

export const metadata: Metadata = { title: "Modifier un créneau" };

const DAYS = EVENT.days.map((d, i) => ({ index: (i + 1) as 1 | 2, label: d.label }));

export default async function EditSlotPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const parsed = z.string().uuid().safeParse((await params).id);
  if (!parsed.success) notFound();

  const db = await createSessionClient();
  const { data: slot } = await db
    .from("programme_slots")
    .select("id, day, start_time, end_time, type, title, subtitle, detail, speakers, room, ref, published")
    .eq("id", parsed.data)
    .maybeSingle();
  if (!slot) notFound();

  return (
    <>
      <PageHeader title="Modifier un créneau" description={`${slot.title} · jour ${slot.day} à ${slot.start_time.slice(0, 5)}`} />
      <SlotForm slot={slot} day={slot.day} days={DAYS} anchors={PROGRAMME_ANCHORS} />
    </>
  );
}
