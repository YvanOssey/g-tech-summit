interface SectionLabelProps {
  children: string;
  /** Optional index shown before the label, e.g. "02". */
  index?: string;
  className?: string;
}

/** Small tracked label that opens a section, led by a short orange rule. */
export function SectionLabel({ children, index, className = "" }: SectionLabelProps) {
  return (
    <p className={`type-label flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="h-px w-8 bg-mark" />
      {index && <span className="text-muted">{index}</span>}
      {children}
    </p>
  );
}
