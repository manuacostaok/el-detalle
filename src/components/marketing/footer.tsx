import Link from "next/link";
import { Container } from "@/components/ui/container";
import { HeartMark } from "@/components/ui/heart-mark";

const COLUMNS = [
  {
    title: "Producto",
    links: [
      { href: "/como-funciona", label: "Cómo funciona" },
      { href: "/ejemplos", label: "Ejemplos" },
      { href: "/precios", label: "Precio" },
      { href: "/crear", label: "Crear una página" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/login", label: "Iniciar sesión" },
      { href: "/registro", label: "Crear cuenta" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line mt-auto">
      <Container className="py-14 grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5 font-serif text-[19px] font-semibold text-text">
            <span className="block w-[22px] h-[22px] shrink-0">
              <HeartMark />
            </span>
            Un Detalle
          </div>
          <p className="mt-4 max-w-[32ch] text-[13.5px] text-text-faint">
            El gesto de amor que se regala con un link — contador en vivo, mensaje y hasta
            las estrellas de los dos. Sin apps, sin cuentas para verla.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <div className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-text-faint">
              {col.title}
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13.5px] text-text-soft transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12.5px] text-text-faint">
        <span>© {new Date().getFullYear()} Un Detalle — gestos de amor para regalar.</span>
        <span>Hecho en Argentina 💞</span>
      </Container>
    </footer>
  );
}
