"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPage, deletePage } from "@/lib/mock/pages";
import { Container, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { GiftCard } from "@/components/gift/gift-card";
import { QrCode } from "@/components/ui/qr-code";
import { encodePayload } from "@/lib/payload";

export default function PageDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  // AppLayout only renders this page client-side once a real session exists, so
  // `window` and this localStorage read are always available here.
  const page = useMemo(() => getPage(params.id), [params.id]);
  const link = useMemo(
    () => (page ? `${window.location.origin}/r/${encodePayload(page.payload)}` : ""),
    [page],
  );

  if (page === null) {
    return (
      <Container className="py-16 text-center">
        <p className="text-text-soft">No encontramos esa página.</p>
        <Link href="/app" className="mt-3 inline-block underline underline-offset-4">
          Volver a mis detalles
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <Eyebrow>{page.payload.plan === "premium" ? "Edición Especial" : "Clásico"}</Eyebrow>
        <h1 className="mt-2 text-[26px]">{page.payload.title || "Tu página"}</h1>
        <p className="mt-1 text-[14px] text-text-faint">
          Creada el {new Date(page.createdAt).toLocaleDateString("es-AR")} · {page.viewCount} vistas
        </p>
        <div className="mt-7 max-w-[460px]">
          <GiftCard payload={page.payload} live />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="rounded-[16px] border border-line bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text-soft">Compartir</h3>
          <div className="mt-4 flex justify-center rounded-[12px] bg-white p-4">
            <QrCode value={link} size={140} />
          </div>
          <div className="mt-3 truncate rounded-lg border border-line-strong bg-ground px-3 py-2 font-mono text-[11.5px] text-text-faint">
            {link}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" href={link} target="_blank">
              Ver la página
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard?.writeText(link).catch(() => {})}
            >
              Copiar link
            </Button>
          </div>
        </div>

        <div className="rounded-[16px] border border-line bg-surface p-5">
          <h3 className="text-[14px] font-semibold text-text-soft">Gestionar</h3>
          <p className="mt-2 text-[12.5px] text-text-faint">
            Editar reabre el wizard con estos mismos datos.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Button size="sm" variant="ghost" href={`/app/paginas/${page.id}/editar`}>
              Editar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-error border-error/30"
              onClick={() => {
                if (confirm("¿Eliminar esta página? Esta acción no se puede deshacer.")) {
                  deletePage(page.id);
                  router.push("/app");
                }
              }}
            >
              Eliminar página
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
