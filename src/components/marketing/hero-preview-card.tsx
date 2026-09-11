"use client";

import { useEffect, useState } from "react";
import { timeSince } from "@/lib/domain";
import { encodePayload } from "@/lib/payload";
import { QrCode } from "@/components/ui/qr-code";

const DEMO_PAYLOAD = {
  occasion: "pareja" as const,
  from: "Juan",
  to: "Cande",
  date: "2019-06-14",
  title: "Nuestra historia",
  message: "Desde que te conocí, cada día tiene algo mejor.",
  song: "",
  photo: "",
  theme: "romantico" as const,
  plan: "premium" as const,
};

export function HeroPreviewCard() {
  const [since, setSince] = useState(() => timeSince(DEMO_PAYLOAD.date));
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const id = setInterval(() => setSince(timeSince(DEMO_PAYLOAD.date)), 60000);
    return () => clearInterval(id);
  }, []);

  const link = `${origin}/r/${encodePayload(DEMO_PAYLOAD)}`;

  return (
    <div className="relative rotate-2 rounded-[24px] border border-white/60 bg-paper p-7 sm:p-8 shadow-card">
      <div className="pointer-events-none absolute inset-2.5 rounded-[16px] border border-dashed border-ink/[0.18]" />
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-paper">
        💞 Para Cande
      </span>
      <h3 className="mt-4 text-[24px] text-ink">Nuestra historia</h3>
      <p className="mt-2 text-[14px] leading-[1.55] text-ink-soft">
        Desde que te conocí, cada día tiene algo mejor. Esta es nuestra historia, para volver
        a leerla cuando quieras.
      </p>
      <div className="mt-[18px] flex gap-2.5">
        {[
          { label: "Años", value: since.years },
          { label: "Meses", value: since.months },
          { label: "Días", value: since.days },
        ].map((c) => (
          <div key={c.label} className="flex-1 rounded-xl bg-paper-2 px-1.5 py-2.5 text-center">
            <b className="block font-mono text-[20px] text-accent">{c.value}</b>
            <span className="text-[10px] uppercase tracking-[0.06em] text-ink-soft">
              {c.label}
            </span>
          </div>
        ))}
      </div>
      {origin && (
        <div className="absolute -bottom-5 -right-3.5 flex flex-col items-center gap-1 rounded-[14px] bg-white p-2.5 shadow-card">
          <QrCode value={link} size={56} />
          <span className="font-mono text-[9px] text-ink-soft">Escaneá</span>
        </div>
      )}
    </div>
  );
}
