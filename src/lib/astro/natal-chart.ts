import { Origin, Horoscope } from "circular-natal-horoscope-js";

const BODIES = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"] as const;
export type BodyKey = (typeof BODIES)[number];

export type ChartBody = { sign: string; degrees: number };

// The library's `language: "es"` option localizes CelestialBodies signs but NOT the
// Ascendant's — its `.label` stays in English regardless. `.key` is always the stable
// lowercase English slug, so we translate from that ourselves for both, guaranteeing
// consistent Spanish output regardless of that library quirk.
const SIGN_LABEL_ES: Record<string, string> = {
  aries: "Aries",
  taurus: "Tauro",
  gemini: "Géminis",
  cancer: "Cáncer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Escorpio",
  sagittarius: "Sagitario",
  capricorn: "Capricornio",
  aquarius: "Acuario",
  pisces: "Piscis",
};

function signLabelEs(sign: { key: string; label: string }): string {
  return SIGN_LABEL_ES[sign.key] ?? sign.label;
}

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
      sign: signLabelEs(body.Sign),
      degrees: body.ChartPosition.Ecliptic.DecimalDegrees,
    };
  }

  return {
    bodies,
    ascendant: params.timeKnown
      ? {
          sign: signLabelEs(horoscope.Ascendant.Sign),
          degrees: horoscope.Ascendant.ChartPosition.Ecliptic.DecimalDegrees,
        }
      : null,
  };
}
