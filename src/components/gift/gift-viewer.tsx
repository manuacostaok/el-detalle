"use client";

import Link from "next/link";
import type { GiftPagePayload } from "@/lib/domain";
import { getOccasion } from "@/lib/domain";
import { GIFT_THEME_STYLES } from "@/lib/gift-theme-styles";
import { GiftCard } from "@/components/gift/gift-card";
import { RevealOverlay } from "@/components/gift/reveal-overlay";
import { FloatEmoji } from "@/components/gift/float-emoji";

export function GiftViewer({ payload }: { payload: GiftPagePayload }) {
  const style = GIFT_THEME_STYLES[payload.theme];
  const occasion = getOccasion(payload.occasion);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 py-12"
      style={{ background: style.background }}
    >
      <RevealOverlay />
      <FloatEmoji emoji={occasion.emoji} />
      <div className="relative z-[1] w-full max-w-[460px]">
        <GiftCard payload={payload} live />
      </div>
    </div>
  );
}

export function GiftNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ground px-5 text-center">
      <div>
        <h1 className="text-[24px] text-text">
          Esta página no existe (o el link está incompleto).
        </h1>
        <Link href="/crear" className="mt-3 inline-block text-accent underline underline-offset-4">
          Creá la tuya →
        </Link>
      </div>
    </div>
  );
}
