"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/forms";
import { SITE_URL } from "@/config/site";
import { startOrder } from "@/server/checkout/orders";
import { checkoutSchema, parsePassList } from "@/server/checkout/schema";
import { createServiceClient } from "@/server/db/clients";
import { isCheckoutReady } from "@/server/payments/readiness";
import { allow, clientIp } from "@/server/rate-limit";

/** Field name in the form for each path of the schema. */
function fieldName(path: PropertyKey[]): string {
  const [a, b, c, d] = path.map(String);
  if (a === "buyer") return `buyer_${b}`;
  if (a === "team" && b === "teammates" && c !== undefined && d) return `m${Number(c) + 1}_${d}`;
  if (a === "team" && b) return b === "name" ? "team_name" : b;
  return a ?? "form";
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "");

/** What the buyer typed, sent back with errors so the form is not emptied. */
function typed(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  return values;
}

export async function startCheckout(_prev: FormState, formData: FormData): Promise<FormState> {
  // Each attempt holds places for 30 minutes: 10 attempts per 10 minutes per network.
  if (!allow(`checkout:${await clientIp()}`, 10, 600_000)) {
    return { error: "Trop de tentatives depuis votre connexion. Patientez quelques minutes avant de réessayer.", values: typed(formData) };
  }

  const passes = parsePassList(formData.get("passes"));
  if (!passes) return { error: "Sélection de pass invalide. Revenez à la billetterie pour choisir vos pass.", values: typed(formData) };

  // Fresh read, not the 5-minute cache: registrations may have just been closed.
  const { data: settings } = await createServiceClient().from("event_settings").select("registration_open").eq("id", 1).maybeSingle();
  if (!settings?.registration_open || !isCheckoutReady())
    return { error: "Les inscriptions en ligne ne sont pas ouvertes pour le moment.", values: typed(formData) };

  const person = (prefix: string) => ({
    first_name: text(formData, `${prefix}_first_name`),
    last_name: text(formData, `${prefix}_last_name`),
    email: text(formData, `${prefix}_email`),
    phone: text(formData, `${prefix}_phone`),
  });
  const hackathon = passes.includes("hackathon");

  const parsed = checkoutSchema.safeParse({
    passes,
    buyer: person("buyer"),
    consent: formData.get("consent") === "on",
    team: hackathon
      ? {
          name: text(formData, "team_name"),
          track_code: text(formData, "track_code"),
          teammates: formData.get("third_member") === "on" ? [person("m1"), person("m2")] : [person("m1")],
        }
      : null,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[fieldName(issue.path)] ??= issue.message;
    return { error: "Certains champs sont à corriger.", fieldErrors, values: typed(formData) };
  }

  const result = await startOrder(parsed.data, SITE_URL);
  if (!result.ok) return { error: result.error, values: typed(formData) };
  redirect(result.checkoutUrl);
}
