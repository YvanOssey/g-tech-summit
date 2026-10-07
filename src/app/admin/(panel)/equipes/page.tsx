import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Équipes hackathon" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Équipes hackathon" description="Les équipes inscrites au hackathon et leurs membres." />
      <UpcomingSection phase={9}>
        Nom de l’équipe, thématique choisie, 2 à 3 membres et capitaine. 10 équipes au maximum.
      </UpcomingSection>
    </>
  );
}
