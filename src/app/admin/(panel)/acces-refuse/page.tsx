import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/server/auth/require-admin";
import { ROLE_LABEL } from "@/server/auth/roles";

export const metadata: Metadata = { title: "Accès refusé" };

/** Shown when a signed-in admin opens a page their role does not cover. */
export default async function AccessDeniedPage() {
  const admin = await requireAdmin();

  return (
    <>
      <PageHeader title="Accès refusé" />
      <EmptyState title="Votre rôle ne donne pas accès à cette page">
        <p>
          Vous êtes connecté en tant que {ROLE_LABEL[admin.role].toLowerCase()}. Si vous avez besoin de cet accès,
          demandez-le à un super administrateur.
        </p>
        <p className="mt-4">
          <Link href="/admin" className="font-medium text-ink underline underline-offset-4 hover:text-signal-text">
            Retour au tableau de bord
          </Link>
        </p>
      </EmptyState>
    </>
  );
}
