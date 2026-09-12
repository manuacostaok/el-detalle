"use client";

import { useEffect, useState } from "react";
import { EnvelopeReveal } from "@/components/gift/envelope-reveal";

const SEEN_KEY = "detalle-home-intro-seen";

/**
 * La misma apertura que recibe quien abre un detalle, pero para quien recién
 * llega al sitio: el producto entero se presenta como un regalo por abrir,
 * no como una landing más. Se reproduce una sola vez por sesión de navegador.
 */
export function HomeIntro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage only exists client-side; render open on first paint and only then skip if already seen this session.
      if (sessionStorage.getItem(SEEN_KEY)) setShow(false);
    } catch {
      // sessionStorage bloqueado (modo privado, etc.) — se muestra igual, sin persistir.
    }
  }, []);

  if (!show) return null;

  return (
    <EnvelopeReveal
      eyebrow="Antes de un mensaje,"
      subtitle="hay un detalle."
      autoOpenDelay={700}
      onDone={() => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // nada que persistir si está bloqueado.
        }
      }}
    />
  );
}
