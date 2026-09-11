import Link from "next/link";
import { HeartMark } from "@/components/ui/heart-mark";
import { Container } from "@/components/ui/container";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/paginas", label: "Páginas" },
  { href: "/admin/usuarios", label: "Usuarios" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-line bg-surface/40">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-[18px] font-semibold text-text">
            <span className="block w-5 h-5 shrink-0">
              <HeartMark />
            </span>
            Soulmates <span className="font-mono text-[11px] text-text-faint">/admin</span>
          </Link>
          <nav className="flex items-center gap-5 sm:gap-6 text-[13.5px] text-text-soft">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-text transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      <div className="border-b border-line bg-gold/[0.06]">
        <Container className="py-2.5 text-[12px] text-gold-soft">
          Datos de ejemplo — no hay usuarios reales todavía (ver BACKEND.md).
        </Container>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
