import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Mot de passe" };

/** Reached after a reset link, or from the account name in the header. */
export default async function PasswordPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Choisir un mot de passe" description="Il remplace votre mot de passe actuel." />
      <div className="max-w-sm border border-ink/10 bg-paper p-6">
        <PasswordForm />
      </div>
    </>
  );
}
