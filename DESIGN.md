# El Detalle — Design & Product Source of Truth

> Renombrado de "Soulmates" a "El Detalle" para vender lo que el producto realmente es — un
> gesto/regalo romántico, no una app de citas ni "solo un mensaje". El resto de este
> documento conserva "Soulmates" donde describe el material original tal cual llegó.

## 0. Qué es El Detalle (auditoría del material original, entonces llamado "Soulmates")

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
9. Sinastría real (ephemeris + Gemini) + storage real de fotos (Vercel Blob).
10. Reposicionamiento de marca completo — ver §6 en adelante.

## 6. Brand concept: El Detalle

Repensado a partir de feedback del usuario: la landing vendía "armar una página con un
mensaje", y el producto es en realidad **preparar un regalo**. La pregunta que gobierna
cada decisión de acá en más:

> ¿Qué sentiría una persona si recibe este link de alguien que ama?
> Si la respuesta es "estoy entrando a una web", el diseño está fallando.
> Si es "me regalaron algo", vamos bien.

**Por qué "El Detalle" y no "Soulmates"**: "Soulmates" suena a app de citas/matching, lo
que el producto explícitamente NO es (ver §0). "El Detalle" es la frase argentina real
para un gesto de amor ("tener un detalle con alguien") — describe el producto sin
necesidad de explicarlo, y el artículo definido ("El", no "Un") lo planta como LA cosa
que se manda, no una entre varias. Alternativas evaluadas y descartadas: "Latido" (lindo
pero ya no distingue del corazón que estamos retirando como ícono principal), "Mimo"
(demasiado infantil para un producto que también sirve para aniversarios/San Valentín
serios), "Sin Motivo"/"Porque Sí" (más tagline que nombre de marca).

**Lo que la marca transmite**: amor, cuidado, intimidad, sorpresa, elegancia. **Lo que
evita activamente**: exceso de corazones (retirado como ícono principal — ver §7), rosa
como paleta por defecto, estética de dating app, estética de SaaS/IA genérica.

## 7. Identidad visual — el sello, no el corazón

El corazón partido (heart-mark.tsx) fue el símbolo original y sigue existiendo en el
código, pero **ya no es la marca principal**. Se reemplazó por `SealMark`
(`src/components/ui/seal-mark.tsx`): un sello de lacre circular con el monograma "D" en
Fraunces itálica. Motivos:
- Un corazón partido en dos, como ícono constante, es exactamente el patrón "exceso de
  corazones" que un producto premium debe evitar.
- Un sello funciona en TODOS los contextos que pide la marca: favicon, marca de agua,
  ícono de app, y sobre todo — puede **romperse** de verdad como parte de la experiencia
  de apertura (§8), algo que un corazón partido no puede hacer sin verse infantil.

`SealMark` acepta `cracked` para ocultar el anillo/monograma durante la animación de
apertura (el movimiento real de las dos mitades lo hace Anime.js directo sobre el DOM,
no React — ver el comentario en `envelope-reveal.tsx` sobre por qué no conviene animar
vía props ahí).

Favicon, apple-icon y la imagen de Open Graph se generan con `next/og` (`icon.tsx`,
`apple-icon.tsx`, `opengraph-image.tsx`), no son archivos estáticos — así siempre
coinciden con el sello real de la marca. Detalle técnico no obvio: Satori (el motor
detrás de `next/og`) no tiene acceso a fuentes del sistema ni puede resolver "Georgia" o
"serif" como los navegadores — hace falta pasarle los bytes reales de la fuente. Google
Fonts sirve `.woff2` por default, que Satori no puede parsear; pedir la fuente con un
User-Agent viejo (`src/lib/og-font.ts`) fuerza a Google a devolver `.ttf`, que sí funciona.

## 8. La experiencia de apertura (Gift Reveal)

Es la pieza más importante del producto — la primera pantalla que ve el destinatario NO
debe parecer una landing. `EnvelopeReveal` (`src/components/gift/envelope-reveal.tsx`)
implementa:

1. Un sobre de papel (tono `--color-paper`) con una solapa triangular (`clip-path`) y el
   sello de lacre centrado sobre la solapa. Texto: "Tenés un detalle" + "para {nombre}".
