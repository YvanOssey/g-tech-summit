"use client";

import { useActionState, useState, useTransition } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/admin/forms";
import { confirmMfaEnrollment, startMfaEnrollment, type Enrollment } from "./actions";

/** Turning two-factor authentication on: QR code, then the first code. */
export function MfaSetup() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [starting, startTransition] = useTransition();
  const [state, action] = useActionState(confirmMfaEnrollment, null);

  if (!enrollment || "error" in enrollment) {
    return (
      <div>
        {enrollment && "error" in enrollment && <p className="mb-3 text-small font-medium text-[#7a1a12]">{enrollment.error}</p>}
        <button
          type="button"
          disabled={starting}
          onClick={() => startTransition(async () => setEnrollment(await startMfaEnrollment()))}
          className="min-h-11 rounded-input bg-ink px-5 font-semibold text-paper hover:bg-ink/85 disabled:opacity-60"
        >
          {starting ? "Préparation…" : "Activer la double authentification"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ol className="list-decimal space-y-1 pl-5 text-small">
        <li>Installez une application d’authentification : Google Authenticator, Microsoft Authenticator…</li>
        <li>Dans l’application, ajoutez un compte en scannant ce QR code.</li>
        <li>Saisissez ci-dessous le code à 6 chiffres qu’elle affiche.</li>
      </ol>
      <div className="flex flex-wrap items-center gap-6">
        {/* Supabase returns the QR code as an SVG data URL. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={enrollment.qr} alt="QR code à scanner avec l’application d’authentification" width={176} height={176} className="border border-ink/10 bg-paper p-2" />
        <p className="max-w-xs text-small text-grey">
          Impossible de scanner ? Saisissez cette clé dans l’application :{" "}
          <span className="font-mono break-all text-ink select-all">{enrollment.secret}</span>
        </p>
      </div>
      <form action={action} className="max-w-xs space-y-4" noValidate>
        <input type="hidden" name="factor_id" value={enrollment.factorId} />
        <Field label="Code à 6 chiffres" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required error={state?.fieldErrors?.code} />
        <FormMessage state={state} />
        <SubmitButton pendingLabel="Vérification…">Confirmer et activer</SubmitButton>
      </form>
    </div>
  );
}
