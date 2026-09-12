import type { Metadata } from "next";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ExampleGrid } from "@/components/marketing/example-grid";

export const metadata: Metadata = {
  title: "Ejemplos",
  description:
    "Una galería de páginas de ejemplo, una por cada combinación de ocasión y tema — mirá cómo se ven antes de crear la tuya.",
};

export default function EjemplosPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <Eyebrow>Ejemplos</Eyebrow>
        <h1 className="mt-3 max-w-[680px] text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
          Páginas reales, hechas con El Detalle.
        </h1>
        <p className="mt-4 max-w-[56ch] text-[16px] text-text-soft">
          Cada tarjeta de acá abajo es una página funcional de verdad — hacé clic para abrirla
          tal cual la vería la persona que la recibe, con su contador en vivo.
        </p>
      </Container>

      <section className="border-t border-line py-14 sm:py-16">
        <Container>
          <ExampleGrid />
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-24">
        <Container className="flex flex-col items-center text-center gap-6">
          <SectionHeading
            className="items-center text-center"
            eyebrow="¿Viste algo que te gustó?"
            title="Armá la tuya con el tema que más te cerró."
          />
          <Button href="/crear">Crear mi página</Button>
        </Container>
      </section>
    </>
  );
}
