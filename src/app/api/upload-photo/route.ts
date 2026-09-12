import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const MAX_BYTES = 6 * 1024 * 1024; // 6MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Formato de imagen no soportado." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen pesa más de 6MB." }, { status: 413 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const key = `soulmates/${crypto.randomUUID()}.${ext}`;

  try {
    const blob = await put(key, file, { access: "public", addRandomSuffix: false });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo subir la imagen." },
      { status: 502 },
    );
  }
}
