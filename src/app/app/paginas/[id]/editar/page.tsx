"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPage, updatePagePayload } from "@/lib/mock/pages";
import type { GiftPagePayload } from "@/lib/domain";
import { OCCASIONS, THEMES, PLAN_FEATURES, getOccasion } from "@/lib/domain";
import { Container, Eyebrow } from "@/components/ui/container";
import { Field, Input } from "@/components/ui/field";
import { Pick } from "@/components/ui/pick";
import { Button } from "@/components/ui/button";
import { GiftCard } from "@/components/gift/gift-card";

export default function EditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  // AppLayout only renders this page client-side once a real session exists, so this
  // localStorage read (used only as the initial form state) is always available here.
  const [payload, setPayload] = useState<GiftPagePayload | null>(
    () => getPage(params.id)?.payload ?? null,
  );

  if (!payload) return null;

  function update<K extends keyof GiftPagePayload>(key: K, value: GiftPagePayload[K]) {
    setPayload((p) => (p ? { ...p, [key]: value } : p));
  }

  function handleSave() {
    if (!payload) return;
    updatePagePayload(params.id, payload);
    router.push(`/app/paginas/${params.id}`);
  }

  const occasion = getOccasion(payload.occasion);

  return (
    <Container className="py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
      <div>
        <Eyebrow>Editar página</Eyebrow>
        <h1 className="mt-2 text-[26px]">Los cambios se guardan al hacer clic en Guardar.</h1>

        <div className="mt-7">
          <label className="block text-[12.5px] font-semibold text-text-soft mb-2">Ocasión</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {OCCASIONS.map((o) => (
              <Pick key={o.key} active={payload.occasion === o.key} onClick={() => update("occasion", o.key)}>
                <span className="block text-[20px]">{o.emoji}</span>
                <span className="block mt-1.5 text-[11.5px] font-semibold">{o.label}</span>
              </Pick>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="De">
            <Input value={payload.from} onChange={(e) => update("from", e.target.value)} />
          </Field>
          <Field label="Para">
            <Input value={payload.to} onChange={(e) => update("to", e.target.value)} />
          </Field>
        </div>
        <Field label={occasion.counterLabel}>
          <Input type="date" value={payload.date} onChange={(e) => update("date", e.target.value)} />
        </Field>
        <Field label="Título">
          <Input value={payload.title} onChange={(e) => update("title", e.target.value)} placeholder={occasion.defaultTitle} />
        </Field>
        <Field label="Mensaje">
          <textarea
            maxLength={600}
            value={payload.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full min-h-[110px] bg-ground border border-line-strong text-text rounded-[11px] px-3.5 py-3 text-[14.5px] leading-[1.6] outline-none transition-colors focus:border-accent resize-y"
          />
        </Field>

        {PLAN_FEATURES[payload.plan].song && (
          <Field label="Link de YouTube">
            <Input value={payload.song} onChange={(e) => update("song", e.target.value)} />
          </Field>
        )}

        <div className="mt-[18px]">
          <label className="block text-[12.5px] font-semibold text-text-soft mb-2">Tema</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {THEMES.map((t) => {
              const locked = t.premium && payload.plan === "free";
              return (
                <Pick
                  key={t.key}
                  active={payload.theme === t.key}
                  disabled={locked}
                  className="p-0 overflow-hidden"
                  onClick={() => update("theme", t.key)}
                >
                  <span className="flex h-12">
                    {t.swatches.map((sw, i) => (
                      <span key={i} className="flex-1" style={{ background: sw }} />
                    ))}
                  </span>
                  <span className="block px-2 py-2 text-[11px]">{t.label}</span>
                </Pick>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button onClick={handleSave}>Guardar cambios</Button>
          <Button variant="ghost" href={`/app/paginas/${params.id}`}>
            Cancelar
          </Button>
        </div>
      </div>

      <div>
        <div className="sticky top-8">
          <h3 className="text-[13px] font-mono uppercase tracking-[0.08em] text-text-faint mb-3">
            Vista previa
          </h3>
          <GiftCard payload={payload} compact />
        </div>
      </div>
    </Container>
  );
}
