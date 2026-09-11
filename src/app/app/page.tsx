"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/lib/mock/auth";
import { listPagesForUser } from "@/lib/mock/pages";
import { Container, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOccasion, getTheme } from "@/lib/domain";

export default function DashboardPage() {
  const user = useSession();
  // AppLayout only renders this page client-side once a real session exists, so this
  // localStorage read never runs during SSR.
  const pages = useMemo(
    () => (user && user !== "loading" ? listPagesForUser(user.id) : null),
    [user],
  );

  if (!pages) return null;

  return (
    <Container className="py-12">
      <Eyebrow>Mis páginas</Eyebrow>
      <h1 className="mt-2 text-[28px]">
        {pages.length === 0 ? "Todavía no creaste ninguna" : `${pages.length} página${pages.length === 1 ? "" : "s"}`}
      </h1>

      {pages.length === 0 ? (
        <div className="mt-10 rounded-[18px] border border-dashed border-line-strong p-10 text-center">
          <p className="text-[15px] text-text-soft">
            Cuando publiques una página estando conectado, va a aparecer acá para que puedas
            volver a verla, copiar el link o editarla.
          </p>
          <Button href="/crear" className="mt-5">
            Crear mi primera página
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((page) => {
            const occasion = getOccasion(page.payload.occasion);
            const theme = getTheme(page.payload.theme);
            return (
              <Link
                key={page.id}
                href={`/app/paginas/${page.id}`}
                className="block rounded-[16px] border border-line bg-surface p-5 transition-colors hover:border-line-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[20px]">{occasion.emoji}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-faint">
                    {theme.label}
                  </span>
                </div>
                <h3 className="mt-3 text-[17px] text-text">
                  {page.payload.title || occasion.defaultTitle}
                </h3>
                <p className="mt-1 text-[13px] text-text-faint">
                  Para {page.payload.to || "alguien"} · {occasion.label}
                </p>
                <div className="mt-4 flex items-center justify-between text-[12px] text-text-faint">
                  <span>{new Date(page.createdAt).toLocaleDateString("es-AR")}</span>
                  <span>{page.viewCount} vistas</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
