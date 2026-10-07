import type { AdminRole } from "@/server/db/types";

export interface AdminNavItem {
  href: string;
  label: string;
  /** Minimum role to see the item. Pages check it again with requireAdmin(). */
  role?: AdminRole;
}

export interface AdminNavGroup {
  label: string | null;
  items: readonly AdminNavItem[];
}

/** Back office navigation, by job rather than by table. */
export const ADMIN_NAV: readonly AdminNavGroup[] = [
  { label: null, items: [{ href: "/admin", label: "Tableau de bord" }] },
  {
    label: "Inscriptions",
    items: [
      { href: "/admin/participants", label: "Participants" },
      { href: "/admin/commandes", label: "Commandes & billets" },
      { href: "/admin/paiements", label: "Paiements" },
      { href: "/admin/equipes", label: "Équipes hackathon" },
    ],
  },
  {
    label: "Événement",
    items: [
      { href: "/admin/programme", label: "Programme" },
      { href: "/admin/hackathon", label: "Hackathon" },
      { href: "/admin/partenaires", label: "Partenaires" },
    ],
  },
  { label: "Contenu", items: [{ href: "/admin/faq", label: "FAQ" }] },
  {
    label: "Système",
    items: [
      { href: "/admin/parametres", label: "Paramètres", role: "SUPER_ADMIN" },
      { href: "/admin/administrateurs", label: "Administrateurs", role: "SUPER_ADMIN" },
      { href: "/admin/journal", label: "Journal d’activité", role: "SUPER_ADMIN" },
    ],
  },
];

/** The item whose section contains `pathname` (longest match wins). */
export function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}
