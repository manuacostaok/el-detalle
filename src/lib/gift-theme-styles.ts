import type { ThemeKey } from "./domain";

export type GiftThemeStyle = {
  background: string;
  color: string;
  counterBg: string;
  counterBorder?: string;
  accent: string;
  eyebrowColor: string;
  cardBorder?: string;
  borderRadius?: string;
};

export const GIFT_THEME_STYLES: Record<ThemeKey, GiftThemeStyle> = {
  romantico: {
    background: "#FFF1F3",
    color: "#3A1620",
    counterBg: "#FFE1E6",
    accent: "#C4425B",
    eyebrowColor: "#C4425B",
  },
  boho: {
    background: "#F4E9D8",
    color: "#3B2A1D",
    counterBg: "#EBD9BC",
    accent: "#C9713A",
    eyebrowColor: "#8A6B33",
  },
  minimal: {
    background: "#FAFAF8",
    color: "#1B1220",
    counterBg: "#F0F0EC",
    counterBorder: "1px solid #1B1220",
    accent: "#1B1220",
    eyebrowColor: "#8A8A85",
    cardBorder: "1px solid #1B1220",
  },
  nocturno: {
    background: "#10111A",
    color: "#F1EDE3",
    counterBg: "#1E2130",
    accent: "#D4AF6A",
    eyebrowColor: "#D4AF6A",
  },
  divertido: {
    background: "linear-gradient(160deg,#FFF4E0,#FFE3EE)",
    color: "#2B2438",
    counterBg: "#ffffffa8",
    accent: "#FF6B4A",
    eyebrowColor: "#6A5ACD",
    borderRadius: "30px",
  },
};
