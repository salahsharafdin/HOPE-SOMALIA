/**
 * Utility helper to resolve the client frontend URL for emails, password resets, and redirects.
 * 
 * Behavior:
 * - When in production (NODE_ENV === 'production' or Vercel / Render deployment):
 *   Uses https://hope-somalia.vercel.app (or custom PRODUCTION_CLIENT_URL / non-localhost origin).
 * - When in development (NODE_ENV !== 'production' or running locally):
 *   Uses the local running URL (http://localhost:5173 or request origin).
 */

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  let clean = url.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }
  return clean;
}

function getClientBaseUrl(req) {
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.RENDER === 'true';

  // 1. Extract origin or referer from request if available
  let requestOrigin = null;
  if (req) {
    if (typeof req.get === 'function') {
      requestOrigin = req.get('origin');
    } else if (req.headers && req.headers.origin) {
      requestOrigin = req.headers.origin;
    }

    if (!requestOrigin && req.headers && req.headers.referer) {
      try {
        const parsed = new URL(req.headers.referer);
        requestOrigin = parsed.origin;
      } catch (_) {}
    }
  }

  // 2. Parse CLIENT_URL which can be a comma-separated list
  const configuredUrls = (process.env.CLIENT_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  const localConfigUrl = configuredUrls.find((u) => /localhost|127\.0\.0\.1/i.test(u));
  const remoteConfigUrl = configuredUrls.find((u) => !/localhost|127\.0\.0\.1/i.test(u));

  const prodTargetUrl =
    process.env.PRODUCTION_CLIENT_URL ||
    remoteConfigUrl ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
    'https://hope-somalia.vercel.app';

  const devTargetUrl = localConfigUrl || 'http://localhost:5173';

  // 3. Select appropriate URL based on environment
  if (isProduction) {
    // If deployed, prioritize valid remote request origin, else production env/default
    if (requestOrigin && !/localhost|127\.0\.0\.1/i.test(requestOrigin)) {
      return sanitizeUrl(requestOrigin);
    }
    return sanitizeUrl(prodTargetUrl);
  }

  // Local development: prioritize local running origin from request, else local config/default
  if (requestOrigin && /localhost|127\.0\.0\.1/i.test(requestOrigin)) {
    return sanitizeUrl(requestOrigin);
  }

  return sanitizeUrl(devTargetUrl);
}

module.exports = { getClientBaseUrl, sanitizeUrl };
