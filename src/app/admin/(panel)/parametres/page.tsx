import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Paramètres" };

export default async function Page() {
  await requireAdmin("SUPER_ADMIN");

  return (
    <>
      <PageHeader title="Paramètres" description="Les réglages sensibles de l’événement." />
      <UpcomingSection phase={5}>
        Lieu de l’événement et ouverture des inscriptions en ligne. Réservé aux super administrateurs.
      </UpcomingSection>
    </>
  );
}
