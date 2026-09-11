import clsx from "clsx";
import { type ReactNode } from "react";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto max-w-[1120px] px-6 sm:px-7", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-[640px]", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-2.5 text-[clamp(26px,3.4vw,36px)]">{title}</h2>
      {description && (
        <p className="mt-3.5 text-[15.5px] text-text-soft">{description}</p>
      )}
    </div>
  );
}
