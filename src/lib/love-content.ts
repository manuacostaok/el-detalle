/**
 * Contenido premium "de más": una constelación generativa única por pareja y
 * estadísticas divertidas calculadas desde la fecha. Todo determinístico (mismo
 * input → mismo resultado) para que el link siga siendo la única fuente de verdad,
 * sin sumarle peso real al payload.
 */
import { timeSince } from "./domain";

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Star = { x: number; y: number; r: number; delay: number; bright: boolean };

/** Constelación única, generada a partir de los nombres y la fecha — no es un mapa astronómico real. */
export function generateConstellation(seed: string, count = 34): Star[] {
  const rand = mulberry32(hashString(seed));
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      r: 0.6 + rand() * 1.6,
      delay: rand() * 6,
      bright: i % 7 === 0,
    });
  }
  return stars;
}

/** Líneas que conectan las estrellas "brillantes" para que se lea como una constelación. */
export function constellationLines(stars: Star[]): [Star, Star][] {
  const bright = stars.filter((s) => s.bright);
  const lines: [Star, Star][] = [];
  for (let i = 0; i < bright.length - 1; i++) {
    lines.push([bright[i], bright[i + 1]]);
  }
  return lines;
}

export type LoveStat = { value: string; label: string };

export function loveStats(dateStr: string): LoveStat[] {
  const t = timeSince(dateStr);
  const totalDays = Math.max(t.totalDays, 0);
  const hours = totalDays * 24;
  const minutes = hours * 60;
  const weeks = Math.floor(totalDays / 7);
  const sunrises = totalDays;
  const songs3min = Math.floor(minutes / 3);

  return [
    { value: totalDays.toLocaleString("es-AR"), label: "Días juntos" },
    { value: weeks.toLocaleString("es-AR"), label: "Semanas" },
    { value: hours.toLocaleString("es-AR"), label: "Horas" },
    { value: sunrises.toLocaleString("es-AR"), label: "Amaneceres compartidos" },
    { value: songs3min.toLocaleString("es-AR"), label: "Canciones de 3 min, una tras otra" },
  ];
}

export function daysUntilNextAnniversary(dateStr: string): number {
  const start = new Date(dateStr + "T00:00:00");
  if (isNaN(start.getTime())) return 0;
  const now = new Date();
  let next = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (next.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    next = new Date(now.getFullYear() + 1, start.getMonth(), start.getDate());
  }
  return Math.ceil((next.getTime() - now.getTime()) / 86400000);
}
