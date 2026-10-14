import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
    </svg>
  );
}

/** The orange signal square — bullet, status marker and active indicator across the identity. */
export function SignalSquare({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 bg-signal ${className}`} />;
}

/* Line icons for practical information (24 grid, 1.5 stroke, square caps). */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "square", strokeLinejoin: "miter" } as const;

export function MapPin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle {...line} cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...line} cx="12" cy="12" r="8.5" />
      <path {...line} d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function TicketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M3.5 7h17v3a2 2 0 0 0 0 4v3h-17v-3a2 2 0 0 0 0-4V7Z" />
      <path {...line} d="M14.5 7v10" strokeDasharray="1.5 2" />
    </svg>
  );
}

export function Wallet(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M4 7h15v12H4zM4 7l11-3v3" />
      <path {...line} d="M15 12.5h4" />
    </svg>
  );
}

export function ChatBubble(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M4 5h16v11H9l-5 4V5Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M3.5 6h17v12h-17zM3.5 6l8.5 7 8.5-7" />
    </svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M6 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5v3A2 2 0 0 1 18.5 20 15 15 0 0 1 4 5.5 2 2 0 0 1 6 3.5Z" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle {...line} cx="10.5" cy="10.5" r="6.5" />
      <path {...line} d="M15.5 15.5 20 20" />
    </svg>
  );
}

/** Cup with handles — first prize. */
export function Trophy(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path {...line} d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
      <path {...line} d="M12 14v4M9.5 18h5M8 20.5h8" />
    </svg>
  );
}

/** Medal on its ribbon — second prize. */
export function Medal(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M6.5 3.5H10l2 4.5 2-4.5h3.5L15 9.9M9 9.9 6.5 3.5" />
      <circle {...line} cx="12" cy="15" r="5.5" />
      <circle {...line} cx="12" cy="15" r="2.5" />
    </svg>
  );
}

/** Padlock — content that is not unlocked yet. */
export function Lock(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path {...line} d="M5.5 11h13v9h-13Z" />
      <path {...line} d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
      <path {...line} d="M12 14.5V17" />
    </svg>
  );
}