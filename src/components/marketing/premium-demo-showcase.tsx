"use client";

import { useEffect, useState } from "react";
import { GiftCard } from "@/components/gift/gift-card";
import { ConstellationCard } from "@/components/gift/constellation-card";
import { LoveStats } from "@/components/gift/love-stats";
import { SynastryCard } from "@/components/gift/synastry-card";
import { FutureLetter } from "@/components/gift/future-letter";
import type { GiftPagePayload } from "@/lib/domain";

const DEMO_PAYLOAD: GiftPagePayload = {
  occasion: "aniversario",
  from: "Julian",
  to: "Camila",
  date: "2018-11-22",
  title: "Once años juntos",
  message: "Hoy cumplimos otro año de historia juntos. Gracias por ser parte de algo que vale la pena festejar.",
  song: "",
  photo: "",
  theme: "nocturno",
  plan: "premium",
  synastry: {
    text: "¡Qué linda mezcla que tienen acá, Julian y Camila! Astrológicamente hay una química hermosa para celebrar juntos. La Luna y el Venus de Julian hacen un trígono espectacular con el Sol de Camila: hay un afecto natural, cálido y profundo donde se sienten refugiados con solo mirarse. El Mercurio de Julian en sextil al Júpiter de Camila es pura complicidad, risas y charlas interminables.",
    sunA: "Sagitario",
    sunB: "Cáncer",
    moonA: "Piscis",
    moonB: "Tauro",
    risingA: "Sagitario",
    approxTime: true,
  },
  futureLetter: {
    unlockDate: "2027-11-22",
    message: "",
  },
};

const FRAMES = [
  { key: "portada", label: "La portada", render: () => <GiftCard payload={DEMO_PAYLOAD} live /> },
  { key: "universo", label: "03 · Su universo", render: () => <ConstellationCard from={DEMO_PAYLOAD.from} to={DEMO_PAYLOAD.to} /> },
  {
    key: "estrellas",
    label: "04 · Lo que dicen las estrellas",
    render: () => <SynastryCard synastry={DEMO_PAYLOAD.synastry!} from={DEMO_PAYLOAD.from} to={DEMO_PAYLOAD.to} />,
  },
  { key: "numeros", label: "05 · Sus números", render: () => <LoveStats date={DEMO_PAYLOAD.date} /> },
  {
    key: "capsula",
    label: "06 · Lo que todavía no pasó",
    render: () => <FutureLetter unlockDate={DEMO_PAYLOAD.futureLetter!.unlockDate} message="" />,
  },
];

const INTERVAL_MS = 3600;

export function PremiumDemoShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % FRAMES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const frame = FRAMES[index];

  return (
    <div
      className="relative mx-auto w-full max-w-[380px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rounded-[28px] border border-line-strong bg-surface/60 p-3 shadow-lift">
        <div className="flex items-center justify-between px-2 pb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint">
            Edición Especial
          </span>
          <div className="flex gap-1.5">
            {FRAMES.map((f, i) => (
              <button
                key={f.key}
                type="button"
                aria-label={`Ver ${f.label}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-gold" : "w-1.5 bg-line-strong"}`}
              />
            ))}
          </div>
        </div>
        <div key={frame.key} className="animate-frame-in max-h-[430px] overflow-y-auto rounded-[18px]">
          {frame.render()}
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[11.5px] text-text-faint">
        Así se ve — con contenido real, no una maqueta
      </p>
    </div>
  );
}
