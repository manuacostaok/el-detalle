"use client";

import { useEffect, useState } from "react";

/** Fondo de fotos rotando con cross-fade — detrás de la tarjeta, decorativo. */
export function BackgroundPhotoCarousel({ photos }: { photos: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(() => setActive((i) => (i + 1) % photos.length), 5000);
    return () => clearInterval(id);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      {photos.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={url}
          src={url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-ground/70" />
    </div>
  );
}
