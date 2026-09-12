# El Detalle

Un regalo digital de verdad — no una landing, no una app de citas. Alguien prepara una
página personalizada para una persona especial (pareja, amigos, familia, mascota,
aniversario) y se la entrega con un link o un QR. Quien la recibe abre un sobre con un
sello de lacre antes de ver el contenido: un contador en vivo del tiempo que llevan
juntos, su mensaje, y — en el plan Edición Especial — una cronología de fotos, la
constelación de la pareja, estadísticas de la relación, una cápsula del tiempo, y una
sinastría astrológica real interpretada con IA.

Ver [DESIGN.md](./DESIGN.md) para la dirección de marca y el sistema de diseño completo,
y [BACKEND.md](./BACKEND.md) para el mapa exacto de qué es real y qué es mock hoy.

## Producción

**https://eldetalle.app** apunta hoy a un deploy en Vercel (alias real:
`un-detalle.vercel.app` / `soulmates-site.vercel.app`, del nombre de proyecto original).

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Anime.js v4** para el motion (la apertura del sobre, reveals con scroll)
- **circular-natal-horoscope-js** — cálculo real de cartas natales (ephemeris Moshier,
  MIT, sin costo, corre local)
- **Gemini API** (capa gratuita) — redacta la interpretación de la sinastría a partir de
  los datos reales calculados, nunca inventa astrología
- **Nominatim (OpenStreetMap)** — geocodifica el lugar de nacimiento, gratis, sin API key
- **Vercel Blob** — storage real de fotos (fondo animado y cronología), para que el link/QR
  no dependa de imágenes embebidas
- **localStorage** — sesión de usuario y "mis detalles" guardados; es un mock explícito,
  ver BACKEND.md para qué falta para producción real

## Arquitectura

```
src/app/
  (marketing)/        landing pública — /, /como-funciona, /precios, /ejemplos, /faq
  (auth)/             /login, /registro (mock)
  crear/               wizard de creación — sin login, funciona sin cuenta
  r/[payload]/         el visor público que abre el destinatario (SSR, sin auth)
  app/                 dashboard de "mis detalles" (requiere sesión mock)
  admin/               panel de admin (datos de ejemplo, sin backend real todavía)
  api/synastria/        calcula cartas natales + redacta la sinastría con Gemini
  api/upload-photo/     sube una imagen a Vercel Blob

src/components/
  gift/                lo que arma la página del destinatario (EnvelopeReveal, GiftCard,
                       ConstellationCard, LoveStats, PhotoTimeline, SynastryCard, ...)
  wizard/              pantallas del flujo de creación (ShareScreen = "entrega")
  marketing/           landing
  ui/                  primitivos (Button, SealMark, QrCode, ...)

src/lib/
  domain.ts            tipos y datos centrales (ocasiones, temas, planes, payload)
  payload.ts           codifica/decodifica el payload en base64url para el link
  astro/               ephemeris + geocoding + prompt + llamada a Gemini
  mock/                auth y storage de páginas, todo en localStorage
```

El link ES los datos: cada página se codifica en base64 en la URL misma (`/r/<payload>`),
así que funciona sin depender de que haya un servidor con esa fila en una base de datos.
Fotos y sinastría viven aparte (Blob / generadas una sola vez y cacheadas en el payload)
para no inflar el link.

## Variables de entorno

| Variable | Dónde se usa | Requerida |
|---|---|---|
| `GEMINI_API_KEY` | `/api/synastria` — redacción de la sinastría | Sí, para esa feature |
| `BLOB_READ_WRITE_TOKEN` | `/api/upload-photo` — storage de fotos | La inyecta Vercel al conectar un Blob store, no hace falta setearla a mano |

**Nunca subas `.env`, `.env.local` ni ningún token a git** — ya están en `.gitignore`.
Para conseguir una key de Gemini gratis: https://aistudio.google.com/apikey.

## Instalación local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. La sinastría y la subida de fotos necesitan las variables de
entorno de arriba — sin ellas, esas dos features fallan con un error claro pero el resto
del sitio funciona igual.

## Deploy

```bash
vercel --prod
```

El proyecto ya está linkeado (`.vercel/project.json`). Las env vars de Production ya están
cargadas en el proyecto de Vercel — para probarlas en local o en preview deployments hace
falta agregarlas también en esos entornos desde el dashboard de Vercel.

## Planes

| | Clásico | Edición Especial |
|---|---|---|
| Precio | $10.000 ARS | $25.000 ARS |
| Temas | 3 | Los 5 |
| Contador + mensaje | ✓ | ✓ |
| Canción | ✓ | ✓ |
| Fondo con fotos rotando | ✓ (hasta 3) | ✓ (hasta 3) |
| Foto destacada | — | ✓ |
| Cronología (fotos + fechas + texto) | — | ✓ (hasta 5) |
| Constelación + estadísticas | — | ✓ |
| Cápsula del tiempo | — | ✓ |
| Sinastría real con IA | — | ✓ |
| Marca de agua | Sí | No |

Los pagos son simulados hoy (ver BACKEND.md) — no hay integración real con Mercado Pago
todavía.
