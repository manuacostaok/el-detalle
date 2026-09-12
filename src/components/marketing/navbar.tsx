"use client";

import Link from "next/link";
import { useSession } from "@/lib/mock/auth";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeartMark } from "@/components/ui/heart-mark";

const LINKS = [
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/ejemplos", label: "Ejemplos" },
  { href: "/precios", label: "Precio" },
];

export function Navbar() {
  const user = useSession();

  return (
    <div className="border-b border-line">
      <Container className="flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-[21px] font-semibold text-text">
          <span className="block w-[25px] h-[25px] shrink-0">
            <HeartMark />
          </span>
          Un Detalle
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[14px] text-text-soft">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 xs:gap-3">
          {user && user !== "loading" ? (
            <Button href="/app" variant="ghost" size="sm" className="hidden xs:inline-flex">
              Mis páginas
            </Button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline text-[14px] text-text-soft transition-colors hover:text-text"
            >
              Iniciar sesión
            </Link>
          )}
          <Button href="/crear" size="sm" className="whitespace-nowrap">
            <span className="hidden xs:inline">Crear mi página</span>
            <span className="xs:hidden">Crear</span>
          </Button>
        </div>
      </Container>
    </div>
  );
}
