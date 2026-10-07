import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/require-admin";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "Mot de passe" };

/** Reached after an invitation or a reset link, or from the dashboard. */
export default async function PasswordPage() {
  await requireAdmin();

  return (
    <div className="max-w-sm">
      <h1 className="text-heading font-semibold">Choisir un mot de passe</h1>
      <p className="mt-2 text-small text-grey">Il remplace votre mot de passe actuel.</p>
      <div className="mt-6 border border-ink/10 bg-paper p-6">
        <PasswordForm />
      </div>
    </div>
  );
}
