import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { EVENT } from "@/config/event";
import { requireAdmin } from "@/server/auth/require-admin";
import { PROGRAMME_ANCHORS } from "../anchors";
import { SlotForm } from "../SlotForm";

export const metadata: Metadata = { title: "Nouveau créneau" };

const DAYS = EVENT.days.map((d, i) => ({ index: (i + 1) as 1 | 2, label: d.label }));

export default async function NewSlotPage({ searchParams }: { searchParams: Promise<{ jour?: string }> }) {
  await requireAdmin();
  const day = (await searchParams).jour === "2" ? 2 : 1;

  return (
    <>
      <PageHeader title="Nouveau créneau" description="Il se place automatiquement selon son heure de début." />
      <SlotForm day={day} days={DAYS} anchors={PROGRAMME_ANCHORS} />
    </>
  );
}
