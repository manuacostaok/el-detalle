"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartMark } from "@/components/ui/heart-mark";
import { QrCode } from "@/components/ui/qr-code";
import { Eyebrow } from "@/components/ui/container";

export function ShareScreen({
  link,
  b64Length,
  saved,
  onCreateAnother,
}: {
  link: string;
  b64Length: number;
  saved: boolean;
  onCreateAnother: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const qrWrapRef = useRef<HTMLDivElement>(null);
  const heavy = b64Length > 1400;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard API no disponible — el input sigue siendo seleccionable a mano */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "soulmates-qr.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
      <div className="mx-auto w-[34px] h-[34px]">
        <HeartMark animate />
      </div>
      <Eyebrow className="mt-4">Publicada</Eyebrow>
      <h2 className="mt-2 text-[26px]">Tu página ya existe.</h2>
      <p className="mt-2 text-[14.5px] text-text-soft">
        Compartí el link o descargá el código QR. No hace falta que nadie inicie sesión para
        verla.
      </p>

      <div
        ref={qrWrapRef}
        className="mx-auto mt-7 mb-2 inline-block rounded-[18px] bg-white p-[18px] shadow-card"
      >
        <QrCode value={link} size={220} />
      </div>

      {heavy && (
        <div className="mt-3.5 rounded-[10px] border border-gold/30 bg-gold/10 px-3.5 py-2.5 text-[12.5px] text-gold-soft">
          ⚠️ Con la foto incluida, el link es largo y el QR queda muy denso — puede costarle a
          algunos celulares escanearlo. Si falla, compartí el link directo.
        </div>
      )}

      <div className="mt-[22px] flex items-center gap-2 rounded-xl border border-line-strong bg-surface py-1.5 pl-4 pr-1.5">
        <input
          readOnly
          value={link}
          className="flex-1 bg-transparent text-[12.5px] font-mono text-text-soft outline-none"
          onFocus={(e) => e.currentTarget.select()}
        />
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? "¡Copiado!" : "Copiar"}
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button onClick={handleDownload}>Descargar QR</Button>
        <Button href={link} variant="ghost" target="_blank">
          Ver la página →
        </Button>
      </div>

      {saved && (
        <p className="mt-4 text-[12.5px] text-text-faint">
          Se guardó en <Link href="/app" className="underline underline-offset-4">tu cuenta</Link>.
        </p>
      )}

      <div className="mt-8">
        <button type="button" onClick={onCreateAnother} className="text-[14px] text-text-soft underline underline-offset-4 hover:text-text">
          Crear otra página
        </button>
      </div>
    </div>
  );
}
