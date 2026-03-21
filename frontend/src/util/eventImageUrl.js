/**
 * Event `image_url` may be a legacy filename (served from /public/event_images/)
 * or a full URL (e.g. Supabase public URL).
 */
export function resolveEventImageUrl(imageUrl) {
  if (imageUrl == null || imageUrl === "") return null;
  const t = String(imageUrl).trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `/event_images/${t}`;
}

export function eventImageSrc(imageUrl, fallback = "/logo.png") {
  return resolveEventImageUrl(imageUrl) || fallback;
}
