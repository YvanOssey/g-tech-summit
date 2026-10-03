/**
 * Honest placeholder for information that is not confirmed yet.
 * Used instead of inventing a venue, a speaker, a time slot, a quota…
 */
interface PendingProps {
  /** What is missing, e.g. "Lieu", "Intervenants". Read by screen readers. */
  label?: string;
  /** Visible wording. */
  children?: string;
  tone?: "light" | "dark";
  variant?: "inline" | "block";
}

export function Pending({ label, children = "À annoncer", tone = "light", variant = "inline" }: PendingProps) {
  const color = tone === "light" ? "text-grey-500 border-grey-500/50" : "text-grey-400 border-grey-400/50";

  if (variant === "block") {
    return (
      <div
        className={`flex min-h-24 items-center justify-center border border-dashed px-4 py-6 text-center ${color}`}
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
    <span className={`type-meta inline-flex items-center gap-2 border-b border-dashed pb-0.5 ${color}`}>
      {label && <span className="sr-only">{label} : </span>}
      {children}
    </span>
  );
}
