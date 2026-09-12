"use client";

import { useEffect, useState } from "react";
import { getOccasion, timeSince, type GiftPagePayload } from "@/lib/domain";
import { GIFT_THEME_STYLES } from "@/lib/gift-theme-styles";

export function GiftCard({
  payload,
  compact = false,
  live = false,
  className,
}: {
  payload: GiftPagePayload;
  compact?: boolean;
  live?: boolean;
  className?: string;
}) {
  const style = GIFT_THEME_STYLES[payload.theme];
  const occasion = getOccasion(payload.occasion);
  const [opened, setOpened] = useState(compact);
  const [since, setSince] = useState(() => timeSince(payload.date));

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setSince(timeSince(payload.date)), 1000);
    return () => clearInterval(id);
  }, [live, payload.date]);

  const title = payload.title || occasion.defaultTitle;
  const message = payload.message || occasion.placeholder;

  return (
    <div
      className={`relative w-full rounded-[26px] p-8 sm:p-10 shadow-lift ${className ?? ""}`}
      style={{
        background: style.background,
        color: style.color,
        border: style.cardBorder,
        borderRadius: style.borderRadius,
      }}
    >
      <div
        className="font-mono text-[11.5px] uppercase tracking-[0.12em] opacity-65"
        style={{ color: style.eyebrowColor }}
      >
        {occasion.emoji} Para {payload.to || "vos"}
      </div>
      <h1 className="font-serif mt-3.5 text-[26px] sm:text-[30px] leading-[1.15]">{title}</h1>

      <div className="mt-[18px] grid grid-cols-4 gap-2">
        {[
          { label: "Años", value: since.years },
          { label: "Meses", value: since.months },
          { label: "Días", value: since.days },
          { label: "Segundos", value: since.secs },
        ].map((cell) => (
          <div
            key={cell.label}
            className="rounded-[10px] py-2.5 px-0.5 text-center"
            style={{ background: style.counterBg, border: style.counterBorder }}
          >
            <b className="block font-mono text-[19px]" suppressHydrationWarning={cell.label === "Segundos"}>
              {cell.value}
            </b>
            <span className="text-[9.5px] uppercase tracking-[0.05em] opacity-70">
              {cell.label}
            </span>
          </div>
        ))}
      </div>

      {payload.photo && (
        <div className="mt-5 rounded-[14px] overflow-hidden">
          {/* dataURL embebida en el payload mismo — ver BACKEND.md */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={payload.photo}
            alt=""
            className="w-full h-[220px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div
        className="mt-4 rounded-[14px] border border-dashed p-[18px] text-center opacity-90"
        style={{ borderColor: "currentColor" }}
      >
        {opened ? (
          <p className="text-[15px] leading-[1.7] whitespace-pre-wrap text-left">{message}</p>
        ) : (
          <button
            type="button"
            onClick={() => setOpened(true)}
            className="font-semibold underline underline-offset-4"
            style={{ color: "inherit" }}
          >
            💌 Abrir el mensaje
          </button>
        )}
      </div>

      {payload.song && (
        <div className="mt-5">
          <a
            href={payload.song}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px]"
            style={{ borderColor: "currentColor", color: style.accent }}
          >
            🎵 Escuchar nuestra canción
          </a>
        </div>
      )}

      <div className="mt-[26px] flex items-center justify-between text-[11px] opacity-60">
        <span>De {payload.from || "alguien"}</span>
        {payload.plan === "free" ? (
          <span className="font-semibold" style={{ color: style.accent }}>
            Hecho con Un Detalle 💞
          </span>
        ) : (
          <span>
            {occasion.counterLabel} {since.totalDays} días
          </span>
        )}
      </div>
    </div>
  );
}
