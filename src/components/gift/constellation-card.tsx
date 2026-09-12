import { Constellation } from "./constellation";

export function ConstellationCard({
  to,
  from,
}: {
  to: string;
  from: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#10111A] p-7 text-center">
      <div className="absolute inset-0">
        <Constellation seed={`${from}-${to}`} />
      </div>
      <div className="relative">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft/80">
          03 · Su universo
        </div>
        <p className="mt-3 text-[14px] leading-[1.6] text-text-soft/90 max-w-[38ch] mx-auto">
          Única para {from} y {to} — generada a partir de sus nombres, como una huella
          que no se repite en ninguna otra historia.
        </p>
      </div>
    </div>
  );
}
