import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/container";
import { RevealSection } from "@/components/motion/reveal-section";
import { OCCASIONS, THEMES } from "@/lib/domain";

export const metadata: Metadata = {
  title: "Cómo funciona",
  description:
    "Tres pasos para armar tu página de regalo: contá la historia, elegí un tema y compartí el QR. Sin cuentas, sin apps para verla.",
};

const DETAILED_STEPS = [
  {
    num: "01",
    title: "Elegí el vínculo y contá la historia",
    body: "Arrancás eligiendo para quién es: pareja, amigos, familia, mascota o un aniversario puntual. Eso ajusta el tono del contador (\"Juntos hace\", \"Amigos hace\"...) y te sugiere un mensaje de ejemplo que podés editar o reemplazar por completo.",
  },
  {
    num: "02",
    title: "Sumá una canción y fotos (opcional)",
    body: "La canción está en los dos planes — un link de YouTube que se muestra como botón. Las fotos de fondo también están en Básico; con Premium sumás una foto destacada en la tarjeta y una cronología de varios momentos.",
  },
  {
    num: "03",
    title: "Elegí uno de los cinco temas visuales",
    body: "Romántico, Boho cálido, Minimal, Nocturno o Divertido. Cada uno tiene su propia paleta y personalidad — la vista previa te muestra exactamente cómo la va a ver la otra persona antes de publicar.",
  },
  {
    num: "04",
    title: "Publicá y compartí el link o el QR",
    body: "Tu página queda lista al instante, en un link único que no depende de ningún servidor — funciona para siempre, aunque Un Detalle deje de existir. Descargá el QR para imprimir en una tarjeta, un llavero o mandalo directo por WhatsApp.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h1 className="mt-3 max-w-[720px] text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
          De la idea al QR en menos de cinco minutos.
        </h1>
        <p className="mt-4 max-w-[56ch] text-[16px] text-text-soft">
          No hay formularios eternos ni cuenta que crear para empezar. Así es el camino
          completo, paso a paso.
        </p>
      </Container>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <RevealSection className="flex flex-col gap-10">
            {DETAILED_STEPS.map((step) => (
              <div
                key={step.num}
                className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4 sm:gap-8 border-b border-line pb-10 last:border-0 last:pb-0"
              >
                <div className="font-mono text-[15px] text-gold-soft">{step.num}</div>
                <div>
                  <h2 className="text-[22px] sm:text-[26px]">{step.title}</h2>
                  <p className="mt-3 max-w-[62ch] text-[15px] text-text-soft leading-[1.65]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </RevealSection>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Para quién"
            title="Un vínculo, un contador con su propio nombre."
            description="El contador y el mensaje sugerido cambian según la ocasión que elijas."
          />
          <RevealSection className="mt-11 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {OCCASIONS.map((o) => (
              <div
                key={o.key}
                className="rounded-[14px] border border-line bg-surface px-3.5 py-[18px] text-center"
              >
                <div className="text-[26px]">{o.emoji}</div>
                <h4 className="mt-2.5 text-[13.5px] font-semibold text-text">{o.label}</h4>
                <p className="mt-1 text-[12px] text-text-faint">{o.counterLabel}…</p>
              </div>
            ))}
          </RevealSection>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Temas" title="Cinco mundos visuales distintos." />
          <RevealSection className="mt-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {THEMES.map((t) => (
              <div key={t.key} className="rounded-[16px] border border-line overflow-hidden">
                <div className="h-[100px] flex">
                  {t.swatches.map((sw, i) => (
                    <div key={i} className="flex-1" style={{ background: sw }} />
                  ))}
                </div>
                <div className="p-[18px] bg-surface">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-semibold">{t.label}</h4>
                    {t.premium && (
                      <span className="font-mono text-[10px] text-gold-soft">Premium</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] text-text-faint">{t.description}</p>
                </div>
              </div>
            ))}
          </RevealSection>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-[clamp(26px,3.6vw,38px)] max-w-[560px]">
            ¿Ya tenés en mente para quién es?
          </h2>
          <Button href="/crear">Crear mi página</Button>
        </Container>
      </section>
    </>
  );
}
