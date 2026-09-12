# Backend requerido para producción

Esta build es **mock-first**: todo funciona end-to-end en el navegador (localStorage +
lógica cliente), pero nada de esto es un backend real. Este documento es el mapa exacto de
qué falta para pasar a producción, feature por feature. No hay datos falsos presentados como
reales en ningún lado — el dashboard, los pagos y el admin son simulaciones explícitas.

## Autenticación
- **Hoy**: sesión simulada en `localStorage` (`src/lib/mock/auth.ts`), sin contraseñas
  reales, sin verificación de email.
- **Falta**: proveedor real (recomendado: Supabase Auth o Auth.js con Postgres). Modelo
  `User { id, email, password_hash, name, created_at, plan }`. Verificación de email para
  evitar cuentas descartables (relevante porque el producto es de pago único, no suscripción
  — hay incentivo a crear cuentas nuevas para evadir límites si los hubiera).

## Persistencia de páginas
- **Hoy**: `localStorage` (`src/lib/mock/pages.ts`), namespaced por usuario mock. El
  `payload` de cada página sigue siendo base64 autocontenido en la URL — **esto se
  mantiene en producción**, es una ventaja real (el link funciona aunque se pierda la fila
  en la base de datos).
- **Falta**: tabla `Page { id, user_id, slug, occasion, theme, plan, payload_json,
  created_at, view_count }` en Postgres, para que el dashboard liste páginas por usuario
  sin depender de que el navegador tenga el localStorage intacto, y para poder generar URLs
  cortas (`/r/abc123`) en vez de un base64 largo en la URL cuando hay foto.
- **Fotos**: hoy se comprimen a dataURL embebido (igual que el original). Para sacar el
  límite de tamaño de QR con foto, hace falta storage de imágenes (S3/Cloudflare
  R2/Supabase Storage) y servir la foto por URL corta en vez de embebida en el payload.

## Pagos
- **Hoy**: checkout simulado, "aprueba" instantáneo, no mueve dinero.
- **Falta**: integración con **Mercado Pago Checkout Pro** (mercado principal: Argentina) +
  Stripe Checkout para el resto de LATAM/internacional. Webhook de confirmación de pago que
  active el plan Premium en la fila de `Page`/`User` antes de desbloquear temas/foto/canción.

## Admin
- **Hoy**: datos mock generados localmente en `src/lib/mock/admin.ts`, no hay usuarios
  reales que moderar.
- **Falta**: queries reales sobre la tabla `Page`/`User`, sistema de reportes de contenido
  (flag por abuso), roles (`admin`, `soporte`).

## Analítica
- **Hoy**: contador de vistas simulado en el mock.
- **Falta**: tracking real de vistas del visor `/r/[payload]` (tabla `PageView` o servicio
  externo tipo Plausible/PostHog, respetando privacidad — sin cookies de terceros).

## Sinastría con IA (Premium) — esto SÍ es backend real
- **Ya implementado, no es mock**: `POST /api/synastria` (`src/app/api/synastria/route.ts`)
  hace tres llamadas reales:
  1. Geocodifica el lugar de nacimiento de cada persona con **Nominatim** (OpenStreetMap,
     gratis, sin API key).
  2. Calcula la carta natal real de cada uno con `circular-natal-horoscope-js` (ephemeris
     Moshier, MIT, corre local — no llama a ningún servicio externo ni tiene costo) y los
     aspectos cruzados entre ambas cartas (`src/lib/astro/synastry-aspects.ts`).
  3. Le pide a **Gemini** (`GEMINI_API_KEY`, capa gratuita de Google AI Studio) que redacte
     la interpretación en español, **restringida a los datos reales calculados** — el prompt
     (`src/lib/astro/prompt.ts`) le prohíbe inventar otros aspectos.
- El resultado se genera **una sola vez** en el wizard y se guarda como texto dentro del
  payload — ver la página nunca vuelve a llamar a la API. Los datos de nacimiento (fecha,
  hora, lugar) NO se guardan en el link compartido, solo el texto final y los signos — por
  privacidad y para no inflar el payload.
- **Variable de entorno requerida en Vercel**: `GEMINI_API_KEY` (Production). Si se quiere
  iterar en local o en preview deployments, hay que agregarla también en esos entornos desde
  Vercel → Project Settings → Environment Variables.
- **Límite conocido**: la capa gratuita de Gemini tiene un límite de requests por día. Si el
  producto escala en volumen real, este es el primer lugar donde aparecería un costo (pasar a
  un tier pago de Gemini, u otro proveedor).

## SEO / Open Graph
- **Falta en ambos (original y esta build)**: imagen `og:image` real generada por página o
  al menos una genérica de marca — hoy no hay ninguna imagen de preview al compartir.
