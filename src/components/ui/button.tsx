import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "ghost" | "gold" | "link";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[transform,background-color,border-color,opacity] duration-150 active:scale-[.97] disabled:opacity-45 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  ghost:
    "bg-transparent text-text border border-line-strong hover:border-text-soft",
  gold: "bg-gold text-ink hover:bg-gold-soft",
  link: "bg-transparent text-text-soft underline underline-offset-4 hover:text-text px-0 py-0 rounded-none",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[13px]",
  md: "px-6 py-3.5 text-[14.5px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  block?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, block } =
    props;
  const classes = clsx(
    base,
    variant !== "link" && sizes[size],
    variants[variant],
    block && "w-full",
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes} target={props.target} rel={props.rel}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping non-DOM props before spreading the rest
  const { href: _href, variant: _v, size: _s, block: _b, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
