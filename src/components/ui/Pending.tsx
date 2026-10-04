/**
 * Honest placeholder for information that is not confirmed yet.
 * Used instead of inventing a venue, a speaker, a time slot, a quota…
 * Colours follow the section theme.
 */
interface PendingProps {
  /** What is missing, e.g. "Lieu", "Intervenants". Read by screen readers. */
  label?: string;
  /** Visible wording. */
  children?: string;
  variant?: "inline" | "block";
}

export function Pending({ label, children = "À annoncer", variant = "inline" }: PendingProps) {
  if (variant === "block") {
    return (
      <div
        className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-muted/60 px-4 py-6 text-center text-muted"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 9px, color-mix(in srgb, currentColor 9%, transparent) 9px 10px)",
        }}
      >
        <span className="type-meta">
          {label && <span className="sr-only">{label} : </span>}
          {children}
        </span>
      </div>
    );
  }

  return (
    <span className="type-meta inline-flex items-center gap-2 border-b border-dashed border-muted/60 pb-0.5 text-muted">
      {label && <span className="sr-only">{label} : </span>}
      {children}
    </span>
  );
}
