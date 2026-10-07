import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Commandes & billets" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Commandes & billets" description="Les ventes de pass et les billets émis." />
      <UpcomingSection phase={9}>
        Chaque commande avec ses pass, son statut et les billets nominatifs (un par personne, membres d’équipe hackathon compris), avec renvoi du billet par e-mail.
      </UpcomingSection>
    </>
  );
}
