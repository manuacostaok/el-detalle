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
import type { SynastryResult } from "@/lib/domain";

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
};

function CreateWizardInner() {
  const searchParams = useSearchParams();
  const user = useSession();
  const initialPlan = searchParams.get("plan") === "premium" ? "premium" : "free";

  const [draft, setDraft] = useState<Draft>({ ...EMPTY_DRAFT, plan: initialPlan });
  const [wizStep, setWizStep] = useState(0);
  const [photoStatus, setPhotoStatus] = useState<string | null>(null);
  const [published, setPublished] = useState<{ link: string; b64Length: number; saved: boolean } | null>(null);
  const [synastry, setSynastry] = useState<SynastryResult | null>(null);
  const [synastryStatus, setSynastryStatus] = useState<"idle" | "loading" | "error">("idle");
  const [synastryError, setSynastryError] = useState<string | null>(null);

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
    };
    const b64 = encodePayload(payload);
    const link = `${window.location.origin}/r/${b64}`;
    let saved = false;
    if (user && user !== "loading") {
      createPage(user.id, payload);
      saved = true;
    }
    setPublished({ link, b64Length: b64.length, saved });
  }

  function reset() {
    setPublished(null);
    setWizStep(0);
    setDraft({ ...EMPTY_DRAFT, plan: "free" });
    setSynastry(null);
    setSynastryStatus("idle");
    setSynastryError(null);
  }

  if (published) {
    return <ShareScreen link={published.link} b64Length={published.b64Length} saved={published.saved} onCreateAnother={reset} />;
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
    <div className="mx-auto max-w-[760px] px-6 pt-10 pb-24">
      <div className="flex items-center justify-between mb-[30px]">
        <Link href="/" className="rounded-full border border-line-strong px-4 py-2 text-[13px] text-text hover:border-text-soft">
          ← Salir
        </Link>
        <div className="flex flex-1 gap-1.5 mx-6">
          {WIZ_STEPS.slice(0, -1).map((s, i) => (
            <i
              key={s}
              className={`flex-1 h-[3px] rounded-full ${i <= wizStep ? "bg-accent" : "bg-line-strong"}`}
            />
          ))}
        </div>
        <div className="w-[74px]" />
      </div>

      <div className="rounded-[22px] border border-line bg-surface p-6 sm:p-[38px]">
        {key === "ocasion" && (
          <>
            <StepLabel n={1} />
            <h2 className="text-[25px]">¿Para quién es esta página?</h2>
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
            <Field label={occasion.counterLabel}>
              <Input type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} />
            </Field>
            <Nav onBack={prev} onNext={next} />
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
            <h2 className="text-[25px]">Elegí un plan</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Esto es una demo: el botón todavía no cobra de verdad, solo activa las funciones
              del plan para que veas la diferencia (ver BACKEND.md para la integración real de
              pagos).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-[18px]">
              <PlanCard
                active={draft.plan === "free"}
                title="Básico"
                price={`${PLAN_PRICING.free.ars} ARS · ≈${PLAN_PRICING.free.usd} (demo)`}
                features={["3 temas visuales", "Contador y mensaje", "Con marca de agua"]}
                onSelect={() => {
                  update("plan", "free");
                  update("photo", "");
                  update("song", "");
                  if (getTheme(draft.theme).premium) update("theme", "romantico");
                }}
                variant="ghost"
              />
              <PlanCard
                active={draft.plan === "premium"}
                title="Premium ✦"
                price={`${PLAN_PRICING.premium.ars} ARS · ≈${PLAN_PRICING.premium.usd} (demo)`}
                features={["Los 5 temas", "Foto + canción", "Constelación + estadísticas", "Cápsula del tiempo", "Sinastría con IA", "Sin marca de agua"]}
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
              Ambas son opcionales y quedan disponibles en el plan Premium. La foto se guarda
              dentro del link (no hay servidor de por medio), así que la comprimimos
              automáticamente.
            </p>
            <Field label={PLAN_FEATURES[draft.plan].song ? "Link de YouTube" : "Link de YouTube — Premium"}>
              <Input
                type="url"
                disabled={!PLAN_FEATURES[draft.plan].song}
                value={draft.song}
                onChange={(e) => update("song", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Field>
            <Field label={PLAN_FEATURES[draft.plan].photo ? "Foto" : "Foto — Premium"}>
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
              Así se va a ver la página que reciba {draft.to || "la otra persona"}.
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
              Vista previa
            </div>
            <h2 className="text-[25px]">Así se va a ver</h2>
            <p className="mt-2 text-[14px] text-text-soft">
              Revisá todo antes de publicar — después vas a poder copiar el link y descargar el
              QR.
            </p>
            <div className="mt-5">
              <GiftCard payload={previewPayload} compact />
            </div>
            <Nav onBack={prev} nextLabel="Publicar mi página" onFinish={publish} />
          </>
        )}
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
}: {
  onBack?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  nextLabel?: string;
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
      <Button onClick={onFinish ?? onNext}>{nextLabel ?? "Continuar →"}</Button>
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
