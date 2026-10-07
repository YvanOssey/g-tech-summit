import type { ReactNode } from "react";

/** Title row of an admin page: a plain heading, a short line, the page actions. */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-5">
      <div>
        <h1 className="text-heading font-semibold leading-tight">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-small text-grey">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Honest empty state: says what is missing and why, never shows sample data. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-ink/20 bg-paper px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-small text-grey">{children}</div>}
    </div>
  );
}

type NoticeTone = "info" | "error";

export function Notice({ tone = "info", children }: { tone?: NoticeTone; children: ReactNode }) {
  return tone === "error" ? (
    <p role="alert" className="mb-6 border-l-2 border-[#b42318] bg-[#b42318]/8 px-3 py-2 text-small text-[#7a1a12]">
      {children}
    </p>
  ) : (
    <p role="status" className="mb-6 border-l-2 border-ink bg-stone px-3 py-2 text-small">
      {children}
    </p>
  );
}

/** Placeholder body for a section scheduled in a later phase. */
export function UpcomingSection({ phase, children }: { phase: number; children: ReactNode }) {
  return (
    <EmptyState title={`Cette section arrive à la phase ${phase}`}>
      <p>{children}</p>
    </EmptyState>
  );
}
