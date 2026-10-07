import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Participants" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Participants" description="Les personnes inscrites et leurs coordonnées." />
      <UpcomingSection phase={9}>
        Liste, recherche, filtres, fiche et export CSV. Les participants proviendront du tunnel d’achat (phase 8) : tant que les inscriptions en ligne sont fermées, il n’y en a aucun.
      </UpcomingSection>
    </>
  );
}
