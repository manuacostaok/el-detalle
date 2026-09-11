export const WIZ_STEPS = [
  "ocasion",
  "protagonistas",
  "mensaje",
  "plan",
  "extras",
  "tema",
  "listo",
] as const;

export type WizStepKey = (typeof WIZ_STEPS)[number];
