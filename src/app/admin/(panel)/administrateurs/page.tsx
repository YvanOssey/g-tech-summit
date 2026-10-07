import type { Metadata } from "next";
import { PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Administrateurs" };

export default async function Page() {
  await requireAdmin("SUPER_ADMIN");

  return (
    <>
      <PageHeader title="Administrateurs" description="Les comptes qui ont accès à cette administration." />
      <UpcomingSection phase={5}>
        Inviter un administrateur, changer son rôle ou désactiver son compte. Les invitations par e-mail demandent un service d’envoi d’e-mails (SMTP) configuré dans Supabase.
      </UpcomingSection>
    </>
  );
}
