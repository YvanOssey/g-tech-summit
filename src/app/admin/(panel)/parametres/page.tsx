import type { Metadata } from "next";
import { Notice, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { createSessionClient } from "@/server/auth/session";
import { hasWebhookSecret, isCheckoutReady } from "@/server/payments/readiness";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [, params] = await Promise.all([requireAdmin("SUPER_ADMIN"), searchParams]);
  const db = await createSessionClient();
  const { data: settings } = await db
    .from("event_settings")
    .select("venue_name, venue_address, venue_map_url, registration_open")
    .eq("id", 1)
    .maybeSingle();

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Réglages sensibles, réservés aux super administrateurs. Les dates, les pass et leurs prix restent fixés dans le code."
      />
      {params.ok && <Notice>Paramètres enregistrés. Le site est mis à jour à la prochaine visite.</Notice>}
      {settings ? (
        <SettingsForm settings={settings} checkoutReady={isCheckoutReady()} webhookReady={hasWebhookSecret()} />
      ) : (
        <Notice tone="error">Les paramètres n’ont pas pu être chargés.</Notice>
      )}
    </>
  );
}
