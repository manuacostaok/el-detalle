"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/mock/auth";
import { SealMark } from "@/components/ui/seal-mark";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/app", label: "Mis detalles" },
  { href: "/app/cuenta", label: "Cuenta" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [user, router, pathname]);

  if (user === "loading" || user === null) {
    return <div className="min-h-screen bg-ground" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-line">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-[19px] font-semibold text-text">
            <span className="block w-[22px] h-[22px] shrink-0">
              <SealMark />
            </span>
            El Detalle
          </Link>
          <div className="flex flex-1 items-center justify-between gap-4 sm:flex-none">
            <nav className="flex items-center gap-5 text-[13.5px] sm:text-[14px] text-text-soft">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={pathname === item.href ? "text-text font-semibold" : "hover:text-text transition-colors"}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 sm:gap-3 sm:ml-3">
              <Button href="/crear" size="sm" className="whitespace-nowrap">
                <span className="hidden sm:inline">+ Nuevo detalle</span>
                <span className="sm:hidden">+ Nuevo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Salir
              </Button>
            </div>
          </div>
        </Container>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
