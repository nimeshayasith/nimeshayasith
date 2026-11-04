/**
 * Article helpers. The articles themselves come from src/data/feeds.snapshot.json (refreshed by
 * scripts/fetch-feeds.mjs on every build) and are upgraded live in the browser by
 * hooks/useFeeds.js. See feeds.config.js for the sources.
 */

/**
 * Medium covers are bundled in /public/blog (named after the Medium post id) so they render
 * even if Medium's CDN is slow. Posts without any image in Medium's feed get a generated cover
 * (see ArticleCover). Drop a file named <postId>.png in public/blog and add it here to override.
 */
export const LOCAL_COVERS = {
  '38a40e74c1e5': '/blog/38a40e74c1e5.png',
  b1be9c7f7cec: '/blog/b1be9c7f7cec.png',
  ed2e19cf3af1: '/blog/ed2e19cf3af1.png',
  '6ec3425ebc4d': '/blog/6ec3425ebc4d.png',
  dbf741228fbf: '/blog/dbf741228fbf.png',
  d489884eb91a: '/blog/d489884eb91a.png',
  dd4ae2e4f79c: '/blog/dd4ae2e4f79c.gif',
  '6087ce62fe42': '/blog/6087ce62fe42.png',
};

/** Medium post id, e.g. 38a40e74c1e5 (the 12 hex chars at the end of every Medium URL). */
export const postId = (article) =>
  (String(article?.link || '').match(/-([0-9a-f]{12})(?:\?|$)/) || String(article?.id || '').match(/([0-9a-f]{12})$/) || [])[1];
