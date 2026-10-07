import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Journal d’activité" };

export default async function Page() {
  await requireAdmin("SUPER_ADMIN");

  return (
    <>
      <PageHeader title="Journal d’activité" description="Qui a fait quoi, et quand, dans l’administration." />
      <UpcomingSection phase={5}>
        Connexions, modifications et exports, enregistrés depuis la phase 2.
      </UpcomingSection>
    </>
  );
}
