import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/container";
import { HeroPreviewCard } from "@/components/marketing/hero-preview-card";
import { PremiumDemoShowcase } from "@/components/marketing/premium-demo-showcase";
import { OccasionThemeShowcase } from "@/components/marketing/occasion-theme-showcase";
import { HomeIntro } from "@/components/marketing/home-intro";
import { RevealSection } from "@/components/motion/reveal-section";
import { OCCASIONS, THEMES } from "@/lib/domain";

const STEPS = [
  {
    num: "01",
    title: "Contá la historia",
    body: "Elegí el vínculo, los nombres, la fecha y escribí el mensaje. Con ejemplos listos si no sabés por dónde arrancar.",
  },
  {
    num: "02",
    title: "Elegí un tema",
    body: "Cinco estilos visuales bien distintos entre sí — de romántico clásico a minimalista — y una canción si querés.",
  },
  {
    num: "03",
    title: "Compartí el QR",
    body: "Tu página vive en un link único. Descargá el QR para una tarjeta, un llavero o para mandarlo directo por WhatsApp.",
  },
];

const COMPARISON = [
  { feature: "Tipos de vínculo", us: "Pareja, amistad, familia, mascota, aniversario", them: "Casi siempre, solo pareja" },
  { feature: "Temas visuales", us: "5 estilos, bien distintos", them: "1 o 2 variantes de color" },
  { feature: "Cuenta / registro", us: "No hace falta", them: "A veces piden cuenta", usGood: true },
  { feature: "Dónde vive el link", us: "En el link mismo — no depende de un servidor", them: "En un servidor propio" },
  { feature: "Código QR", us: "Incluido, descargable", them: "A veces es un extra pago", usGood: true },
  { feature: "Precio", us: "$10.000 o $25.000 ARS, pago único", them: "Entre US$3 y US$10 (en dólares)" },
];

