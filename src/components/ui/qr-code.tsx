"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function QrCode({
  value,
  size = 120,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, value, {
      width: size * 4,
      margin: 1,
      color: { dark: "#1B1220", light: "#FFFFFF" },
      errorCorrectionLevel: value.length > 900 ? "L" : "M",
    })
      .then(() => {
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      })
      .catch(() => {});
  }, [value, size]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
