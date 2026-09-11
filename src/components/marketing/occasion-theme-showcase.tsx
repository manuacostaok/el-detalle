import type { Occasion, GiftTheme } from "@/lib/domain";
import { RevealSection } from "@/components/motion/reveal-section";

export function OccasionThemeShowcase({
  occasions,
  themes,
}: {
  occasions: Occasion[];
  themes: GiftTheme[];
}) {
  return (
    <>
      <RevealSection className="mt-11 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {occasions.map((o) => (
          <div
            key={o.key}
            className="rounded-[14px] border border-line bg-surface px-3.5 py-[18px] text-center"
          >
            <div className="text-[26px]">{o.emoji}</div>
            <h4 className="mt-2.5 text-[13.5px] font-semibold text-text">{o.label}</h4>
            <p className="mt-1 text-[12px] text-text-faint">{o.counterLabel}…</p>
          </div>
        ))}
      </RevealSection>

      <RevealSection className="mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {themes.map((t) => (
          <div
            key={t.key}
            className="relative h-[120px] overflow-hidden rounded-[14px] border border-line"
            style={{ background: t.swatches[0] }}
          >
            {t.premium && (
              <span className="absolute top-2.5 right-2.5 rounded-full bg-gold px-2 py-0.5 font-mono text-[9px] font-bold text-ink">
                Premium
              </span>
            )}
            <div
              className="absolute inset-x-0 bottom-0 px-2.5 py-2 font-mono text-[10.5px] backdrop-blur-[2px]"
              style={{
                color: t.key === "minimal" ? "#1B1220" : "#fff",
                background: t.key === "minimal" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.35)",
              }}
            >
              {t.label}
            </div>
          </div>
        ))}
      </RevealSection>
    </>
  );
}
