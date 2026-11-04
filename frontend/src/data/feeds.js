import snapshot from './feeds.snapshot.json';

/**
 * Normalised article / video lists. The shapes the UI uses:
 *   article: { id, source: 'medium'|'devto'|'aws', title, pubDate, link, thumbnail, summary, readTime, tags }
 *   video:   { id, title, published, url, thumb, description, views }
 */

/** Drop null/empty fields so a sparse live record can't blank a good bundled one. */
const defined = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== ''));

const clean = (url = '') => String(url).split('?')[0].replace(/\/$/, '');

export const toArticle = (a) => ({
  id: a.id,
  source: a.source,
  title: a.title,
  pubDate: a.date,
  link: a.url,
  thumbnail: a.image || null,
  summary: a.summary || '',
  readTime: a.readTime || 3,
  tags: a.tags || [],
});

export const SNAPSHOT_ARTICLES = snapshot.articles.map(toArticle);
export const SNAPSHOT_VIDEOS = snapshot.videos;
export const SNAPSHOT_TIME = snapshot.generatedAt;

/** Merge lists, de-duplicating by URL (query string ignored), newest first. Later lists win. */
export function mergeArticles(...lists) {
  const byUrl = new Map();
  for (const list of lists) for (const a of list) byUrl.set(clean(a.link), { ...byUrl.get(clean(a.link)), ...defined(a) });
  return [...byUrl.values()].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

export function mergeVideos(...lists) {
  const byId = new Map();
  for (const list of lists) for (const v of list) byId.set(v.id, { ...byId.get(v.id), ...defined(v) });
  return [...byId.values()].sort((a, b) => new Date(b.published) - new Date(a.published));
}

/** Medium (via my backend): { articles: [...] } -> normalised */
export const fromBackendMedium = (res) =>
  (res.articles || []).map((a) => ({
    id: `medium:${(clean(a.link).match(/([0-9a-f]{12})$/) || [])[1] || a.id}`,
    source: 'medium',
    title: a.title,
    pubDate: new Date(a.pubDate).toISOString(),
    link: clean(a.link),
    thumbnail: a.thumbnail || null,
    summary: a.summary || '',
    readTime: a.readTime || 3,
    tags: a.tags || [],
  }));

/** dev.to public API -> normalised */
export const fromDevto = (list) =>
  list.map((a) => ({
    id: `devto:${a.id}`,
    source: 'devto',
    title: a.title,
    pubDate: a.published_at,
    link: a.url,
    thumbnail: a.cover_image || a.social_image || null,
    summary: a.description || '',
    readTime: a.reading_time_minutes || 3,
    tags: a.tag_list || [],
  }));

/** YouTube Atom feed (text) -> videos */
export function fromYoutubeAtom(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, 'application/xml');
  const text = (el, sel) => el.getElementsByTagName(sel)[0]?.textContent?.trim() || '';
  return [...doc.getElementsByTagName('entry')].map((e) => {
    const id = text(e, 'yt:videoId');
    return {
      id,
      title: text(e, 'title'),
      published: text(e, 'published'),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      description: text(e, 'media:description').slice(0, 400),
      views: Number(e.getElementsByTagName('media:statistics')[0]?.getAttribute('views')) || 0,
    };
  });
}

/** Which video demos which project. Matched on the video title so new uploads link themselves. */
export const PROJECT_VIDEO_MATCH = {
  lankaresilience: /lankaresilience/i,
  'teta-guard': /teta-?guard/i,
  'autotrust-bank': /autotrust/i,
  securestay: /securestay/i,
  'securestay-infra': /securestay/i,
  'calm-mind': /calm\s?mind/i,
  'finance-tracker': /personal finance tracker/i,
  'student-registration': /student registration/i,
  'aks-platform': /mini-finance application on azure/i,
};

export const videoForProject = (projectId, videos) => {
  const re = PROJECT_VIDEO_MATCH[projectId];
  return re ? videos.find((v) => re.test(v.title)) : undefined;
};
