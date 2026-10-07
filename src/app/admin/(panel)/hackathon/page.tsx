import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Hackathon" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Hackathon" description="Les informations du hackathon encore à annoncer." />
      <UpcomingSection phase={7}>
        Date limite d’inscription, début des défis et jury. Le thème, les deux thématiques et le règlement restent gérés dans le code.
      </UpcomingSection>
    </>
  );
}
