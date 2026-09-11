# Soulmates — Design & Product Source of Truth

## 0. Qué es Soulmates (auditoría del material original)

El zip entregado (`reference/soulmates-site/index.html`) **no es una app de citas**. Es un
producto ya validado conceptualmente: un generador de **páginas de regalo digital** con
contador de tiempo en vivo ("Juntos hace X años, Y meses, Z días"), mensaje, foto y canción
opcional, para parejas, amigos, familia, mascotas y aniversarios. Se comparte con un link o
un QR. Pago único, sin cuentas, sin servidor — el contenido vive codificado en el link
(base64 en el hash de la URL).

**Decisión de producto (confirmada con el usuario):** expandimos ESTE producto — no lo
reemplazamos por una app de matching. La v1 ya tenía un modelo de negocio claro (pago único,
costo marginal ~$0, buen margen). El trabajo es llevarlo de "demo de un solo archivo HTML" a
"producto digital completo": cuentas, dashboard de páginas creadas, pagos reales, landing de
conversión, panel de administración.

### Fortalezas a preservar
- Identidad visual ya distintiva: serif editorial (Fraunces) + sans utilitaria (Work Sans) +
  mono para datos/contador (IBM Plex Mono). Paleta ground oscuro aubergine + acentos burdeos
  y dorado + tarjetas "paper" cálidas. Nada de esto es genérico — se mantiene y se extiende.
- El mecanismo de "el link ES los datos" (sin backend) es una ventaja real de producto
  (gratis de mantener, funciona sin fricción). Se preserva como el motor del visor público
  `/r/[payload]`, incluso con cuentas reales encima.
- Copy en español rioplatense, cálido, sin jerga corporativa — se mantiene ese tono en todo
  el contenido nuevo.
- Los 5 temas visuales del visor (Romántico, Boho, Minimal, Nocturno, Divertido) están bien
  diferenciados entre sí — base sólida para ampliar la galería de temas.

### Debilidades / huecos de producto
- Todo vive en un solo `index.html` con manipulación manual del DOM — no hay componentes,
  no hay tipos, no hay SEO real (una sola ruta), no hay cuentas ni forma de recuperar/editar
  una página ya creada (si perdés el link, perdiste la página).
- No hay rutas públicas de marketing (`/como-funciona`, `/precios`, `/faq`) — todo es anclas
  dentro de una landing única, lo cual limita SEO y capacidad de reenganche.
- Pagos, autenticación y persistencia de páginas son 100% simulados (el propio README lo
  admite). No hay panel de admin.
- No hay motion system: solo dos animaciones puntuales (heartbeat, reveal del corazón).

## 1. Estrategia de producto

Objetivo: que un cliente potencial entre y perciba un **producto real**, no una demo.

Arquitectura de producto (confirmada, mock-first — ver `BACKEND.md` para lo que falta
conectar a un backend real):

```
Marketing público            App (requiere cuenta mock)      Admin (mock)
/                             /app (mis páginas)               /admin (overview)
/como-funciona                /app/paginas/[id]                /admin/paginas
/precios                      /app/cuenta                      /admin/usuarios
/ejemplos
/faq
/crear   (wizard, SIN login — se preserva "no hace falta cuenta")
/login
/registro

Visor público (sin login, siempre):
/r/[payload]   -> reemplaza el antiguo #/g/<b64>
```

Decisión de UX clave: el wizard de creación (`/crear`) sigue sin requerir cuenta — es el
diferencial de marketing original ("✓ Sin registrarte"). Si hay sesión activa al publicar,
la página se guarda automáticamente en el dashboard (`/app`). Si no hay sesión, se ofrece
"Iniciar sesión para guardarla" como opción, sin bloquear el link/QR que ya funciona igual.

Reglas de esta fase (mock-first):
- Auth es una sesión simulada en `localStorage` (no hay contraseñas reales ni servidor).
- Las páginas creadas se guardan en `localStorage` bajo el usuario mock, PERO cada página
  sigue generando su link/QR autocontenido (`/r/[payload]`) — no se pierde la propiedad
  "funciona sin servidor" que es un diferencial real del producto.
- Pagos: se simula el flujo de checkout (selección de plan, "pago" instantáneo) sin cobrar
  de verdad. Se deja el punto de integración documentado para Mercado Pago.
- Admin: usa datos mock generados localmente (no hay usuarios reales que moderar todavía).
- Nada de esto se presenta engañosamente como "real" en el copy — el dashboard mock y el
  checkout mock son honestos sobre ser una demo funcional completa, lista para conectar
  backend real (ver `BACKEND.md`).

## 2. Dirección artística

Editorial + cinemático + cálido. Un regalo, no un SaaS.

- **Tipografía**: Fraunces (serif editorial, itálica para acentos emocionales) para
  headlines; Work Sans para texto de UI/cuerpo; IBM Plex Mono para datos (contador,
  precios, timestamps, labels técnicos). Se mantiene del original — es la decisión más
  fuerte que ya tenía el proyecto.
- **Color**: ground `#1B1220` (aubergine casi negro), superficies `#241A2E`/`#2E2138`,
  paper cálido `#F7EFE6`/`#FBF6EF` para tarjetas de "regalo", acento burdeos `#C4425B`,
  dorado `#C9A24B`. Se extiende (no se reemplaza) con tokens semánticos para success/error/
  focus y variantes de superficie para dashboard/admin (que necesitan más densidad de
  información que la landing).
- **Composición**: asimetría editorial en landing (hero a dos columnas desiguales, tarjeta
  de regalo "physical" rotada 2°), full-bleed en showcases de temas, ritmo alternante de
  secciones (no todo es título+párrafo+3 cards).
- **Motion**: Anime.js para entrada del hero, reveal de sección on-scroll (stagger sutil),
  el momento de "abrir el sobre" del mensaje, la transición del corazón partido al entrar al
  visor, microinteracciones en el wizard (selección de tema/ocasión), transiciones del
  dashboard. CSS puro para hovers/focus simples. Todo respeta `prefers-reduced-motion`.

## 3. Design tokens

Definidos en `src/styles/tokens.css` vía `@theme` de Tailwind v4, mapeando 1:1 a las
variables del HTML original para no perder la identidad, más tokens nuevos para app/admin.

## 4. Cosas a evitar (heredado de las reglas globales del usuario)

Gradientes decorativos sin función, glassmorphism porque sí, cards repetidas sin variación,
Inter, cualquier cosa que huela a template de shadcn sin editar, cursors genéricos de "SaaS
dashboard". El dashboard de la app puede ser más funcional/denso que la landing, pero sigue
usando la misma identidad tipográfica y de color — nunca un salto a una estética distinta
tipo "admin genérico".

## 5. Roadmap de implementación

Ver commits — se trabaja por fases pequeñas:
1. Fundación: tokens, fuentes, primitivos de UI, layout base.
2. Marketing/landing completo (todas las rutas públicas).
3. Auth mock + registro/login.
4. Dashboard + wizard de creación (puerto del wizard original a componentes React).
5. Visor público `/r/[payload]` con reveal motion.
6. Admin base.
7. Pulido de motion (Anime.js) en todo el flujo.
8. QA responsive + accesibilidad + performance.
