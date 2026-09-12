"use client";

import { useState } from "react";
import { SealMark } from "@/components/ui/seal-mark";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function FutureLetter({
  unlockDate,
  message,
}: {
  unlockDate: string;
  message: string;
}) {
  const remaining = daysUntil(unlockDate);
  const unlocked = remaining <= 0;
  const [opened, setOpened] = useState(false);

  return (
    <div className="rounded-[22px] border border-dashed border-gold/40 bg-gold/[0.06] p-7 text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft">
        06 · Lo que todavía no pasó
      </div>
      {!unlocked ? (
        <>
          <div className="mx-auto mt-4 w-[38px] h-[38px] opacity-90">
            <SealMark className="w-full h-full" />
          </div>
          <p className="mt-3 text-[15px] text-text">
            Hay una carta más, sellada, guardada para el{" "}
            {new Date(unlockDate + "T00:00:00").toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </p>
          <p className="mt-1.5 text-[13px] text-text-faint">
            Faltan {remaining} día{remaining === 1 ? "" : "s"} para poder abrirla.
          </p>
        </>
      ) : opened ? (
        <p className="mt-3 text-[15px] leading-[1.7] text-text whitespace-pre-wrap text-left">
          {message}
        </p>
      ) : (
        <>
          <p className="mt-3 text-[15px] text-text">Esta carta ya está lista para abrirse.</p>
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="mt-4 rounded-full bg-gold px-5 py-2.5 text-[13.5px] font-semibold text-ink"
          >
            💌 Abrir la carta guardada
          </button>
        </>
      )}
    </div>
  );
}
