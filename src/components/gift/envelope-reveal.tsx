"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimeline } from "animejs";
import { SealMark } from "@/components/ui/seal-mark";

/**
 * La apertura de El Detalle: un sobre de verdad, con su sello de lacre, que hay que
 * romper para entrar. No es un fade a negro — la cámara entra en la carta y el
 * contenido de abajo (ya montado, solo tapado) queda revelado en continuidad.
 */
export function EnvelopeReveal({ recipientName }: { recipientName?: string }) {
  const [skip, setSkip] = useState(false);
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  const groupRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia only exists client-side; must render on the server/first paint and only then remove itself, or SSR and the client would mismatch.
      setSkip(true);
    }
  }, []);

  function handleOpen() {
    if (opening) return;
    setOpening(true);

    const tl = createTimeline({
      onComplete: () => setHidden(true),
    });

    if (hintRef.current) tl.add(hintRef.current, { opacity: 0, duration: 200 }, 0);

    tl.add(
      sealRef.current!.querySelector("#seal-left")!,
      { translateX: -22, rotate: -14, opacity: 0, duration: 480, ease: "inOutQuad" },
      0,
    )
      .add(
        sealRef.current!.querySelector("#seal-right")!,
        { translateX: 22, rotate: 14, opacity: 0, duration: 480, ease: "inOutQuad" },
        0,
      )
      .add(flapRef.current!, { rotateX: -172, duration: 700, ease: "inOutQuad" }, 220)
      .add(
        letterRef.current!,
        { translateY: [0, -34], scale: [0.92, 1], opacity: [0, 1], duration: 620, ease: "outQuad" },
        520,
      )
      .add(
        groupRef.current!,
        { scale: 1.08, opacity: 0, duration: 520, ease: "inQuad" },
        1050,
      );
  }

  useEffect(() => {
    if (skip || hidden) return;
    if (!sealRef.current) return;
    const pulse = animate(sealRef.current, {
      scale: [1, 1.05, 1],
      duration: 2200,
      loop: true,
      ease: "inOutSine",
    });
    return () => {
      pulse.pause();
    };
  }, [skip, hidden]);

  if (skip || hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center gap-7 bg-ground transition-opacity duration-500 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="text-center px-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-soft/80">
          Tenés un detalle
        </div>
        {recipientName && (
          <p className="mt-2 font-serif italic text-[19px] text-text/90">para {recipientName}</p>
        )}
      </div>

      <div style={{ perspective: "1200px" }}>
        <div ref={groupRef} className="relative w-[220px] h-[150px] sm:w-[260px] sm:h-[176px]">
          <div className="absolute inset-0 rounded-[10px] bg-paper shadow-lift" />

          <div
            ref={letterRef}
            className="absolute left-[8%] right-[8%] top-[10%] h-[80%] rounded-[6px] bg-paper-2 shadow-md"
            style={{ opacity: 0 }}
          />

          <div
            ref={flapRef}
            className="absolute inset-x-0 top-0"
            style={{
              height: "62%",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(160deg, var(--color-paper) 0%, var(--color-paper-2) 100%)",
            }}
          />

          <button
            ref={sealRef}
            type="button"
            onClick={handleOpen}
            aria-label="Abrir el detalle"
            className="absolute left-1/2 top-[38%] w-[52px] h-[52px] -translate-x-1/2 -translate-y-1/2 cursor-pointer disabled:cursor-default"
            disabled={opening}
          >
            <SealMark cracked={opening} className="w-full h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]" />
          </button>
        </div>
      </div>

      <p ref={hintRef} className="font-mono text-[12px] text-text-faint">
        Tocá el sello para abrirlo
      </p>
    </div>
  );
}
