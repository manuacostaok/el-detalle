import type { NatalChart, BodyKey } from "./natal-chart";
import type { SynastryAspect } from "./synastry-aspects";

const BODY_LABEL: Record<BodyKey, string> = {
  sun: "Sol",
  moon: "Luna",
  mercury: "Mercurio",
  venus: "Venus",
  mars: "Marte",
  jupiter: "Júpiter",
  saturn: "Saturno",
};

export function buildSynastryPrompt(params: {
  nameA: string;
  nameB: string;
  chartA: NatalChart;
  chartB: NatalChart;
  aspects: SynastryAspect[];
  approxTime: boolean;
}): string {
  const { nameA, nameB, chartA, chartB, aspects, approxTime } = params;

  const placementsA = [
    `Sol en ${chartA.bodies.sun.sign}`,
    `Luna en ${chartA.bodies.moon.sign}`,
    `Venus en ${chartA.bodies.venus.sign}`,
    `Marte en ${chartA.bodies.mars.sign}`,
    chartA.ascendant ? `Ascendente en ${chartA.ascendant.sign}` : null,
  ].filter(Boolean);

  const placementsB = [
    `Sol en ${chartB.bodies.sun.sign}`,
    `Luna en ${chartB.bodies.moon.sign}`,
    `Venus en ${chartB.bodies.venus.sign}`,
    `Marte en ${chartB.bodies.mars.sign}`,
    chartB.ascendant ? `Ascendente en ${chartB.ascendant.sign}` : null,
  ].filter(Boolean);

  const topAspects = aspects
    .slice(0, 6)
    .map((a) => `${BODY_LABEL[a.bodyA]} de ${nameA} en ${a.aspect} con ${BODY_LABEL[a.bodyB]} de ${nameB}`)
    .join("; ");

  return `IMPORTANTE: Respondé ÚNICAMENTE en español rioplatense. Ni una palabra en inglés.

Sos un astrólogo cálido y con buen humor, escribiendo para una pareja en una página de regalo digital.

Datos astronómicos reales (calculados, no los inventes ni los cambies):
- ${nameA}: ${placementsA.join(", ")}.
- ${nameB}: ${placementsB.join(", ")}.
- Aspectos entre ambas cartas: ${topAspects || "sin aspectos mayores destacados"}.
${approxTime ? "- La hora de nacimiento de al menos una persona es aproximada, así que NO afirmes nada específico sobre ascendentes con seguridad." : ""}

Escribí una lectura de sinastría de pareja en español rioplatense, de 150 a 220 palabras, tono cálido, divertido y honesto — pensada para leerse juntos y sonreír, NO como una predicción determinista ni un consejo de vida serio. Basate SOLO en los datos de arriba, no inventes otros planetas ni aspectos. Mencioná 2 o 3 fortalezas concretas de la combinación y una tensión o diferencia a trabajar, todo anclado en los aspectos reales dados. Dirigite a ellos como pareja, usando sus nombres. No uses títulos ni encabezados, un solo bloque de texto fluido. Recordá: todo en español rioplatense.`;
}
