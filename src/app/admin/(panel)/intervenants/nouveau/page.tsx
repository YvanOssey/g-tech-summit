import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { SPEAKER_SESSION_REFS } from "@/content/speakers";
import { requireAdmin } from "@/server/auth/require-admin";
import { SpeakerForm } from "../SpeakerForm";

export const metadata: Metadata = { title: "Nouvel intervenant" };

export default async function NewSpeakerPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const [, { session }] = await Promise.all([requireAdmin(), searchParams]);
  return (
    <>
      <PageHeader title="Nouvel intervenant" description="Uniquement un intervenant confirmé. Il sera ajouté en fin de sa session." />
      <SpeakerForm session={session && SPEAKER_SESSION_REFS.includes(session) ? session : undefined} />
    </>
  );
}
