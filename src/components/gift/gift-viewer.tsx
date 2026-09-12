"use client";

import Link from "next/link";
import type { GiftPagePayload } from "@/lib/domain";
import { getOccasion } from "@/lib/domain";
import { GIFT_THEME_STYLES } from "@/lib/gift-theme-styles";
import { GiftCard } from "@/components/gift/gift-card";
import { RevealOverlay } from "@/components/gift/reveal-overlay";
import { FloatEmoji } from "@/components/gift/float-emoji";
import { ConstellationCard } from "@/components/gift/constellation-card";
import { LoveStats } from "@/components/gift/love-stats";
import { FutureLetter } from "@/components/gift/future-letter";
import { SynastryCard } from "@/components/gift/synastry-card";
import { BackgroundPhotoCarousel } from "@/components/gift/background-photo-carousel";
import { PhotoTimeline } from "@/components/gift/photo-timeline";

export function GiftViewer({ payload }: { payload: GiftPagePayload }) {
  const style = GIFT_THEME_STYLES[payload.theme];
  const occasion = getOccasion(payload.occasion);
  const isPremium = payload.plan === "premium";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden px-5 py-12"
      style={{ background: style.background }}
    >
      {payload.backgroundPhotos && payload.backgroundPhotos.length > 0 && (
        <BackgroundPhotoCarousel photos={payload.backgroundPhotos} />
      )}
      <RevealOverlay />
      <FloatEmoji emoji={occasion.emoji} />
      <div className="relative z-[1] mx-auto flex w-full max-w-[460px] flex-col gap-6">
        <GiftCard payload={payload} live />
        {isPremium && (
          <>
            <ConstellationCard from={payload.from} to={payload.to} />
            <LoveStats date={payload.date} />
          </>
        )}
        {payload.timeline && payload.timeline.length > 0 && (
          <PhotoTimeline entries={payload.timeline} />
        )}
        {payload.synastry && (
          <SynastryCard synastry={payload.synastry} from={payload.from} to={payload.to} />
        )}
        {payload.futureLetter && (
          <FutureLetter
            unlockDate={payload.futureLetter.unlockDate}
            message={payload.futureLetter.message}
          />
        )}
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
