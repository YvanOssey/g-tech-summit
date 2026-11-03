"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/forms";
import { HOLD_MINUTES, TEAM_SIZE, orderTotal } from "@/config/passes";
import { SITE_URL } from "@/config/site";
import { startOrder } from "@/server/checkout/orders";
import { checkoutSchema, parsePassList } from "@/server/checkout/schema";
import { createServiceClient } from "@/server/db/clients";
import { isCheckoutReady } from "@/server/payments/readiness";
import { verifyCaptcha } from "@/server/captcha";
import { allow, clientIp } from "@/server/rate-limit";
import { EVENT_SETTINGS_TAG } from "@/server/cache-tags";

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
  // Form submissions: 10 per 10 minutes per network.
  const ip = await clientIp();
  if (!allow(`checkout:${ip}`, 10, 600_000)) {
    return { error: "Trop de tentatives depuis votre connexion. Patientez quelques minutes avant de réessayer.", values: typed(formData) };
  }

  // Anti-robot check (Cloudflare Turnstile), before anything touches the database.
  if (!(await verifyCaptcha(formData.get("cf-turnstile-response"), ip))) {
    return { error: "La vérification anti-robot a échoué. Patientez un instant puis cliquez de nouveau sur « Payer ».", values: typed(formData) };
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
    team: hackathon
      ? {
          name: text(formData, "team_name"),
          track_code: text(formData, "track_code"),
          teammates: Array.from({ length: TEAM_SIZE - 1 }, (_, i) => person(`m${i + 1}`)),
        }
      : null,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[fieldName(issue.path)] ??= issue.message;
    return { error: "Certains champs sont à corriger.", fieldErrors, values: typed(formData) };
  }

  // Each order holds places for HOLD_MINUTES: at most 3 orders per network in that time.
  if (!allow(`hold:${ip}`, 3, HOLD_MINUTES * 60_000)) {
    return { error: "Plusieurs commandes sont déjà en attente de paiement depuis votre connexion. Finalisez-les ou patientez quelques minutes.", values: typed(formData) };
  }

  const result = await startOrder(parsed.data, SITE_URL);
  if (!result.ok) return { error: result.error, values: typed(formData) };
  // Free place: already counted, the gauges move now.
  if (orderTotal(parsed.data.passes) === 0) revalidateTag(EVENT_SETTINGS_TAG, "max");
  redirect(result.checkoutUrl);
}
