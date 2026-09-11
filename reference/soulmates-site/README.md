# Soulmates — listo para Vercel

Sitio estático, sin build ni backend: es un solo `index.html` con todo adentro (landing, asistente de creación y la página que recibe quien escanea el QR). No necesita Node, ni base de datos, ni variables de entorno para funcionar tal cual está.

## Qué hay en esta carpeta

- `index.html` — el sitio completo.
- `icon.svg` — el logo (el corazón partido en dos mitades a juego), en SVG editable.
- `favicon.ico`, `favicon-32.png`, `favicon-180.png` — el favicon ya generado a partir del logo, en los formatos que los navegadores y iOS piden.
- `logo-512.png` — versión en alta resolución del logo, por si la necesitás para otra pieza (redes, app icon, etc).
- `vercel.json` — configuración mínima (URLs limpias).

## Deploy en Vercel

**Opción 1 — Arrastrar y soltar (más rápido):**
1. Entrá a [vercel.com/new](https://vercel.com/new).
2. Arrastrá esta carpeta entera a la ventana de import.
3. Deploy. Listo — te da una URL `algo.vercel.app` al toque.

**Opción 2 — Con la CLI (si ya tenés Claude Code / terminal a mano):**
```bash
npm i -g vercel
cd soulmates-site
vercel          # deploy de prueba
vercel --prod   # deploy a producción, con el dominio final
```

**Opción 3 — Conectado a GitHub:** subí esta carpeta a un repo y hacé "Import Project" desde el dashboard de Vercel. Cada push a `main` va a redeployar solo.

## Dominio propio

Una vez deployado, en el dashboard del proyecto → **Settings → Domains** podés agregar tu dominio (por ejemplo `soulmates.app` o `.com.ar`, lo que hayas comprado). Sin dominio propio, el link de Vercel (`tuproyecto.vercel.app`) ya es un link público y estable — sirve para probar y hasta para los primeros anuncios.

## Cosas para ajustar antes de vender en serio

- **Precios**: hoy están escritos a mano en el HTML ($10.000 / $25.000 ARS y sus equivalentes en USD). Buscá esos valores en `index.html` si cambian.
- **Pagos**: el botón de plan Premium activa las funciones visualmente pero no cobra de verdad todavía — falta conectar Mercado Pago (o Stripe para afuera de Argentina).
- **Fotos**: cada página guarda su contenido codificado en el link mismo (no hay servidor ni base de datos), lo cual la hace gratis de mantener — pero si alguien agrega una foto, el link se alarga y el código QR puede quedar muy denso para escanear. Es un aviso que ya está en la app; para sacarlo del todo hace falta un backend con almacenamiento de imágenes.
- **Open Graph**: dejé los meta tags de título y descripción para cuando compartan el link en WhatsApp/redes, pero falta una imagen de vista previa (`og:image`) — se puede sumar cuando tengas el dominio final.
