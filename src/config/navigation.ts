export interface NavItem {
  href: string;
  label: string;
}

export const MAIN_NAV: readonly NavItem[] = [
  { href: "/programme", label: "Programme" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/infos-pratiques", label: "Infos" },
  { href: "/partenaires", label: "Partenaires" },
];

export const TICKETING: NavItem = { href: "/billetterie", label: "Billetterie" };
