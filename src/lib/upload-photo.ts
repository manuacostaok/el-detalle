export async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen.");
  return data.url as string;
}
