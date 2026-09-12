import type { BodyKey, NatalChart } from "./natal-chart";

const ASPECTS: { name: string; angle: number; orb: number }[] = [
  { name: "conjunción", angle: 0, orb: 8 },
  { name: "sextil", angle: 60, orb: 6 },
  { name: "cuadratura", angle: 90, orb: 7 },
  { name: "trígono", angle: 120, orb: 8 },
  { name: "oposición", angle: 180, orb: 8 },
];

export type SynastryAspect = {
  bodyA: BodyKey;
  bodyB: BodyKey;
  aspect: string;
  orb: number;
};

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/** Aspectos cruzados entre dos cartas — el corazón de una sinastría real. */
export function computeSynastryAspects(a: NatalChart, b: NatalChart): SynastryAspect[] {
  const keys = Object.keys(a.bodies) as BodyKey[];
  const results: SynastryAspect[] = [];

  for (const bodyA of keys) {
    for (const bodyB of keys) {
      const dist = angularDistance(a.bodies[bodyA].degrees, b.bodies[bodyB].degrees);
      for (const asp of ASPECTS) {
        const orb = Math.abs(dist - asp.angle);
        if (orb <= asp.orb) {
          results.push({ bodyA, bodyB, aspect: asp.name, orb: Number(orb.toFixed(1)) });
          break;
        }
      }
    }
  }

  return results.sort((x, y) => x.orb - y.orb);
}
