import type { Metadata } from "next";
import { ResetRequestForm } from "./ResetRequestForm";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-heading font-semibold leading-tight">Mot de passe oublié</h1>
      <p className="mt-2 text-small text-grey">Vous recevrez un lien par e-mail pour choisir un nouveau mot de passe.</p>
      <div className="mt-6">
        <ResetRequestForm />
      </div>
    </>
  );
}
