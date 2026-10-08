/**
 * Maintenance mode: MAINTENANCE_MODE=1 in the server environment (Hostinger
 * variables), then restart. Visitors see /maintenance instead of the public
 * pages; the back office, payment notifications and tickets keep working.
 * Read at runtime, so no rebuild is needed to switch it.
 */
export function isMaintenance(): boolean {
  return ["1", "true", "on", "oui"].includes((process.env.MAINTENANCE_MODE ?? "").trim().toLowerCase());
}

/** Sections that stay reachable during maintenance (the section itself and everything under it). */
const OPEN_SECTIONS = ["/admin", "/api", "/maintenance", "/billet"];

export function isOpenDuringMaintenance(pathname: string): boolean {
  return OPEN_SECTIONS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
