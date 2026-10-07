import type { AdminRole } from "@/server/db/types";

/** Higher number = more rights. A SUPER_ADMIN can do everything an ADMIN can. */
const RANK: Record<AdminRole, number> = { ADMIN: 1, SUPER_ADMIN: 2 };

export function hasRole(role: AdminRole, required: AdminRole): boolean {
  return RANK[role] >= RANK[required];
}

export const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
};
