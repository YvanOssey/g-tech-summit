import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/layout/LegalPlaceholder";

export const metadata: Metadata = { title: "Conditions de vente" };

export default function SalesTermsPage() {
  return (
    <LegalPlaceholder
      title="Conditions de vente"
      covers={["Les pass et leurs prix", "Les modalités de paiement via Wave", "L’émission et l’utilisation des billets", "La politique d’annulation et de remboursement"]}
    />
  );
}
