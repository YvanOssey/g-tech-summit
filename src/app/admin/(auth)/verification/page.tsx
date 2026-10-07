import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin, isMfaPending } from "@/server/auth/require-admin";
import { safeNext } from "@/server/auth/safe-next";
import { signOut } from "../../(panel)/actions";
import { VerifyForm } from "./VerifyForm";

export const metadata: Metadata = { title: "Vérification" };

/** Second step of the sign-in for accounts with two-factor authentication. */
export default async function VerificationPage({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const [{ suite }, admin] = await Promise.all([searchParams, getAdmin()]);
  const next = suite ? safeNext(suite) : undefined;
  if (admin) redirect(next ?? "/admin");
  if (!(await isMfaPending())) redirect("/admin/login");

  return (
    <>
      <h1 className="text-heading font-semibold leading-tight">Vérification</h1>
      <p className="mt-2 text-small text-grey">
        Ouvrez votre application d’authentification (Google Authenticator, Microsoft Authenticator…) et saisissez le code affiché pour
        G-TECH SUMMIT.
      </p>
      <div className="mt-6">
        <VerifyForm suite={next} />
      </div>
      <form action={signOut} className="mt-6 text-center">
        <button type="submit" className="text-small underline underline-offset-4">
          Annuler et se déconnecter
        </button>
      </form>
    </>
  );
}
