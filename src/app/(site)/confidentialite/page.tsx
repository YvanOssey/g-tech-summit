import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/layout/LegalPlaceholder";

export const metadata: Metadata = { title: "Confidentialité" };

export default function PrivacyPage() {
  return (
    <LegalPlaceholder
      title="Politique de confidentialité"
      covers={[
        "Les données collectées lors de l’inscription",
        "Leur utilisation : billet, contrôle d’accès, communication liée à l’événement",
        "Leur durée de conservation",
        "Vos droits et comment les exercer",
      ]}
    />
  );
}
