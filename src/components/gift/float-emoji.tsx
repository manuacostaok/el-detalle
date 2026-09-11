// Deterministic pseudo-randomness (no Math.random) so server and client render the
// same particle layout — real randomness here would just cause a hydration mismatch
// for a purely decorative effect.
const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: ((i * 13) % 100) / 10,
  duration: 10 + ((i * 7) % 80) / 10,
}));

export function FloatEmoji({ emoji }: { emoji: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none motion-reduce:hidden">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute -bottom-10 text-[22px] opacity-0 animate-float-up"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
