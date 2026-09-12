import { ImageResponse } from "next/og";
import { loadFrauncesItalic } from "@/lib/og-font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "El Detalle";
const TAGLINE = "Un regalo digital. No un mensaje.";

export default async function OpengraphImage() {
  const fraunces = await loadFrauncesItalic(`D${TITLE}${TAGLINE}`.toUpperCase() + `D${TITLE}${TAGLINE}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1220",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,162,75,0.16) 0%, rgba(27,18,32,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            width: 148,
            height: 148,
            borderRadius: "50%",
            background: "#C4425B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "3px solid rgba(231,205,142,0.6)",
          }}
        >
          <span
            style={{
              fontFamily: "Fraunces",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 92,
              color: "#E7CD8E",
            }}
          >
            D
          </span>
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 74,
            color: "#F3E9E4",
            display: "flex",
          }}
        >
          {TITLE}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#E7CD8E",
            display: "flex",
          }}
        >
          {TAGLINE}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: fraunces, style: "italic", weight: 600 }],
    },
  );
}
