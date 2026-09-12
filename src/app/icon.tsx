import { ImageResponse } from "next/og";
import { loadFrauncesItalic } from "@/lib/og-font";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const fraunces = await loadFrauncesItalic("D");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1220",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "#C4425B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid rgba(231,205,142,0.55)",
          }}
        >
          <span
            style={{
              fontFamily: "Fraunces",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 28,
              color: "#E7CD8E",
            }}
          >
            D
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, style: "italic", weight: 600 }] },
  );
}
