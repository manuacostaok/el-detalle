const HEART_LEFT_D =
  "M50 88 C50 88 10 60 10 34 C10 18 22 8 36 8 C44 8 50 14 50 14 L43 24 L54 34 L41 46 L55 58 L44 70 L50 88 Z";
const HEART_RIGHT_D =
  "M50 14 C50 14 56 8 64 8 C78 8 90 18 90 34 C90 60 50 88 50 88 L44 70 L55 58 L41 46 L54 34 L43 24 L50 14 Z";

type HeartMarkProps = {
  className?: string;
  leftFill?: string;
  rightFill?: string;
  animate?: boolean;
};

/** Dos mitades que forman un corazón — la marca de Soulmates. */
export function HeartMark({
  className,
  leftFill = "var(--color-accent)",
  rightFill = "var(--color-gold)",
  animate = false,
}: HeartMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className ?? ""} ${animate ? "animate-heartbeat" : ""}`}
      aria-hidden="true"
    >
      <path d={HEART_LEFT_D} fill={leftFill} />
      <path d={HEART_RIGHT_D} fill={rightFill} />
    </svg>
  );
}

export function HeartHalf({
  side,
  fill,
  className,
}: {
  side: "left" | "right";
  fill: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={side === "left" ? HEART_LEFT_D : HEART_RIGHT_D} fill={fill} />
    </svg>
  );
}
