import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Partenaires" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Partenaires" description="Les partenaires affichés sur le site." />
      <UpcomingSection phase={5}>
        Ajouter un partenaire, changer son logo, son ordre ou le masquer. Les 9 partenaires actuels sont déjà importés en base.
      </UpcomingSection>
    </>
  );
}
