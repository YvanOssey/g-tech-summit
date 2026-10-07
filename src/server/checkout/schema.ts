import { z } from "zod";
import { EXCLUSIVE, PASS_ORDER, type PassId } from "@/config/passes";
import { TRACKS } from "@/content/hackathon";

/** Passes from "?pass=event,hackathon": known ids, no duplicate, exclusivity respected. */
export function parsePassList(value: unknown): PassId[] | null {
  if (typeof value !== "string") return null;
  const ids = [...new Set(value.split(",").map((v) => v.trim()))];
  if (ids.length === 0 || !ids.every((id) => (PASS_ORDER as readonly string[]).includes(id))) return null;
  const passes = PASS_ORDER.filter((id) => ids.includes(id));
  if (EXCLUSIVE.some((group) => group.filter((id) => passes.includes(id)).length > 1)) return null;
  return passes;
}

const name = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} obligatoire.`)
    .max(60, "60 caractères maximum.")
    .regex(/^[\p{L}][\p{L}\p{M}' .-]*$/u, `${label} : lettres, espaces, apostrophes et tirets uniquement.`);

const email = z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(254);

/** Ivorian numbers (10 digits, optional +225) or international numbers (+ and 8 to 15 digits). */
const phone = z
  .string()
  .transform((v) => v.replace(/[\s.-]/g, ""))
  .refine((v) => /^(\+225)?\d{10}$/.test(v) || /^\+\d{8,15}$/.test(v), "Numéro invalide : 10 chiffres, ou format international (+…).");

const person = z.object({ first_name: name("Prénom"), last_name: name("Nom"), email, phone });

/** Teammates: the phone number is optional (organisers' choice, 2026-10-07). */
const teammate = z.object({
  first_name: name("Prénom"),
  last_name: name("Nom"),
  email,
  phone: z.union([z.literal("").transform(() => null), phone]),
});

export const checkoutSchema = z
  .object({
    passes: z.array(z.enum(PASS_ORDER as unknown as [PassId, ...PassId[]])).min(1),
    buyer: person,
    consent: z.literal(true, "Acceptez les conditions de vente et la politique de confidentialité pour continuer."),
    team: z
      .object({
        name: z.string().trim().min(2, "Nom d’équipe trop court.").max(60, "60 caractères maximum."),
        track_code: z.enum(TRACKS.map((t) => t.code) as [string, ...string[]], "Choisissez une thématique."),
        /** The buyer is always a member: 1 or 2 teammates make a team of 2 or 3. No captain is asked online. */
        teammates: z.array(teammate).min(1, "Ajoutez au moins un coéquipier.").max(2, "Deux coéquipiers au maximum."),
      })
      .nullable(),
  })
  .superRefine((v, ctx) => {
    const hackathon = v.passes.includes("hackathon");
    if (hackathon && !v.team) ctx.addIssue({ code: "custom", path: ["team"], message: "Renseignez votre équipe." });
    if (!v.team) return;
    const emails = [v.buyer.email, ...v.team.teammates.map((t) => t.email)];
    if (new Set(emails).size !== emails.length)
      ctx.addIssue({ code: "custom", path: ["team", "teammates"], message: "Chaque membre doit avoir sa propre adresse e-mail." });
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
