import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { PartnerForm } from "../PartnerForm";

export const metadata: Metadata = { title: "Nouveau partenaire" };

export default async function NewPartnerPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Nouveau partenaire" description="Uniquement un partenaire confirmé par les organisateurs. Il sera ajouté en fin de liste." />
      <PartnerForm />
    </>
  );
}
