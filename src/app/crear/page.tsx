"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WIZ_STEPS } from "./wizard-steps";
import type { GiftPagePayload, OccasionKey, PlanKey, ThemeKey } from "@/lib/domain";
import { OCCASIONS, THEMES, PLAN_FEATURES, PLAN_PRICING, getOccasion, getTheme } from "@/lib/domain";
import { Pick } from "@/components/ui/pick";
import { Field, Input } from "@/components/ui/field";
import { GiftCard } from "@/components/gift/gift-card";
import { ShareScreen } from "@/components/wizard/share-screen";
import { compressPhoto } from "@/lib/compress-photo";
import { encodePayload } from "@/lib/payload";
import { useSession } from "@/lib/mock/auth";
import { createPage } from "@/lib/mock/pages";
import type { SynastryResult, TimelineEntry } from "@/lib/domain";
import { uploadPhoto } from "@/lib/upload-photo";

type BirthInfo = { date: string; time: string; timeKnown: boolean; place: string };

const EMPTY_BIRTH: BirthInfo = { date: "", time: "", timeKnown: false, place: "" };

type Draft = {
  occasion: OccasionKey;
  from: string;
  to: string;
  date: string;
  title: string;
  message: string;
  song: string;
  photo: string;
  theme: ThemeKey;
  plan: PlanKey;
  futureLetterDate: string;
  futureLetterMessage: string;
  birthA: BirthInfo;
  birthB: BirthInfo;
  backgroundPhotos: string[];
  timeline: TimelineEntry[];
};

const EMPTY_DRAFT: Omit<Draft, "plan"> = {
  occasion: "pareja",
  from: "",
  to: "",
  date: "",
  title: "",
  message: "",
  song: "",
  photo: "",
  theme: "romantico",
  futureLetterDate: "",
  futureLetterMessage: "",
  birthA: EMPTY_BIRTH,
  birthB: EMPTY_BIRTH,
  backgroundPhotos: [],
  timeline: [],
};

const MAX_BACKGROUND_PHOTOS = 3;
const MAX_TIMELINE_ENTRIES = 5;

