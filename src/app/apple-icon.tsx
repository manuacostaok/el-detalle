import { ImageResponse } from "next/og";
import { loadFrauncesItalic } from "@/lib/og-font";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: "50%",
            background: "#C4425B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid rgba(231,205,142,0.55)",
          }}
        >
          <span
            style={{
              fontFamily: "Fraunces",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 78,
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
