import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Paiements" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Paiements" description="Les transactions Genius Pay (Wave)." />
      <UpcomingSection phase={9}>
        Le suivi des paiements : en attente, payé, échoué, annulé, expiré, remboursé. Les statuts viendront uniquement de Genius Pay, jamais d’une saisie manuelle.
      </UpcomingSection>
    </>
  );
}
