import { generateConstellation } from "@/lib/love-content";
import { ZODIAC_CONSTELLATIONS } from "@/lib/zodiac-constellations";

const FIELD_STARS = generateConstellation("el-detalle-cielo", 130);

const PLACEMENTS: { top: string; left: string; width: string; rotate: number; opacity: number }[] = [
  { top: "-4%", left: "-6%", width: "38vw", rotate: -8, opacity: 0.16 },
  { top: "6%", left: "68%", width: "30vw", rotate: 6, opacity: 0.13 },
  { top: "62%", left: "8%", width: "34vw", rotate: 4, opacity: 0.12 },
];

/**
 * Fondo ambiente del sitio de marketing: un cielo nocturno con estrellas y
 * constelaciones zodiacales de fondo — la misma idea visual de la sinastría
 * premium, adelantada como atmósfera del sitio entero. Fijo, decorativo,
 * sin interacción; respeta prefers-reduced-motion vía CSS puro (sin JS).
 */
export function NightSky() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -top-40 -right-32 h-[560px] w-[560px] rounded-full opacity-[0.16] blur-[110px] motion-safe:animate-[drift-slow_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-52 -left-40 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-[120px] motion-safe:animate-[drift-slow_32s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)" }}
      />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full motion-safe:animate-[drift-slow_60s_ease-in-out_infinite]"
      >
        {FIELD_STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.bright ? s.r * 0.16 : s.r * 0.08}
            fill={s.bright ? "#E7CD8E" : "#F3E9E4"}
            opacity={s.bright ? 0.55 : 0.32}
            className="motion-safe:animate-[twinkle_5s_ease-in-out_infinite]"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>

      {ZODIAC_CONSTELLATIONS.map((c, i) => {
        const p = PLACEMENTS[i];
        return (
          <svg
            key={c.key}
            viewBox="0 0 100 100"
            className="absolute motion-safe:animate-[sky-fade-in_2.4s_ease-out_both]"
            style={{
              top: p.top,
              left: p.left,
              width: p.width,
              aspectRatio: "1 / 1",
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
              animationDelay: `${i * 0.5 + 0.3}s`,
            }}
          >
            {c.lines.map(([a, b], li) => (
              <line
                key={li}
                x1={c.points[a].x}
                y1={c.points[a].y}
                x2={c.points[b].x}
                y2={c.points[b].y}
                stroke="#E7CD8E"
                strokeWidth={0.35}
              />
            ))}
            {c.points.map((pt, pi) => (
              <circle
                key={pi}
                cx={pt.x}
                cy={pt.y}
                r={pt.r * 0.6}
                fill="#E7CD8E"
                className="motion-safe:animate-[twinkle_4.5s_ease-in-out_infinite]"
                style={{ animationDelay: `${pi * 0.35}s` }}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
