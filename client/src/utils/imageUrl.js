/**
 * Formats image and media URLs.
 * If the URL is relative to /uploads/, it prepends the backend host if VITE_API_URL is configured.
 * If the URL is already absolute (e.g. Unsplash, Cloudinary, http/https) or a data URL, it returns it unchanged.
 */
export function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
    if (rawApiUrl && /^https?:\/\//i.test(rawApiUrl)) {
      const host = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
      return `${host}${url}`;
    }
    return url;
  }
  return url;
}
