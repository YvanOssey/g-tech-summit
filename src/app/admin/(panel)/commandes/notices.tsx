import { Notice } from "@/components/admin/ui";

const OK: Record<string, string> = {
  verifie: "Paiement revérifié auprès de Genius Pay.",
  rembourse: "Remboursement effectué : commande remboursée, billets annulés.",
  "billet-annule": "Billet annulé : il n’ouvre plus les portes.",
  "nouveau-lien": "Nouveau lien de billet créé : l’ancien lien et l’ancien QR code ne fonctionnent plus.",
  capitaine: "Capitaine désigné.",
  envoye: "Billet(s) renvoyé(s) par e-mail.",
  "1": "Informations enregistrées.",
};

const ERR: Record<string, string> = {
  genius: "Genius Pay n’a pas répondu ou a refusé l’opération. Réessayez dans un instant.",
  "non-remboursable": "Cette commande ne peut pas être remboursée (paiement non réussi ou déjà remboursé).",
  motif: "Indiquez le motif du remboursement (3 caractères minimum).",
  enregistrement: "La modification n’a pas pu être enregistrée.",
  smtp: "L’envoi d’e-mails n’est pas configuré sur ce serveur (variables SMTP_…).",
  email: "L’e-mail n’a pas pu être envoyé. Vérifiez l’adresse du participant et réessayez.",
  "rien-a-envoyer": "Rien à envoyer : la commande n’est pas payée ou ses billets sont annulés.",
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
