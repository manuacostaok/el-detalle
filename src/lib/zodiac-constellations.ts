/**
 * Formas estilizadas de constelaciones zodiacales para el fondo del sitio.
 * No son mapas astronómicos reales — son siluetas simplificadas, pensadas para
 * leerse como constelación a simple vista, no para la precisión de un atlas.
 * Coordenadas en un viewBox local de 0 a 100.
 */

export type ZodiacPoint = { x: number; y: number; r: number };
export type ZodiacConstellation = {
  key: string;
  points: ZodiacPoint[];
  lines: [number, number][];
};

export const ZODIAC_CONSTELLATIONS: ZodiacConstellation[] = [
  {
    // Géminis — dos figuras paralelas, unidas por el medio. Dos volviéndose uno.
    key: "gemini",
    points: [
      { x: 22, y: 8, r: 1.6 },
      { x: 24, y: 28, r: 1.1 },
      { x: 20, y: 48, r: 1.5 },
      { x: 25, y: 68, r: 1.1 },
      { x: 21, y: 90, r: 1.4 },
      { x: 46, y: 10, r: 1.4 },
      { x: 48, y: 30, r: 1.1 },
      { x: 44, y: 49, r: 1.6 },
      { x: 49, y: 69, r: 1.1 },
      { x: 45, y: 92, r: 1.4 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [5, 6], [6, 7], [7, 8], [8, 9],
      [2, 7],
    ],
  },
  {
    // Leo — la hoz y el cuerpo. Regido por el sol; el signo del corazón.
    key: "leo",
    points: [
      { x: 18, y: 62, r: 1.7 },
      { x: 16, y: 44, r: 1.1 },
      { x: 22, y: 26, r: 1.2 },
      { x: 36, y: 16, r: 1.1 },
      { x: 52, y: 24, r: 1.3 },
      { x: 62, y: 42, r: 1.6 },
      { x: 82, y: 48, r: 1.8 },
      { x: 66, y: 58, r: 1.0 },
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
      [5, 6], [5, 7], [7, 0],
    ],
  },
  {
    // Libra — la balanza. Equilibrio, sociedad, dos partes que se sostienen.
    key: "libra",
    points: [
      { x: 50, y: 10, r: 1.5 },
      { x: 18, y: 38, r: 1.2 },
      { x: 82, y: 38, r: 1.2 },
      { x: 12, y: 70, r: 1.6 },
      { x: 88, y: 70, r: 1.6 },
      { x: 50, y: 92, r: 1.1 },
    ],
    lines: [
      [0, 1], [0, 2], [1, 3], [2, 4], [0, 5],
    ],
  },
];
