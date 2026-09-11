"use client";

import { useMemo } from "react";
import { generateConstellation, constellationLines } from "@/lib/love-content";

export function Constellation({
  seed,
  accent = "#E7CD8E",
}: {
  seed: string;
  accent?: string;
}) {
  const stars = useMemo(() => generateConstellation(seed), [seed]);
  const lines = useMemo(() => constellationLines(stars), [stars]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
      aria-hidden="true"
    >
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={accent}
          strokeWidth={0.12}
          opacity={0.35}
        />
      ))}
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.bright ? s.r * 1.6 : s.r}
          fill={s.bright ? accent : "#F3E9E4"}
          opacity={s.bright ? 0.95 : 0.55}
          className="motion-safe:animate-[twinkle_4s_ease-in-out_infinite]"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}
