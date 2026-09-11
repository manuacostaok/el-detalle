import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Pick({
  active,
  disabled,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "rounded-[14px] border-[1.5px] border-line-strong bg-ground px-2.5 py-4 text-center transition-colors",
        active && "border-accent bg-accent/10",
        disabled && "opacity-55",
        className,
      )}
      {...props}
    />
  );
}