2. El sello tiene un pulso sutil (`scale` en loop) invitando a tocarlo — nunca autoplay,
   siempre requiere interacción real (tap/click/teclado vía `<button>`).
3. Al tocar el sello, una timeline de Anime.js (`createTimeline`) secuencia: el sello se
   parte en dos mitades que se separan y desvanecen → la solapa gira en 3D (`rotateX`,
   con `perspective` en el contenedor padre) como si se abriera de verdad → una "carta"
   sale del sobre (`translateY` + `scale` + `opacity`) → todo el grupo escala levemente y
   se desvanece, revelando el contenido real de abajo (que ya estaba montado, solo tapado
   por el overlay) en continuidad — nunca un fade a negro seguido de una página nueva.
4. `prefers-reduced-motion` salta directo al contenido — la experiencia nunca depende de
   la animación para ser usable, tal como pide accesibilidad.

Este es el único momento del producto con motion elaborado. El resto del motion (reveals
de sección con `RevealSection`, hovers) es deliberadamente silencioso — ver el principio
en §2: "el movimiento debe guiar, explicar, confirmar, emocionar. No decorar."

## 9. Narrativa de la experiencia recibida

`GiftViewer` ya no es un stack sin orden de "cards" — cada sección premium lleva un
número de capítulo en su eyebrow (`02 · Sus momentos`, `03 · Su universo`, `04 · Lo que
dicen las estrellas`, `05 · Sus números`, `06 · Lo que todavía no pasó`), en este orden:

```
GiftCard (portada + su historia, sin número — es la apertura misma)
  ↓
02 · Sus momentos          (PhotoTimeline, si hay cronología)
  ↓
03 · Su universo           (ConstellationCard, Edición Especial)
04 · Lo que dicen estrellas (SynastryCard, si se generó sinastría)
05 · Sus números           (LoveStats, Edición Especial)
  ↓
06 · Lo que todavía no pasó (FutureLetter, si hay cápsula del tiempo)
```

`SynastryCard` separa visualmente "Sus cartas — datos reales" (los signos calculados) de
"Lo que significa" (el párrafo escrito por Gemini) — nunca deben leerse como la misma
cosa, uno es cálculo, el otro es interpretación.

## 10. Planes: Clásico / Edición Especial

Se evaluó mantener "Básico/Premium" (genérico SaaS, no vende nada por sí mismo) y
"Detalle/Detalle Especial" (descartado: el plan base repetiría literalmente el nombre de
la marca, confuso — como si Apple llamara a su laptop base "Apple"). Se eligió
**Clásico** / **Edición Especial**: evita colisión con el nombre de marca, sigue una
convención de producto físico premium (perfumería, moda) en vez de SaaS, y dimensiona
Premium como algo curado/limitado en vez de solo "más funciones".

## 11. Microcopy — reglas

Evitar lenguaje técnico/administrativo en cualquier texto de interfaz: nunca "Generate",
"Submit", "Dashboard", "Publish", "Upload asset". En su lugar, lenguaje de estar
preparando y entregando un regalo: "Sellar mi detalle" (publicar), "Mis detalles" (no
"mis páginas"), "Preparar el Clásico" / "Preparar la Edición Especial" (elegir plan),
"Entregar por WhatsApp" (compartir). El mensaje pre-cargado de WhatsApp
(`share-screen.tsx`) es explícitamente emocional, no un link pelado.

## 12. Qué queda pendiente (no implementado en esta pasada)

Documentado acá para que quede explícito qué NO se tocó todavía, dado el tamaño del
brief original:
- Rediseño visual completo del wizard más allá del copy/microcopy (sigue siendo el mismo
  layout de formulario de antes, con textos y nombres de plan actualizados).
- Tratamiento editorial completo de fotografía (full-bleed, crops cinematográficos) en
  `PhotoTimeline` — hoy son thumbnails rectangulares simples, funcionales pero no la
  pieza "álbum/diario" descripta en el brief.
- `manifest.json` / PWA — no se agregó porque el producto no tiene un flujo de
  instalación a pantalla de inicio que lo justifique hoy.
- Sitemap.xml — no hay suficientes rutas públicas indexables más allá de las ya
  existentes para que aporte valor todavía.
