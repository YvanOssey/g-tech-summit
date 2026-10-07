import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { FaqForm } from "../FaqForm";

export const metadata: Metadata = { title: "Nouvelle question" };

export default async function NewFaqPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Nouvelle question" description="Elle sera ajoutée en fin de liste." />
      <FaqForm />
    </>
  );
}
