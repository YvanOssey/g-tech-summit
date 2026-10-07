"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

/** Result of an admin Server Action, shown under the form. */
export type FormState = { error?: string; fieldErrors?: Record<string, string>; message?: string } | null;

const input =
  "mt-1.5 block w-full rounded-input border border-ink/25 bg-paper px-3.5 py-2.5 text-ink " +
  "placeholder:text-grey focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-signal " +
  "aria-invalid:border-[#b42318]";

interface FieldProps extends ComponentProps<"input"> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function Field({ label, name, error, hint, id = name, ...props }: FieldProps) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-small font-semibold">
        {label}
      </label>
      <input id={id} name={name} className={input} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props} />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-small text-grey">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-small font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ children, pendingLabel }: { children: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-input bg-ink px-5 font-semibold text-paper transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Global form feedback; announced to screen readers. */
export function FormMessage({ state }: { state: FormState }) {
  return (
    <div aria-live="polite" className="empty:hidden">
      {state?.error && (
        <p role="alert" className="border-l-2 border-[#b42318] bg-[#b42318]/8 px-3 py-2 text-small text-[#7a1a12]">
          {state.error}
        </p>
      )}
      {state?.message && <p className="border-l-2 border-ink bg-stone px-3 py-2 text-small">{state.message}</p>}
    </div>
  );
}
