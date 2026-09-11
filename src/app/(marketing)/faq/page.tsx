import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Todo lo que preguntan antes de crear su página: precio, privacidad, edición, QR y más.",
};

const FAQ_GROUPS = [
  {
    group: "Sobre crear tu página",
    items: [
      {
        q: "¿Necesito crear una cuenta?",
        a: "No. Podés armar y publicar tu página sin registrarte. Si creás una cuenta gratis, además vas a poder ver todas tus páginas creadas en un solo lugar y editarlas más adelante.",
      },
      {
        q: "¿Puedo editar la página después de publicarla?",
        a: "Si la guardaste en tu cuenta, sí — desde \"Mis páginas\" podés volver a abrir el wizard con los mismos datos y republicar. Si la creaste sin cuenta, el link original queda fijo: para cambiar algo tenés que crear una página nueva.",
      },
      {
        q: "¿Qué pasa si mi mensaje es muy largo?",
        a: "El mensaje tiene un límite de 600 caracteres — suficiente para contar bien la historia sin que la página quede sobrecargada.",
      },
    ],
  },
  {
    group: "Sobre el link y el QR",
    items: [
      {
        q: "¿Dónde vive la información de mi página?",
        a: "Codificada en el link mismo. No hay una base de datos externa de la que dependa para funcionar — por eso el link sigue funcionando incluso si en algún momento no tenés conexión con nuestros servidores.",
      },
      {
        q: "¿Por qué el QR a veces no escanea bien?",
        a: "Si tu página incluye una foto, el link es más largo y el QR queda más denso — algunos celulares más viejos pueden tener problemas para leerlo. En ese caso, compartí el link directo por WhatsApp en lugar del QR.",
      },
      {
        q: "¿El link expira?",
        a: "No. Una vez publicado, el link queda activo para siempre — no hay una fecha de vencimiento ni un costo de mantenimiento que pueda hacer que se caiga.",
      },
    ],
  },
  {
    group: "Sobre el pago",
    items: [
      {
        q: "¿Es una suscripción?",
        a: "No, es un pago único por página. Ver el detalle completo en la página de precios.",
      },
      {
        q: "¿Qué diferencia hay entre Básico y Premium?",
        a: "Básico incluye 3 temas visuales, contador y mensaje, con una marca de agua sutil. Premium suma los 5 temas, foto, canción y quita la marca de agua.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Container className="py-16 sm:py-20">
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h1 className="mt-3 max-w-[640px] text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
          Todo lo que preguntan antes de crear la suya.
        </h1>
      </Container>

      <section className="border-t border-line py-16 sm:py-20">
        <Container className="max-w-[760px] mx-auto flex flex-col gap-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.group}>
              <h2 className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold-soft">
                {group.group}
              </h2>
              <FaqAccordion items={group.items} />
            </div>
          ))}
        </Container>
      </section>

      <section className="border-t border-line py-16 sm:py-20">
        <Container className="flex flex-col items-center text-center gap-5">
          <h2 className="text-[22px] max-w-[480px]">¿No encontraste tu pregunta?</h2>
          <Button href="/crear" variant="ghost">
            Probá el wizard directamente →
          </Button>
        </Container>
      </section>
    </>
  );
}
