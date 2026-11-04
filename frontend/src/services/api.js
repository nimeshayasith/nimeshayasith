/**
 * Read-only client for the portfolio backend (Node/Express on Render).
 *
 * The site is a static web app: everything important is bundled at build
 * time (see src/data). The backend only adds *live* data:
 *   - /medium/posts      latest Medium articles (RSS proxy)
 *   - /certifications    extra credentials not yet in the static list
 *   - /library           study notes & slide decks (served from Cloudinary)
 *   - /gallery           photos added through the backend (merged with the bundled ones)
 *   - /freelance         business-work case studies added through the backend
 *   - /health            liveness (used by the status chip and CloudShell)
 *
 * Render's free tier sleeps when idle, so a cold start can take ~30–50 s.
 * Every caller therefore renders its static fallback first and upgrades
 * when (if) the backend answers. Nothing here can break the page.
 */

/** The real backend (Node/Express on Render). */
export const BACKEND_ORIGIN = 'https://portfolio-6gcd.onrender.com';

/**
 * The app calls a same-origin `/api`, never the Render URL directly:
 *   - production: an AWS Amplify rewrite proxies /api/* -> Render (see terraform/),
 *     so the backend's CORS allow-list doesn't matter;
 *   - dev / preview: Vite's proxy does the same (see vite.config.js).
 * Set VITE_API_URL to an absolute URL to bypass this (then the backend must
 * allow this site's origin in its CORS config).
 */
export const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

const DEFAULT_TIMEOUT = 25_000;

async function request(path, { timeout = DEFAULT_TIMEOUT, signal } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  signal?.addEventListener('abort', () => controller.abort());
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // If the proxy rule is missing, /api/* falls through to the SPA's index.html
    if (!(res.headers.get('content-type') || '').includes('json')) throw new Error('not JSON (is the /api rewrite configured?)');
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export const mediumApi = { getPosts: (opts) => request('/medium/posts', opts) };
export const certificationsApi = { getAll: (opts) => request('/certifications', opts) };
export const libraryApi = { getAll: (opts) => request('/library', opts) };
/**
 * Other places my writing and videos live. dev.to's API allows cross-origin reads, so the browser
 * asks it directly; YouTube's feed does not, so it goes through the same-origin /yt rewrite
 * (Amplify in production, Vite locally) just like /api does for the backend.
 */
export const devtoApi = {
  getArticles: (user, { timeout = 15_000 } = {}) =>
    fetch(`https://dev.to/api/articles?username=${encodeURIComponent(user)}&per_page=100`, { signal: AbortSignal.timeout(timeout) }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),
};
export const youtubeApi = {
  getFeed: (channelId, { timeout = 15_000 } = {}) =>
    fetch(`/yt/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`, { signal: AbortSignal.timeout(timeout) }).then(async (r) => {
      const body = await r.text();
      if (!r.ok || !body.includes('<feed')) throw new Error(`HTTP ${r.status}`);
      return body;
    }),
};

export const galleryApi = { getAll: (opts) => request('/gallery', opts) };
export const freelanceApi = { getAll: (opts) => request('/freelance', opts) };

/** Pings /health and reports latency; never throws. */
export async function pingBackend(opts = {}) {
  const started = performance.now();
  try {
    const data = await request('/health', { timeout: 60_000, ...opts });
    return { ok: true, ms: Math.round(performance.now() - started), data };
  } catch (error) {
    return { ok: false, ms: Math.round(performance.now() - started), error: error.message };
  }
}

let warm;
/** One shared health check per page load; also wakes a sleeping Render dyno early. */
export const warmBackend = () => {
  warm ??= pingBackend();
  return warm;
};
