import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "secondary" | "tertiary";
type Tone = "light" | "dark";

interface StyleProps {
  variant?: Variant;
  /** Background the button sits on. */
  tone?: Tone;
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

const variants: Record<Variant, Record<Tone, string>> = {
  primary: {
    light: "min-h-12 px-6 bg-signal text-ink hover:bg-ink hover:text-signal",
    dark: "min-h-12 px-6 bg-signal text-ink hover:bg-paper hover:text-ink",
  },
  secondary: {
    light: "min-h-12 px-6 border border-ink text-ink hover:bg-ink hover:text-paper",
    dark: "min-h-12 px-6 border border-paper/60 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  },
  tertiary: {
    light:
      "min-h-11 text-ink underline decoration-1 underline-offset-[6px] decoration-ink/30 hover:decoration-signal",
    dark: "min-h-11 text-paper underline decoration-1 underline-offset-[6px] decoration-paper/30 hover:decoration-signal",
  },
};

function classes({ variant = "primary", tone = "light", className }: StyleProps) {
  return [base, variants[variant][tone], className].filter(Boolean).join(" ");
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

export function ButtonLink({ href, variant, tone, className, arrow, children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={classes({ variant, tone, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}

type NativeButtonProps = BaseProps & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant, tone, className, arrow, children, type = "button", ...rest }: NativeButtonProps) {
  return (
    <button type={type} className={classes({ variant, tone, className })} {...rest}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}
