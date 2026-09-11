"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { HeartHalf } from "@/components/ui/heart-mark";

export function RevealOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Reading matchMedia only exists client-side; the overlay must render on the
      // server/first paint and then remove itself, or SSR and the client would mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSkip(true);
      return;
    }
    const heartbeat = animate(
      [leftRef.current, rightRef.current].filter(Boolean) as HTMLElement[],
      {
        scale: [1, 1.14, 0.97, 1.08, 1],
        duration: 900,
        ease: "inOutQuad",
      },
    );

    const t1 = setTimeout(() => {
      heartbeat.pause();
      animate(leftRef.current!, {
        translateX: -130,
        rotate: -10,
        opacity: 0,
        duration: 650,
        ease: "inOutQuad",
      });
      animate(rightRef.current!, {
        translateX: 130,
        rotate: 10,
        opacity: 0,
        duration: 650,
        ease: "inOutQuad",
      });
    }, 520);

    const t2 = setTimeout(() => setHidden(true), 900);
    const t3 = setTimeout(() => setSkip(true), 1450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (skip) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-ground transition-opacity duration-450 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative w-[120px] h-[120px]">
        <span ref={leftRef} className="absolute inset-0 block">
          <HeartHalf side="left" fill="#C4425B" className="w-full h-full" />
        </span>
        <span ref={rightRef} className="absolute inset-0 block">
          <HeartHalf side="right" fill="#C9A24B" className="w-full h-full" />
        </span>
      </div>
    </div>
  );
}
