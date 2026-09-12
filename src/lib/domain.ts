export type OccasionKey =
  | "pareja"
  | "amistad"
  | "familia"
  | "mascota"
  | "aniversario";

export type Occasion = {
  key: OccasionKey;
  emoji: string;
  label: string;
  counterLabel: string;
  placeholder: string;
  defaultTitle: string;
};

export const OCCASIONS: Occasion[] = [
  {
    key: "pareja",
    emoji: "💞",
    label: "Pareja",
    counterLabel: "Juntos hace",
    placeholder:
      "Desde que te conocí, cada día tiene algo mejor. Esta es nuestra historia, para volver a leerla cuando quieras.",
    defaultTitle: "Nuestra historia",
  },
  {
    key: "amistad",
    emoji: "✨",
    label: "Amistad",
    counterLabel: "Amigos hace",
    placeholder:
      "De todas las personas que pude cruzarme, me alegra que hayas sido vos. Gracias por tantos años de código compartido.",
    defaultTitle: "Esta amistad",
  },
  {
    key: "familia",
    emoji: "🏡",
    label: "Familia",
    counterLabel: "Familia hace",
    placeholder:
      "Esta familia empezó hace un tiempo y no para de crecer. Este es un lugarcito para recordarlo siempre.",
    defaultTitle: "Nuestra familia",
  },
  {
    key: "mascota",
    emoji: "🐾",
    label: "Mascota",
    counterLabel: "Con nosotros hace",
    placeholder:
      "Llegaste a esta casa y la cambiaste para siempre. Esta página es para vos, aunque no sepas leer.",
    defaultTitle: "Para vos, con patas",
  },
  {
    key: "aniversario",
    emoji: "🎉",
    label: "Aniversario",
    counterLabel: "Celebrando hace",
    placeholder:
      "Hoy cumplimos otro año de historia juntos. Gracias por ser parte de algo que vale la pena festejar.",
    defaultTitle: "Este momento",
  },
];

export function getOccasion(key: OccasionKey): Occasion {
  return OCCASIONS.find((o) => o.key === key) ?? OCCASIONS[0];
}

export type ThemeKey = "romantico" | "boho" | "minimal" | "nocturno" | "divertido";

export type GiftTheme = {
  key: ThemeKey;
  label: string;
  swatches: [string, string, string];
  premium: boolean;
  description: string;
};

export const THEMES: GiftTheme[] = [
  {
    key: "romantico",
    label: "Romántico",
    swatches: ["#FFE1E6", "#FFF1F3", "#C4425B"],
    premium: false,
    description: "Rosados cálidos y tipografía suave. El clásico que nunca falla.",
  },
  {
    key: "boho",
    label: "Boho cálido",
    swatches: ["#F4E9D8", "#EBD9BC", "#C9713A"],
    premium: false,
    description: "Terracota y beige, con aire artesanal.",
  },
  {
    key: "minimal",
    label: "Minimal",
    swatches: ["#FAFAF8", "#F0F0EC", "#1B1220"],
    premium: false,
    description: "Blanco y negro puro, sin adornos.",
  },
  {
    key: "nocturno",
    label: "Nocturno",
    swatches: ["#10111A", "#1E2130", "#D4AF6A"],
    premium: true,
    description: "Fondo oscuro y dorado — elegante y dramático.",
  },
  {
    key: "divertido",
    label: "Divertido",
    swatches: ["#FFF4E0", "#FFE3EE", "#FF6B4A"],
    premium: true,
    description: "Gradiente cálido y bordes redondeados — la opción juguetona.",
  },
];

export function getTheme(key: ThemeKey): GiftTheme {
  return THEMES.find((t) => t.key === key) ?? THEMES[0];
}

export type PlanKey = "free" | "premium";

export const PLAN_FEATURES: Record<
  PlanKey,
  { photo: boolean; song: boolean; watermark: boolean; label: string }
> = {
  free: { photo: false, song: false, watermark: true, label: "Básico" },
  premium: { photo: true, song: true, watermark: false, label: "Premium" },
};

export const PLAN_PRICING: Record<
  PlanKey,
  { ars: string; usd: string }
> = {
  free: { ars: "$10.000", usd: "US$7" },
  premium: { ars: "$25.000", usd: "US$17" },
};

export type GiftPagePayload = {
  occasion: OccasionKey;
  from: string;
  to: string;
  date: string;
  title: string;
  message: string;
  song: string;
  photo: string;
  theme: ThemeKey;
  plan: PlanKey;
  /** Cápsula del tiempo — Premium: un mensaje extra que se revela recién en `unlockDate`. */
  futureLetter?: { unlockDate: string; message: string };
  /** Sinastría — Premium: generada una sola vez (carta natal real + IA) y cacheada acá. */
  synastry?: SynastryResult;
};

export type SynastryResult = {
  text: string;
  sunA: string;
  sunB: string;
  moonA: string;
  moonB: string;
  risingA?: string;
  risingB?: string;
  approxTime: boolean;
};

export function timeSince(dateStr: string) {
  const start = new Date(dateStr + "T00:00:00");
  const now = new Date();
  if (isNaN(start.getTime()) || start > now) {
    return { years: 0, months: 0, days: 0, hours: 0, mins: 0, secs: 0, totalDays: 0 };
  }
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let mins = now.getMinutes() - start.getMinutes();
  let secs = now.getSeconds() - start.getSeconds();
  if (secs < 0) {
    secs += 60;
    mins--;
  }
  if (mins < 0) {
    mins += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }
  const totalDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return { years, months, days, hours, mins, secs, totalDays };
}
