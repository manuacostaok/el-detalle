import { Origin, Horoscope } from "circular-natal-horoscope-js";

const BODIES = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"] as const;
export type BodyKey = (typeof BODIES)[number];

export type ChartBody = { sign: string; degrees: number };

export type NatalChart = {
  bodies: Record<BodyKey, ChartBody>;
  ascendant: ChartBody | null;
};

export function computeNatalChart(params: {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  timeKnown: boolean;
  latitude: number;
  longitude: number;
}): NatalChart {
  const origin = new Origin({
    year: params.year,
    month: params.month - 1,
    date: params.day,
    hour: params.hour,
    minute: params.minute,
    latitude: params.latitude,
    longitude: params.longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "whole-sign",
    zodiac: "tropical",
    language: "es",
  });

  const bodies = {} as Record<BodyKey, ChartBody>;
  for (const key of BODIES) {
    const body = horoscope.CelestialBodies[key];
    bodies[key] = {
      sign: body.Sign.label,
      degrees: body.ChartPosition.Ecliptic.DecimalDegrees,
    };
  }

  return {
    bodies,
    ascendant: params.timeKnown
      ? {
          sign: horoscope.Ascendant.Sign.label,
          degrees: horoscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees,
        }
      : null,
  };
}
