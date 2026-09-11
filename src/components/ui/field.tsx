import { type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

const inputClasses =
  "w-full bg-ground border border-line-strong text-text rounded-[11px] px-3.5 py-3 text-[14.5px] outline-none transition-colors focus:border-accent";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-[18px] first:mt-0">
      <label className="block text-[12.5px] font-semibold text-text-soft mb-2 tracking-[0.02em]">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-text-faint">{hint}</p>}
      {error && <p className="mt-1.5 text-[12px] text-error">{error}</p>}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(inputClasses, props.className)} />;
}
