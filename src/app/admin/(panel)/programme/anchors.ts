import { CONFERENCES, PANELS } from "@/content/programme";

/**
 * Detailed descriptions a slot can link to on /programme. They live in the
 * code (content/programme.ts), so a slot can only point to one that exists.
 */
export const PROGRAMME_ANCHORS: readonly { id: string; label: string }[] = [
  ...[...CONFERENCES, ...PANELS].map((t) => ({ id: t.id, label: t.title ? `${t.kind} — ${t.title}` : t.kind })),
  { id: "formations", label: "Formations express" },
  { id: "ateliers", label: "Ateliers pratiques" },
];
