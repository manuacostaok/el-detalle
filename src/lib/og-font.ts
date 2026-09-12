/**
 * Satori (el motor detrás de next/og) no tiene acceso a fuentes del sistema — hay que
 * darle los bytes de la fuente explícitamente o cae a un sans-serif genérico sin
 * itálica real, aunque se pida "serif" o "Georgia". Bajamos Fraunces itálica desde
 * Google Fonts una sola vez por build.
 */
export async function loadFrauncesItalic(text: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@1,600&text=${encodeURIComponent(text)}`;
  // Un user-agent viejo hace que Google Fonts devuelva .ttf en vez de .woff2 —
  // Satori necesita sfnt crudo (ttf/otf), no puede parsear woff2.
  const css = await (
    await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; SCH-I535 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
      },
    })
  ).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error("No se pudo resolver la URL de la fuente Fraunces.");
  const fontRes = await fetch(match[1]);
  return fontRes.arrayBuffer();
}
