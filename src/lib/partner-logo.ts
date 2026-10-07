/**
 * Where a partner logo is served from:
 * - "/partners/x.png" (leading slash) → a file shipped in /public;
 * - anything else → an object in the Supabase Storage bucket "partners".
 */
export const PARTNER_BUCKET = "partners";

export function isStoredLogo(path: string): boolean {
  return !path.startsWith("/");
}

export function partnerLogoUrl(path: string): string {
  if (!isStoredLogo(path)) return path;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${PARTNER_BUCKET}/${encodeURIComponent(path)}`;
}
