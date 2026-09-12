import type { TimelineEntry } from "@/lib/domain";

export function PhotoTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <div className="rounded-[22px] border border-line bg-surface p-7">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-soft">
02 · Sus momentos
      </div>
      <div className="mt-5 flex flex-col gap-6">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-gold shrink-0" />
              {i < entries.length - 1 && <div className="mt-1 w-px flex-1 bg-line-strong" />}
            </div>
            <div className="flex-1 pb-1">
              {entry.date && (
                <div className="font-mono text-[11px] text-text-faint">{entry.date}</div>
              )}
              <div className="mt-2 overflow-hidden rounded-[14px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.url} alt="" className="w-full h-[180px] object-cover" loading="lazy" />
              </div>
              {entry.caption && (
                <p className="mt-2 text-[13.5px] text-text-soft leading-[1.5]">{entry.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
