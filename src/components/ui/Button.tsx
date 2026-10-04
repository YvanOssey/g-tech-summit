import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";

/**
 * Two kinds of action, nothing more:
 * - `primary` — the pill. One per screen.
 * - `link`    — every secondary action: an underlined text link, optionally with an arrow.
 * Colours come from the surrounding section theme (see .btn-primary / .link-arrow in globals.css).
 */
type Variant = "primary" | "link";

interface StyleProps {
  variant?: Variant;
  className?: string;
}

interface BaseProps extends StyleProps {
  arrow?: boolean;
  children: ReactNode;
}

const base =
  "group inline-flex items-center gap-3 font-sans font-semibold leading-none whitespace-nowrap " +
  "transition-[background-color,color,text-decoration-color] duration-(--duration-micro) ease-out-quart " +
  "disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "btn-primary min-h-12 justify-center px-6",
  link: "link-arrow min-h-11",
};

function classes({ variant = "primary", className }: StyleProps) {
  return [base, variants[variant], className].filter(Boolean).join(" ");
}

function Content({ children, arrow }: Pick<BaseProps, "children" | "arrow">) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="size-4 shrink-0 transition-transform duration-(--duration-micro) ease-out-quart group-hover:translate-x-1" />
      )}
    </>
  );
}

type LinkProps = BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({ href, variant, className, arrow, children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={classes({ variant, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

type NativeButtonProps = BaseProps & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant, className, arrow, children, type = "button", ...rest }: NativeButtonProps) {
  return (
    <button type={type} className={classes({ variant, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
