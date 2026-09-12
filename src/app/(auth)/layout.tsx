import Link from "next/link";
import { HeartMark } from "@/components/ui/heart-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="flex items-center gap-2.5 font-serif text-[20px] font-semibold text-text">
        <span className="block w-6 h-6 shrink-0">
          <HeartMark />
        </span>
        Un Detalle
      </Link>
      <div className="mt-10 w-full max-w-[400px]">{children}</div>
    </div>
  );
}
