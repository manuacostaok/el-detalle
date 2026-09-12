import type { SynastryResult } from "@/lib/domain";

export function SynastryCard({
  synastry,
  from,
  to,
}: {
  synastry: SynastryResult;
  from: string;
  to: string;
}) {
  return (
    <div className="rounded-[22px] border border-line bg-surface p-7">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft">
        Su sinastría
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
        <div className="rounded-[12px] bg-ground/60 border border-line px-3.5 py-3">
          <div className="text-text-faint text-[11px] uppercase tracking-wide">{from}</div>
          <div className="mt-1 text-text">☉ {synastry.sunA} · ☾ {synastry.moonA}</div>
          {synastry.risingA && <div className="text-text-soft">↑ {synastry.risingA}</div>}
        </div>
        <div className="rounded-[12px] bg-ground/60 border border-line px-3.5 py-3">
          <div className="text-text-faint text-[11px] uppercase tracking-wide">{to}</div>
          <div className="mt-1 text-text">☉ {synastry.sunB} · ☾ {synastry.moonB}</div>
          {synastry.risingB && <div className="text-text-soft">↑ {synastry.risingB}</div>}
        </div>
      </div>
      <p className="mt-4 text-[14.5px] leading-[1.7] text-text-soft whitespace-pre-wrap">
        {synastry.text}
      </p>
      <p className="mt-4 text-[11px] text-text-faint">
        Calculado con posiciones astronómicas reales de nacimiento
        {synastry.approxTime ? " (hora aproximada)" : ""} y redactado con IA — para divertirse
        en pareja, no es un consejo de vida.
      </p>
    </div>
  );
}
