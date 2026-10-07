import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Programme" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Programme" description="Les créneaux des deux jours." />
      <UpcomingSection phase={6}>
        Créer, modifier, publier et réordonner les créneaux. Les 18 créneaux actuels sont déjà importés en base ; le site public lit encore le programme depuis le code.
      </UpcomingSection>
    </>
  );
}
