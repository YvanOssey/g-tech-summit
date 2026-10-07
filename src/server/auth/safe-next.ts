/**
 * Where to go after signing in. Only internal admin paths are accepted, so a
 * crafted link (?suite=https://evil.example or //evil.example) cannot send an
 * admin to another site.
 */
export function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) return "/admin";
  if (value.startsWith("/admin/login") || value.startsWith("/admin/callback")) return "/admin";
  return value;
}
