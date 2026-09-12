import { NextResponse } from "next/server";
import { computeNatalChart } from "@/lib/astro/natal-chart";
import { computeSynastryAspects } from "@/lib/astro/synastry-aspects";
import { geocodePlace } from "@/lib/astro/geocode";
import { buildSynastryPrompt } from "@/lib/astro/prompt";
import { generateWithGemini } from "@/lib/astro/gemini";
import type { SynastryResult } from "@/lib/domain";

type BirthInput = {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  timeKnown: boolean;
  place: string;
};

type RequestBody = { a: BirthInput; b: BirthInput };

function parseDateTime(input: BirthInput) {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.timeKnown && input.time ? input.time.split(":").map(Number) : [12, 0];
  return { year, month, day, hour, minute };
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const { a, b } = body;
  if (!a?.name || !b?.name || !a?.date || !b?.date || !a?.place || !b?.place) {
    return NextResponse.json({ error: "Faltan datos de nacimiento." }, { status: 400 });
  }

  const [geoA, geoB] = await Promise.all([geocodePlace(a.place), geocodePlace(b.place)]);
  if (!geoA) {
    return NextResponse.json(
      { error: `No encontramos "${a.place}". Probá con "Ciudad, País".` },
      { status: 422 },
    );
  }
  if (!geoB) {
    return NextResponse.json(
      { error: `No encontramos "${b.place}". Probá con "Ciudad, País".` },
      { status: 422 },
    );
  }

  const dtA = parseDateTime(a);
  const dtB = parseDateTime(b);

  const chartA = computeNatalChart({ ...dtA, timeKnown: a.timeKnown, latitude: geoA.latitude, longitude: geoA.longitude });
  const chartB = computeNatalChart({ ...dtB, timeKnown: b.timeKnown, latitude: geoB.latitude, longitude: geoB.longitude });

  const aspects = computeSynastryAspects(chartA, chartB);
  const approxTime = !a.timeKnown || !b.timeKnown;

  const prompt = buildSynastryPrompt({
    nameA: a.name,
    nameB: b.name,
    chartA,
    chartB,
    aspects,
    approxTime,
  });

  let text: string;
  try {
    text = await generateWithGemini(prompt);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo generar la sinastría." },
      { status: 502 },
    );
  }

  const result: SynastryResult = {
    text,
    sunA: chartA.bodies.sun.sign,
    sunB: chartB.bodies.sun.sign,
    moonA: chartA.bodies.moon.sign,
    moonB: chartB.bodies.moon.sign,
    risingA: chartA.ascendant?.sign,
    risingB: chartB.ascendant?.sign,
    approxTime,
  };

  return NextResponse.json(result);
}
