"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

/**
 * Stagger reveal on scroll para grupos de tarjetas/elementos hijos directos.
 * Respeta prefers-reduced-motion (no anima, deja todo visible).
 */
export function RevealSection({
  children,
  className,
  translateY = 24,
}: {
  children: React.ReactNode;
  className?: string;
  translateY?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const items = Array.from(el.children) as HTMLElement[];
    items.forEach((item) => {
      item.style.opacity = "0";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(items, {
            opacity: [0, 1],
            translateY: [translateY, 0],
            delay: stagger(80),
            duration: 650,
            ease: "outQuad",
          });
          observer.disconnect();
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [translateY]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
