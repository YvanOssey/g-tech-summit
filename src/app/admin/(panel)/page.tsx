import type { Metadata } from "next";
import Link from "next/link";
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
      {params.acces === "refuse" && (
        <p role="alert" className="mb-6 border-l-2 border-[#b42318] bg-[#b42318]/8 px-3 py-2 text-small text-[#7a1a12]">
          Votre rôle ne donne pas accès à cette page.
        </p>
      )}
      {params["mot-de-passe"] === "ok" && (
        <p className="mb-6 border-l-2 border-ink bg-stone px-3 py-2 text-small">Votre mot de passe a été enregistré.</p>
      )}
      <h1 className="text-heading font-semibold">Tableau de bord</h1>
      <p className="mt-2 text-grey">Connecté en tant que {admin.email}. Le tableau de bord arrive à la phase 4.</p>
      <p className="mt-6 text-small">
        <Link href="/admin/mot-de-passe" className="underline underline-offset-4 hover:text-signal-text">
          Changer mon mot de passe
        </Link>
      </p>
    </>
  );
}
