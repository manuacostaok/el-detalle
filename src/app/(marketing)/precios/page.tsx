import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/container";
import { RevealSection } from "@/components/motion/reveal-section";

export const metadata: Metadata = {
  title: "Precio",
  description:
    "Un pago único, sin suscripciones. Básico $10.000 ARS o Premium $25.000 ARS — el link queda activo para siempre.",
};

const FAQ_PRICING = [
  {
    q: "¿Es una suscripción?",
    a: "No. Es un pago único por página. El link queda activo para siempre, sin cobros mensuales ni renovación.",
  },
  {
    q: "¿Puedo pagar en dólares?",
    a: "La referencia en dólares es orientativa para fuera de Argentina. El cobro real se hace en la moneda local que definas al conectar el medio de pago (ver nota abajo).",
  },
  {
    q: "¿Qué pasa si la página deja de existir?",
    a: "No depende de que Un Detalle siga activo: todos los datos de tu página viven codificados en el link mismo, así que sigue funcionando aunque el sitio original cambie.",
  },
];

export default function PreciosPage() {
  return (
    <>
      <Container className="py-16 sm:py-20 flex flex-col items-center text-center gap-5">
        <Eyebrow>Precio</Eyebrow>
        <h1 className="max-w-[640px] text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
          Un pago único. Nada de suscripciones.
        </h1>
        <p className="max-w-[540px] text-[16px] text-text-soft">
          Pagás una vez y el link queda activo para siempre — sin mensualidades. Fuera de
          Argentina, la referencia es en dólares como base de precio, no como cobro automático
          en varias monedas.
        </p>
      </Container>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <RevealSection className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-8">
              <h3 className="text-[20px]">Básico</h3>
              <div className="font-mono text-[38px] text-text">
                $10.000<span className="text-[14px] text-text-faint"> ARS pago único · ≈US$7</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-[14px] text-text-soft">
                <li>✓ 3 temas visuales (Romántico, Boho, Minimal)</li>
                <li>✓ Contador en vivo y mensaje</li>
                <li>✓ Una canción</li>
                <li>✓ Fondo con hasta 3 fotos pasando</li>
                <li>✓ Link y QR para compartir</li>
                <li>✓ Marca de agua «Hecho con Un Detalle»</li>
              </ul>
              <Button href="/crear?plan=free" variant="ghost" block>
                Crear con Básico
              </Button>
            </div>

            <div className="relative flex flex-col gap-[18px] rounded-[20px] border border-gold bg-linear-to-b from-surface-2 to-surface p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-gold px-3 py-1 font-mono text-[10.5px] font-bold text-ink">
                Más elegido
              </span>
              <h3 className="text-[20px]">Premium</h3>
              <div className="font-mono text-[38px] text-text">
                $25.000<span className="text-[14px] text-text-faint"> ARS pago único · ≈US$17</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-[14px] text-text-soft">
                <li>✓ Todo lo del plan Básico</li>
                <li>✓ Los 5 temas, incluidos Nocturno y Divertido</li>
                <li>✓ Una foto destacada en la tarjeta</li>
                <li>✓ Cronología: hasta 5 momentos con foto, fecha y texto</li>
                <li>✓ Su propia constelación + estadísticas de la relación</li>
                <li>✓ Cápsula del tiempo: una carta que se abre en el futuro</li>
                <li>✓ Sinastría astrológica real, escrita con IA</li>
                <li>✓ Sin marca de agua</li>
              </ul>
              <Button href="/crear?plan=premium" variant="gold" block>
                Crear con Premium
              </Button>
              <div className="font-mono text-[12.5px] text-text-faint">
                Costo de mantener cada página: prácticamente $0.
              </div>
            </div>
          </RevealSection>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Preguntas sobre el precio" title="Lo que suelen preguntar antes de pagar." />
          <RevealSection className="mt-10 flex flex-col gap-6 max-w-[680px]">
            {FAQ_PRICING.map((item) => (
              <div key={item.q}>
                <h3 className="text-[16px] font-semibold text-text">{item.q}</h3>
                <p className="mt-2 text-[14.5px] text-text-soft leading-[1.6]">{item.a}</p>
              </div>
            ))}
          </RevealSection>
          <p className="mt-8 text-[13px] text-text-faint">
            Más preguntas en{" "}
            <Link href="/faq" className="underline underline-offset-4 hover:text-text">
              la sección de FAQ
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
