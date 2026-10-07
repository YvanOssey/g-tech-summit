import { Notice } from "@/components/admin/ui";

const OK: Record<string, string> = {
  verifie: "Paiement revérifié auprès de Genius Pay.",
  rembourse: "Remboursement effectué : commande remboursée, billets annulés.",
  "billet-annule": "Billet annulé : il n’ouvre plus les portes.",
  "nouveau-lien": "Nouveau lien de billet créé : l’ancien lien et l’ancien QR code ne fonctionnent plus.",
  capitaine: "Capitaine désigné.",
  "1": "Informations enregistrées.",
};

const ERR: Record<string, string> = {
  genius: "Genius Pay n’a pas répondu ou a refusé l’opération. Réessayez dans un instant.",
  "non-remboursable": "Cette commande ne peut pas être remboursée (paiement non réussi ou déjà remboursé).",
  motif: "Indiquez le motif du remboursement (3 caractères minimum).",
  enregistrement: "La modification n’a pas pu être enregistrée.",
};

/** Result of the order / ticket actions, read from ?ok= or ?erreur=. */
export function ActionNotices({ params }: { params: Record<string, string | string[] | undefined> }) {
  const ok = typeof params.ok === "string" ? OK[params.ok] : undefined;
  const err = typeof params.erreur === "string" ? ERR[params.erreur] : undefined;
  return (
    <>
      {ok && <Notice>{ok}</Notice>}
      {err && <Notice tone="error">{err}</Notice>}
    </>
  );
}
