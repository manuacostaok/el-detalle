import { loveStats, daysUntilNextAnniversary } from "@/lib/love-content";

export function LoveStats({ date }: { date: string }) {
  const stats = loveStats(date);
  const daysToAnniversary = daysUntilNextAnniversary(date);

  return (
    <div className="rounded-[22px] border border-line bg-surface p-7">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft">
05 · Sus números
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[14px] bg-ground/60 border border-line px-3.5 py-4 text-center">
            <div className="font-mono text-[20px] text-text">{s.value}</div>
            <div className="mt-1 text-[11.5px] text-text-faint leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
      {daysToAnniversary > 0 && (
        <p className="mt-4 text-[13px] text-text-soft">
          Faltan <span className="text-gold-soft font-semibold">{daysToAnniversary} días</span> para
          el próximo aniversario.
        </p>
      )}
    </div>
  );
}
