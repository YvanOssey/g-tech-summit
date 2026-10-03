import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/layout/LegalPlaceholder";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalNoticePage() {
  return (
    <LegalPlaceholder
      title="Mentions légales"
      covers={["L’éditeur du site et ses coordonnées", "Le responsable de la publication", "L’hébergeur du site", "La propriété intellectuelle"]}
    />
  );
}
