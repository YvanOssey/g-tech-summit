import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/admin/ui";

/** 404 inside the back office: keeps the admin navigation instead of the public page. */
export default function AdminNotFound() {
  return (
    <>
      <PageHeader title="Page introuvable" />
      <EmptyState title="Cette page n’existe pas dans l’administration">
        <p>
          <Link href="/admin" className="font-medium text-ink underline underline-offset-4 hover:text-signal-text">
            Retour au tableau de bord
          </Link>
        </p>
      </EmptyState>
    </>
  );
}
