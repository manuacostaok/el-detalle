import type { Metadata } from "next";
import { decodePayload } from "@/lib/payload";
import { getOccasion } from "@/lib/domain";
import { GiftViewer, GiftNotFound } from "@/components/gift/gift-viewer";

type Params = { payload: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { payload: raw } = await params;
  const data = decodePayload(raw);
  if (!data) return { title: "Página no encontrada" };
  const occasion = getOccasion(data.occasion);
  const title = data.title || occasion.defaultTitle;
  return {
    title: `${title} — para ${data.to || "alguien especial"}`,
    description: data.message?.slice(0, 160) || occasion.placeholder.slice(0, 160),
    robots: { index: false, follow: false },
  };
}

export default async function GiftPageRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { payload: raw } = await params;
  const data = decodePayload(raw);
  if (!data) return <GiftNotFound />;
  return <GiftViewer payload={data} />;
}
