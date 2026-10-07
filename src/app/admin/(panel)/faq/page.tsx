import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "FAQ" };

export default async function Page() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="FAQ" description="Les questions fréquentes de la page Infos pratiques." />
      <UpcomingSection phase={5}>
        Modifier, réordonner, publier ou masquer les questions. Les 9 questions actuelles sont déjà importées en base.
      </UpcomingSection>
    </>
  );
}
