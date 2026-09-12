export type GeocodeResult = { latitude: number; longitude: number; displayName: string };

/**
 * Geocodifica un nombre de lugar con Nominatim (OpenStreetMap) — gratis, sin API key.
 * Solo se llama del lado del servidor, una vez por generación de sinastría.
 */
export async function geocodePlace(place: string): Promise<GeocodeResult | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", place);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Soulmates-App/1.0 (contacto: soporte@soulmates.app)",
      "Accept-Language": "es",
    },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!data.length) return null;

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