function CreateWizardInner() {
  const searchParams = useSearchParams();
  const user = useSession();
  const initialPlan = searchParams.get("plan") === "premium" ? "premium" : "free";

  const [draft, setDraft] = useState<Draft>({ ...EMPTY_DRAFT, plan: initialPlan });
  const [wizStep, setWizStep] = useState(0);
  const [photoStatus, setPhotoStatus] = useState<string | null>(null);
  const [published, setPublished] = useState<{ link: string; b64Length: number; saved: boolean; to: string } | null>(null);
  const [synastry, setSynastry] = useState<SynastryResult | null>(null);
  const [synastryStatus, setSynastryStatus] = useState<"idle" | "loading" | "error">("idle");
  const [synastryError, setSynastryError] = useState<string | null>(null);
  const [bgUploadStatus, setBgUploadStatus] = useState<string | null>(null);
  const [timelineUploadStatus, setTimelineUploadStatus] = useState<string | null>(null);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    setWizStep((s) => Math.min(WIZ_STEPS.length - 1, s + 1));
  }
  function prev() {
    setWizStep((s) => Math.max(0, s - 1));
  }

  async function handlePhotoChange(file: File) {
    setPhotoStatus("Comprimiendo…");
    try {
      const dataUrl = await compressPhoto(file);
      update("photo", dataUrl);
      setPhotoStatus(null);
    } catch {
      setPhotoStatus("No se pudo leer esa imagen, probá con otra.");
    }
  }

  async function handleAddBackgroundPhoto(file: File) {
    setBgUploadStatus("Subiendo…");
    try {
      const url = await uploadPhoto(file);
      update("backgroundPhotos", [...draft.backgroundPhotos, url]);
      setBgUploadStatus(null);
    } catch (err) {
      setBgUploadStatus(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    }
  }

  function removeBackgroundPhoto(index: number) {
    update(
      "backgroundPhotos",
      draft.backgroundPhotos.filter((_, i) => i !== index),
    );
  }

  async function handleAddTimelinePhoto(file: File) {
    setTimelineUploadStatus("Subiendo…");
    try {
      const url = await uploadPhoto(file);
      update("timeline", [...draft.timeline, { url, caption: "", date: "" }]);
      setTimelineUploadStatus(null);
    } catch (err) {
      setTimelineUploadStatus(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    }
  }

  function updateTimelineEntry(index: number, patch: Partial<TimelineEntry>) {
    update(
      "timeline",
      draft.timeline.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    );
  }

  function removeTimelineEntry(index: number) {
    update(
      "timeline",
      draft.timeline.filter((_, i) => i !== index),
    );
  }

  async function generateSynastry() {
    setSynastryStatus("loading");
    setSynastryError(null);
    try {
      const res = await fetch("/api/synastria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          a: { name: draft.from || "Alguien", ...draft.birthA },
          b: { name: draft.to || "Alguien", ...draft.birthB },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo generar la sinastría.");
      setSynastry(data as SynastryResult);
      setSynastryStatus("idle");
    } catch (err) {
      setSynastryStatus("error");
      setSynastryError(err instanceof Error ? err.message : "No se pudo generar la sinastría.");
    }
  }

  function publish() {
    const hasFutureLetter =
      draft.plan === "premium" && draft.futureLetterDate.trim() && draft.futureLetterMessage.trim();
    const payload: GiftPagePayload = {
      occasion: draft.occasion,
      from: draft.from || "Alguien",
      to: draft.to || "vos",
      date: draft.date || new Date().toISOString().slice(0, 10),
      title: draft.title,
      message: draft.message || getOccasion(draft.occasion).placeholder,
      song: PLAN_FEATURES[draft.plan].song ? draft.song : "",
      photo: PLAN_FEATURES[draft.plan].photo ? draft.photo : "",
      theme: draft.theme,
      plan: draft.plan,
      futureLetter: hasFutureLetter
        ? { unlockDate: draft.futureLetterDate, message: draft.futureLetterMessage }
        : undefined,
      synastry: draft.plan === "premium" && synastry ? synastry : undefined,
      backgroundPhotos: draft.backgroundPhotos.length > 0 ? draft.backgroundPhotos : undefined,
      timeline:
        draft.plan === "premium" && draft.timeline.length > 0 ? draft.timeline : undefined,
    };
    const b64 = encodePayload(payload);
    const link = `${window.location.origin}/r/${b64}`;
    let saved = false;
    if (user && user !== "loading") {
      createPage(user.id, payload);
      saved = true;
    }
    setPublished({ link, b64Length: b64.length, saved, to: payload.to });
  }

  function reset() {
    setPublished(null);
    setWizStep(0);
    setDraft({ ...EMPTY_DRAFT, plan: "free" });
    setSynastry(null);
    setSynastryStatus("idle");
    setSynastryError(null);
    setBgUploadStatus(null);
    setTimelineUploadStatus(null);
  }

  if (published) {
    return (
      <ShareScreen
        link={published.link}
        b64Length={published.b64Length}
        saved={published.saved}
        recipientName={published.to}
        onCreateAnother={reset}
      />
    );
  }

  const key = WIZ_STEPS[wizStep];
  const occasion = getOccasion(draft.occasion);
  const previewPayload: GiftPagePayload = {
    occasion: draft.occasion,
    from: draft.from || "Alguien",
    to: draft.to || "vos",
    date: draft.date || new Date().toISOString().slice(0, 10),
    title: draft.title,
    message: draft.message,
    song: draft.song,
    photo: draft.photo,
    theme: draft.theme,
    plan: draft.plan,
  };

  return (
    <div className="mx-auto max-w-[1180px] px-6 pt-10 pb-24">
      <div className="flex items-center justify-between mb-[30px]">
        <Link href="/" className="rounded-full border border-line-strong px-4 py-2 text-[13px] text-text hover:border-text-soft">
          ← Salir
        </Link>
        <div className="flex flex-1 gap-1.5 mx-6 max-w-[560px]">
          {WIZ_STEPS.slice(0, -1).map((s, i) => (
            <i
              key={s}
              className={`flex-1 h-[3px] rounded-full transition-colors duration-300 ${i <= wizStep ? "bg-accent" : "bg-line-strong"}`}
            />
          ))}
        </div>
        <div className="w-[74px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      <div className="mx-auto w-full max-w-[560px] rounded-[22px] border border-line bg-surface p-6 sm:p-[38px]">
        {key === "ocasion" && (
          <>
            <StepLabel n={1} />
            <h2 className="text-[25px]">¿Para quién es este detalle?</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Esto define el tono del mensaje sugerido y el nombre del contador.
            </p>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {OCCASIONS.map((o) => (
                <Pick key={o.key} active={draft.occasion === o.key} onClick={() => update("occasion", o.key)}>
                  <span className="block text-[24px]">{o.emoji}</span>
                  <span className="block mt-2 text-[12.5px] font-semibold">{o.label}</span>
                </Pick>
              ))}
            </div>
            <Nav onNext={next} />
          </>
        )}

        {key === "protagonistas" && (
          <>
            <StepLabel n={2} />
            <h2 className="text-[25px]">¿Quiénes son?</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              El contador de «{occasion.counterLabel}» se arma con la fecha que pongas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[18px]">
              <Field label="De">
                <Input value={draft.from} onChange={(e) => update("from", e.target.value)} placeholder="Tu nombre" />
              </Field>
              <Field label="Para">
                <Input value={draft.to} onChange={(e) => update("to", e.target.value)} placeholder="Su nombre" />
              </Field>
            </div>
            <Field
              label={occasion.counterLabel}
              error={!draft.date ? "Sin esto, el contador arranca en cero — es lo primero que va a ver." : undefined}
            >
              <Input type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} />
            </Field>
            <Nav onBack={prev} onNext={next} disabled={!draft.date} />
          </>
        )}

        {key === "mensaje" && (
          <>
            <StepLabel n={3} />
            <h2 className="text-[25px]">Escribí el mensaje</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Va dentro de un sobre que se abre con un clic. Si no se te ocurre nada, dejamos
              un ejemplo cargado.
            </p>
            <Field label="Título (opcional)">
              <Input value={draft.title} onChange={(e) => update("title", e.target.value)} placeholder={occasion.defaultTitle} />
            </Field>
            <Field label="Mensaje">
              <textarea
                maxLength={600}
                value={draft.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={occasion.placeholder}
                className="w-full min-h-[110px] bg-ground border border-line-strong text-text rounded-[11px] px-3.5 py-3 text-[14.5px] leading-[1.6] outline-none transition-colors focus:border-accent resize-y"
              />
              <div className="mt-1.5 text-right font-mono text-[11.5px] text-text-faint">
                {draft.message.length} / 600
              </div>
            </Field>
            <Nav onBack={prev} onNext={next} />
          </>
        )}

        {key === "plan" && (
          <>
            <StepLabel n={4} />
            <h2 className="text-[25px]">¿Qué tan especial va a ser el detalle?</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Esto es una demo: el botón todavía no cobra de verdad, solo activa las funciones
              del plan para que veas la diferencia (ver BACKEND.md para la integración real de
              pagos).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[18px]">
              <PlanCard
                active={draft.plan === "free"}
                title="Clásico"
                price={`${PLAN_PRICING.free.ars} ARS · ≈${PLAN_PRICING.free.usd} (demo)`}
                features={["3 temas visuales", "Contador y mensaje", "Canción", "Fondo con fotos pasando", "Con marca de agua"]}
                onSelect={() => {
                  update("plan", "free");
                  update("photo", "");
                  if (getTheme(draft.theme).premium) update("theme", "romantico");
                }}
                variant="ghost"
              />
              <PlanCard
                active={draft.plan === "premium"}
                title="Edición Especial ✦"
                price={`${PLAN_PRICING.premium.ars} ARS · ≈${PLAN_PRICING.premium.usd} (demo)`}
                features={["Los 5 temas", "Foto destacada", "Cronología de fotos", "Constelación + estadísticas", "Cápsula del tiempo", "Sinastría con IA", "Sin marca de agua"]}
                onSelect={() => update("plan", "premium")}
                variant="gold"
              />
            </div>
            <Nav onBack={prev} onNext={next} />
          </>
        )}

        {key === "extras" && (
          <>
            <StepLabel n={5} />
            <h2 className="text-[25px]">Una canción y una foto</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              La canción está incluida en los dos planes. La foto destacada es exclusiva de la
              Edición Especial — se guarda dentro del link, así que la comprimimos
              automáticamente.
            </p>
            <Field label="Link de YouTube">
              <Input
                type="url"
                value={draft.song}
                onChange={(e) => update("song", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Field>
            <Field label={PLAN_FEATURES[draft.plan].photo ? "Foto destacada" : "Foto destacada — Edición Especial"}>
              {draft.photo ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.photo} alt="" className="w-16 h-16 object-cover rounded-[10px]" />
                  <Button variant="ghost" size="sm" onClick={() => update("photo", "")}>
                    Quitar foto
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  disabled={!PLAN_FEATURES[draft.plan].photo}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoChange(file);
                  }}
                  className="text-[13.5px] text-text-soft file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-[13px] file:text-text disabled:opacity-50"
                />
              )}
            </Field>
            {photoStatus && <p className="mt-2 text-[13px] text-text-soft">{photoStatus}</p>}
            {PLAN_FEATURES[draft.plan].photo && (
              <p className="mt-2 text-[13px] text-text-soft">
                💡 El código QR puede volverse muy denso con foto incluida y no escanear bien en
                algunos celulares — si pasa, compartí el link directo por WhatsApp en vez del QR.
              </p>
            )}

            <div className="mt-7 border-t border-line pt-6">
              <h3 className="text-[16px] text-text">Fondo con fotos pasando</h3>
              <p className="mt-1.5 text-[13px] text-text-soft">
                Hasta {MAX_BACKGROUND_PHOTOS} fotos que van a ir rotando de fondo, detrás de la
                tarjeta. Se suben a un storage aparte, así que no afectan el tamaño del QR.
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {draft.backgroundPhotos.map((url, i) => (
                  <div key={url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-16 h-16 object-cover rounded-[10px]" />
                    <button
                      type="button"
                      onClick={() => removeBackgroundPhoto(i)}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-ground border border-line-strong text-[11px] text-text-soft"
                      aria-label="Quitar foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {draft.backgroundPhotos.length < MAX_BACKGROUND_PHOTOS && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddBackgroundPhoto(file);
                    }}
                    className="text-[13px] text-text-soft file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-[13px] file:text-text"
                  />
                )}
              </div>
              {bgUploadStatus && <p className="mt-2 text-[13px] text-text-soft">{bgUploadStatus}</p>}
            </div>

            {draft.plan === "premium" && (
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="text-[16px] text-text">✦ Cronología</h3>
                <p className="mt-1.5 text-[13px] text-text-soft">
                  Hasta {MAX_TIMELINE_ENTRIES} momentos, cada uno con foto, fecha y un texto
                  corto — para contar la historia paso a paso, no solo con un mensaje.
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {draft.timeline.map((entry, i) => (
                    <div key={entry.url} className="flex gap-3 rounded-[10px] border border-line-strong p-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={entry.url} alt="" className="w-14 h-14 object-cover rounded-[8px] shrink-0" />
                      <div className="flex-1 flex flex-col gap-1.5">
                        <Input
                          type="text"
                          value={entry.date ?? ""}
                          onChange={(e) => updateTimelineEntry(i, { date: e.target.value })}
                          placeholder="Fecha (opcional)"
                          className="text-[12.5px] py-1.5"
                        />
                        <Input
                          type="text"
                          value={entry.caption}
                          onChange={(e) => updateTimelineEntry(i, { caption: e.target.value })}
                          placeholder="¿Qué pasó acá?"
                          className="text-[12.5px] py-1.5"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimelineEntry(i)}
                        className="self-start text-[11px] text-text-faint"
                        aria-label="Quitar momento"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {draft.timeline.length < MAX_TIMELINE_ENTRIES && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddTimelinePhoto(file);
                    }}
                    className="mt-3 text-[13px] text-text-soft file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-[13px] file:text-text"
                  />
                )}
                {timelineUploadStatus && (
                  <p className="mt-2 text-[13px] text-text-soft">{timelineUploadStatus}</p>
                )}
              </div>
            )}

            {draft.plan === "premium" && (
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="text-[16px] text-text">✦ Cápsula del tiempo</h3>
                <p className="mt-1.5 text-[13px] text-text-soft">
                  Una carta extra que queda guardada y solo se puede abrir a partir de una fecha
                  futura — para el próximo aniversario, un cumpleaños, o cuando quieras.
                  Opcional.
                </p>
                <Field label="Se puede abrir a partir de">
                  <Input
                    type="date"
                    value={draft.futureLetterDate}
                    onChange={(e) => update("futureLetterDate", e.target.value)}
                  />
                </Field>
                <Field label="Carta guardada">
                  <textarea
                    value={draft.futureLetterMessage}
                    onChange={(e) => update("futureLetterMessage", e.target.value)}
                    placeholder="Para cuando leas esto, espero que sigamos eligiéndonos..."
                    className="w-full min-h-[90px] bg-ground border border-line-strong text-text rounded-[11px] px-3.5 py-3 text-[14.5px] leading-[1.6] outline-none transition-colors focus:border-accent resize-y"
                  />
                </Field>
              </div>
            )}

            {draft.plan === "premium" && (
              <div className="mt-7 border-t border-line pt-6">
                <h3 className="text-[16px] text-text">✦ Sinastría con IA</h3>
                <p className="mt-1.5 text-[13px] text-text-soft">
                  Calculamos las cartas natales reales de los dos (posiciones astronómicas de
                  verdad) y una IA escribe una lectura de compatibilidad a partir de esos datos.
                  Es para divertirse, no una predicción seria.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <BirthFieldGroup
                    label={draft.from || "De"}
                    value={draft.birthA}
                    onChange={(v) => update("birthA", v)}
                  />
                  <BirthFieldGroup
                    label={draft.to || "Para"}
                    value={draft.birthB}
                    onChange={(v) => update("birthB", v)}
                  />
                </div>

                {synastry ? (
                  <div className="mt-4 rounded-[12px] border border-gold/30 bg-gold/[0.06] p-4">
                    <p className="text-[13px] text-text-soft leading-[1.6]">{synastry.text}</p>
                    <button
                      type="button"
                      onClick={() => setSynastry(null)}
                      className="mt-2 text-[12px] text-text-faint underline underline-offset-4"
                    >
                      Generar de nuevo
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={generateSynastry}
                      disabled={
                        synastryStatus === "loading" ||
                        !draft.birthA.date ||
                        !draft.birthA.place ||
                        !draft.birthB.date ||
                        !draft.birthB.place
                      }
                    >
                      {synastryStatus === "loading" ? "Consultando las estrellas…" : "✦ Generar sinastría"}
                    </Button>
                    {synastryError && (
                      <p className="mt-2 text-[12.5px] text-error">{synastryError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <Nav onBack={prev} onNext={next} />
          </>
        )}

        {key === "tema" && (
          <>
            <StepLabel n={6} />
            <h2 className="text-[25px]">Elegí un tema visual</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Así se va a ver el detalle que reciba {draft.to || "la otra persona"}.
            </p>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-3">
              {THEMES.map((t) => {
                const locked = t.premium && draft.plan === "free";
                return (
                  <Pick
                    key={t.key}
                    active={draft.theme === t.key}
                    className="p-0 overflow-hidden"
                    style={locked ? { opacity: 0.55 } : undefined}
                    onClick={() => {
                      if (locked) {
                        setWizStep(WIZ_STEPS.indexOf("plan"));
                        return;
                      }
                      update("theme", t.key);
                    }}
                  >
                    <span className="flex h-16">
                      {t.swatches.map((sw, i) => (
                        <span key={i} className="flex-1" style={{ background: sw }} />
                      ))}
                    </span>
                    <span className="block px-2 py-2.5 text-[12px]">
                      {t.label}
                      {locked && <span className="text-gold-soft"> ✦</span>}
                    </span>
                  </Pick>
                );
              })}
            </div>
            <Nav onBack={prev} onNext={next} />
          </>
        )}

        {key === "listo" && (
          <>
            <div className="font-mono text-[11.5px] text-text-faint text-center mb-2">
              Último paso
            </div>
            <h2 className="text-[25px]">Así se va a ver el detalle</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Revisalo antes de sellarlo — después vas a poder copiar el link y descargar el QR.
            </p>
            <div className="mt-5 lg:hidden">
              <GiftCard payload={previewPayload} compact />
            </div>
            <Nav onBack={prev} nextLabel="Sellar mi detalle ✦" onFinish={publish} />
          </>
        )}
      </div>

      <aside className="hidden lg:block lg:sticky lg:top-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint text-center">
          Así va tomando forma
        </div>
        <div key={draft.theme} className="mt-4 animate-frame-in">
          <GiftCard payload={previewPayload} compact />
        </div>
        <p className="mt-4 text-center text-[12.5px] text-text-faint">
          Se actualiza con cada dato que cargás.
        </p>
      </aside>
      </div>
    </div>
  );
}

function BirthFieldGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BirthInfo;
  onChange: (v: BirthInfo) => void;
}) {
  return (
    <div className="rounded-[12px] border border-line-strong p-3.5">
      <div className="text-[12.5px] font-semibold text-text-soft mb-2">{label}</div>
      <Field label="Fecha de nacimiento">
        <Input type="date" value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} />
      </Field>
      <label className="mt-2.5 flex items-center gap-2 text-[12.5px] text-text-soft">
        <input
          type="checkbox"
          checked={value.timeKnown}
          onChange={(e) => onChange({ ...value, timeKnown: e.target.checked })}
        />
        Sé la hora exacta
      </label>
      {value.timeKnown && (
        <Field label="Hora de nacimiento">
          <Input type="time" value={value.time} onChange={(e) => onChange({ ...value, time: e.target.value })} />
        </Field>
      )}
      <Field label="Lugar de nacimiento">
        <Input
          value={value.place}
          onChange={(e) => onChange({ ...value, place: e.target.value })}
          placeholder="Ciudad, país"
        />
      </Field>
    </div>
  );
}

function StepLabel({ n }: { n: number }) {
  return (
    <div className="font-mono text-[11.5px] text-text-faint text-center mb-2">
      Paso {n} de 6
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  onFinish,
  nextLabel,
  disabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-between mt-8">
      {onBack ? (
        <Button variant="ghost" onClick={onBack}>
          ← Atrás
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onFinish ?? onNext} disabled={disabled}>
        {nextLabel ?? "Continuar →"}
      </Button>
    </div>
  );
}

function PlanCard({
  active,
  title,
  price,
  features,
  onSelect,
  variant,
}: {
  active: boolean;
  title: string;
  price: string;
  features: string[];
  onSelect: () => void;
  variant: "ghost" | "gold";
}) {
  return (
    <div
      className={`text-left rounded-[16px] border-[1.5px] p-5 ${active ? (variant === "gold" ? "border-gold bg-gold/10" : "border-accent bg-accent/10") : "border-line-strong bg-ground"}`}
    >
      <h4 className="text-[16px]">{title}</h4>
      <div className="mt-1 font-mono text-[13px] text-text-soft">{price}</div>
      <ul className="mt-3 flex flex-col gap-1.5 text-[12.5px] text-text-soft">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Button size="sm" variant={variant} block className="mt-3.5" onClick={onSelect}>
        Elegir {title.replace(" ✦", "")}
      </Button>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreateWizardInner />
    </Suspense>
  );
}
