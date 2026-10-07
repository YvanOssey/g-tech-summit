import type { Metadata } from "next";
import { Notice, PageHeader, UpcomingSection } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Tableau de bord" };

/** Placeholder until the dashboard (phase 4). */
export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);

  return (
    <>
      {params["mot-de-passe"] === "ok" && <Notice>Votre mot de passe a été enregistré.</Notice>}
      <PageHeader title="Tableau de bord" description={`Connecté en tant que ${admin.email}.`} />
      <UpcomingSection phase={4}>
        Participants, billets vendus par pass, paiements, chiffre d’affaires, inscriptions récentes et programme à venir —
        uniquement à partir des données réelles.
      </UpcomingSection>
    </>
  );
}