export default function LandingPage() {
  return (
    <>
      <HomeIntro />
      <Container className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-11 lg:gap-14 items-center py-14 lg:py-20">
        <div>
          <Eyebrow>Gestos de amor digitales · sin apps, sin cuentas</Eyebrow>
          <h1 className="mt-3 text-[clamp(34px,5vw,54px)] leading-[1.05] tracking-[-0.01em]">
            Esto no es un mensaje.
            <br />
            <em className="font-medium italic text-gold-soft">Es un detalle.</em>
          </h1>
          <p className="mt-[18px] max-w-[46ch] text-[17px] text-text-soft">
            Armá en minutos un regalo digital de verdad: su nombre, un contador en vivo del
            tiempo que llevan juntos, y un ritual para abrir tu mensaje — para pareja, amigos,
            familia o hasta la mascota. Se entrega con un link o un código QR para imprimir.
          </p>
          <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
            <Button href="/crear">Crear mi detalle</Button>
            <Button href="/precios" variant="link">
              Ver precios ↓
            </Button>
          </div>
          <div className="mt-3.5 font-mono text-[13px] text-text-faint">
            ✓ Sin registrarte &nbsp; ✓ Listo en 5 minutos &nbsp; ✓ El link es para siempre
          </div>
        </div>
        <HeroPreviewCard />
      </Container>

      <section className="border-t border-line py-16 sm:py-24 bg-surface/30">
        <Container className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <Eyebrow>Lo que realmente estás comprando</Eyebrow>
            <h2 className="mt-3 text-[clamp(26px,3.6vw,38px)] max-w-[520px]">
              La Edición Especial no es &ldquo;más funciones&rdquo;. Es otra experiencia.
            </h2>
            <p className="mt-4 max-w-[46ch] text-[15.5px] text-text-soft">
              Constelación única de la pareja, su sinastría real interpretada con IA,
              estadísticas de la relación, una carta que se abre en el futuro — todo esto
              es contenido real generado por el producto, no una captura de pantalla. Mirá
              cómo se va turnando acá al lado (o tocá los puntos para saltar).
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/crear?plan=premium" variant="gold">
                Preparar la Edición Especial
              </Button>
              <Button href="/ejemplos" variant="ghost">
                Ver ejemplos reales →
              </Button>
            </div>
          </div>
          <PremiumDemoShowcase />
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Por qué esto y no un mensaje"
            title="Un mensaje se hunde entre cien más. Un detalle, no."
            description="Le escribís algo lindo por WhatsApp y a las dos horas ya está enterrado bajo memes y notas de voz. Esto es otra cosa: un momento propio, con su fecha, su contador y su propio ritual para abrirlo — para volver a visitarlo las veces que quiera, no solo una vez."
          />
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20" id="como-funciona">
        <Container>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Tres pasos, ningún formulario eterno."
            description={
              <>
                Todo el paso a paso está en{" "}
                <Link href="/como-funciona" className="underline underline-offset-4 hover:text-text">
                  cómo funciona
                </Link>
                .
              </>
            }
          />
          <RevealSection className="mt-11 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-[18px] border border-line bg-surface p-[26px]"
              >
                <div className="font-mono text-[13px] text-gold-soft">{step.num}</div>
                <h3 className="mt-3.5 text-[19px]">{step.title}</h3>
                <p className="mt-2.5 text-[14px] text-text-soft">{step.body}</p>
              </div>
            ))}
          </RevealSection>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20" id="temas">
        <Container>
          <SectionHeading
            eyebrow="Más que parejas"
            title="Un formato para cada vínculo, y un tema para cada historia."
            description="La mayoría de estas páginas son solo para parejas. Acá también hay lugar para amigos, familia, mascotas y aniversarios — y cinco temas visuales para elegir."
          />
          <OccasionThemeShowcase occasions={OCCASIONS} themes={THEMES} />
          <div className="mt-8">
            <Button href="/ejemplos" variant="ghost" size="sm">
              Ver la galería completa →
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="La comparación honesta"
            title="En qué se parece a otras páginas de regalo, y en qué no."
          />
          <div className="mt-11 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[14.5px]">
              <thead>
                <tr>
                  <th className="text-left border-b border-line py-3.5 px-0" />
                  <th className="text-left border-b border-line py-3.5 px-4 font-mono text-[12px] uppercase tracking-[0.06em] text-text-faint font-semibold">
                    El Detalle
                  </th>
                  <th className="text-left border-b border-line py-3.5 px-4 font-mono text-[12px] uppercase tracking-[0.06em] text-text-faint font-semibold">
                    La mayoría de las otras
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td className="border-b border-line py-3.5 px-0 text-text-soft">{row.feature}</td>
                    <td
                      className={`border-b border-line py-3.5 px-4 font-semibold ${row.usGood ? "text-gold-soft" : "text-text"}`}
                    >
                      {row.us}
                    </td>
                    <td className="border-b border-line py-3.5 px-4 text-text-faint">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20" id="precio">
        <Container className="flex flex-col items-center text-center gap-5">
          <Eyebrow>Precio</Eyebrow>
          <h2 className="text-[clamp(26px,3.4vw,36px)] max-w-[560px]">
            Un pago único. Nada de suscripciones.
          </h2>
          <p className="max-w-[520px] text-[15.5px] text-text-soft">
            Pagás una vez y el link queda activo para siempre. Desde $10.000 ARS, sin
            mensualidades.
          </p>
          <Button href="/precios" variant="gold">
            Ver planes y precios
          </Button>
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-[clamp(28px,4vw,42px)] max-w-[600px]">
            La próxima vez que quieras decirle algo a alguien, no le mandes un mensaje más.
            <em className="font-medium italic text-gold-soft"> Dejale un detalle. </em>
          </h2>
          <Button href="/crear" size="md">
            Crear mi detalle ahora
          </Button>
        </Container>
      </section>
    </>
  );
}
