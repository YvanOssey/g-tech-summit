import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "tertiary";

interface StyleProps {
  variant?: Variant;
  className?: string;
}

interface BaseProps extends StyleProps {
  arrow?: boolean;
  children: ReactNode;
}

const base =
  "group inline-flex items-center justify-center gap-3 font-sans font-semibold leading-none " +
  "transition-[background-color,color,border-color,text-decoration-color] duration-(--duration-micro) ease-out-quart " +
  "disabled:pointer-events-none disabled:opacity-40";

// Colours come from the surrounding section theme (see .btn-* in globals.css).
const variants: Record<Variant, string> = {
  primary: "btn-primary min-h-12 rounded-full px-6",
  secondary: "btn-secondary min-h-12 rounded-full px-6",
  tertiary: "min-h-11 text-fg underline decoration-1 underline-offset-[6px] decoration-rule-strong hover:decoration-mark",
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
