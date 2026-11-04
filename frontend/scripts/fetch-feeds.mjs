/**
 * Build-time content sync. Runs before `vite build` (see package.json "prebuild"/"feeds").
 *
 * Pulls my articles (Medium, dev.to, AWS Builder Center) and YouTube videos into
 * src/data/feeds.snapshot.json, which the app bundles. It NEVER fails the build: any source
 * that errors keeps whatever the previous snapshot had for it, so a YouTube hiccup can't
 * take the site down.
 *
 *   node scripts/fetch-feeds.mjs           # refresh the snapshot
 *   node scripts/fetch-feeds.mjs --dry     # print what would change, write nothing
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = resolve(root, 'src/data/feeds.snapshot.json');
const DRY = process.argv.includes('--dry');
const { FEEDS } = await import(pathToFileURL(resolve(root, 'src/data/feeds.config.js')).href);

const UA = 'Mozilla/5.0 (compatible; portfolio-feed-sync/1.0; +https://github.com/nimeshayasith/nimeshayasith)';
const previous = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, 'utf8')) : { articles: [], videos: [] };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, { tries = 3, json = false } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: json ? 'application/json' : '*/*' }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return json ? await res.json() : await res.text();
    } catch (e) {
      lastErr = e;
      await sleep(700 * (i + 1));
    }
  }
  throw lastErr;
}

// ── tiny XML helpers (feeds are simple; avoids a dependency) ──────────────────────────────
const decode = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'").replace(/&amp;/g, '&');
const tag = (xml, name) => decode((xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)) || [])[1] || '').trim();
const attr = (xml, name, a) => (xml.match(new RegExp(`<${name}[^>]*\\s${a}="([^"]*)"`)) || [])[1] || '';
const blocks = (xml, name) => [...xml.matchAll(new RegExp(`<${name}[ >][\\s\\S]*?</${name}>`, 'g'))].map((m) => m[0]);
const strip = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const meta = (html, key) =>
  decode((html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`, 'i')) || [])[1] || '');
const metaAll = (html, key) =>
  [...html.matchAll(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`, 'gi'))].map((m) => decode(m[1]));
const readTime = (text) => Math.max(1, Math.round(text.split(/\s+/).length / 220));

// ── sources ───────────────────────────────────────────────────────────────────────────────
async function medium() {
  const xml = await get(`https://medium.com/feed/@${FEEDS.medium.user}`);
  return blocks(xml, 'item').map((it) => {
    const link = tag(it, 'link').split('?')[0];
    const content = (it.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/) || [])[1] || '';
    const html = decode(content);
    const text = strip(html);
    return {
      id: `medium:${link.match(/([0-9a-f]{12})$/)?.[1] || link}`,
      source: 'medium',
      title: tag(it, 'title'),
      url: link,
      date: new Date(tag(it, 'pubDate')).toISOString(),
      summary: text.slice(0, 220),
      image: (html.match(/<img[^>]+src="(https:\/\/cdn-images-1\.medium\.com[^"]+)"/) || [])[1] || null,
      tags: [...it.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => decode(m[1]).trim()).slice(0, 5),
      readTime: readTime(text),
    };
  });
}

async function devto() {
  const list = await get(`https://dev.to/api/articles?username=${FEEDS.devto.user}&per_page=100`, { json: true });
  return list.map((a) => ({
    id: `devto:${a.id}`,
    source: 'devto',
    title: a.title,
    url: a.url,
    date: a.published_at,
    summary: a.description || '',
    image: a.cover_image || a.social_image || null,
    tags: a.tag_list || [],
    readTime: a.reading_time_minutes || 3,
  }));
}

async function awsPage(url) {
  const html = await get(url);
  const title = (meta(html, 'og:title') || '').replace(/\s*\|\s*AWS Builder Center\s*$/, '');
  if (!title) throw new Error('no title');
  const image = meta(html, 'og:image');
  return {
    id: `aws:${url.match(/\/content\/([A-Za-z0-9]+)/)?.[1] || url}`,
    source: 'aws',
    title,
    url: meta(html, 'og:url') || url,
    date: meta(html, 'article:published_time') || new Date().toISOString(),
    summary: meta(html, 'og:description') || meta(html, 'description'),
    image: image && !/assets\/og-/.test(image) ? image : null, // the default Builder card isn't a real cover
    tags: metaAll(html, 'article:tag').slice(0, 5),
    readTime: 5,
    author: meta(html, 'author'),
  };
}

async function awsBuilder() {
  const cfg = FEEDS.awsBuilder;
  const urls = new Set(cfg.articleUrls || []);
  // Discovery: scan the public site-wide RSS and keep entries whose author meta matches my name.
  try {
    const xml = await get('https://builder.aws.com/rss');
    const links = blocks(xml, 'entry').map((e) => attr(e, 'link', 'href')).filter(Boolean);
    const found = await Promise.allSettled(links.map((l) => get(l, { tries: 1 }).then((h) => ({ l, author: meta(h, 'author') }))));
    for (const f of found) if (f.status === 'fulfilled' && f.value.author.toLowerCase() === cfg.authorName.toLowerCase()) urls.add(f.value.l);
  } catch (e) {
    console.warn(`  aws rss scan skipped: ${e.message}`);
  }
  const out = [];
  for (const u of urls) {
    try { out.push(await awsPage(u)); } catch (e) { console.warn(`  aws ${u}: ${e.message}`); }
  }
  return out;
}

// Preferred: the official YouTube Data API v3 (needs YOUTUBE_API_KEY, set as an Amplify environment
// variable; never committed, never sent to the browser). Reads the channel's "uploads" playlist
// (id = "UU" + channel id minus its "UC"), then asks for details and view counts of those videos.
// Cost: ~2 quota units per 50 videos, of 10,000 free per day. `get()` only ever throws "HTTP <status>",
// so the key can't leak into a build log through an error message.
async function youtubeApi(key) {
  const uploads = 'UU' + FEEDS.youtube.channelId.slice(2);
  const base = 'https://www.googleapis.com/youtube/v3';
  const ids = [];
  let pageToken = '';
  for (let page = 0; page < 4; page++) {
    const list = await get(`${base}/playlistItems?part=contentDetails&maxResults=50&playlistId=${uploads}${pageToken}&key=${key}`, { json: true });
    ids.push(...list.items.map((i) => i.contentDetails.videoId));
    if (!list.nextPageToken) break;
    pageToken = `&pageToken=${list.nextPageToken}`;
  }
  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50).join(',');
    const res = await get(`${base}/videos?part=snippet,statistics&id=${chunk}&key=${key}`, { json: true });
    for (const v of res.items) {
      out.push({
        id: v.id,
        title: v.snippet.title,
        published: v.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        thumb: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        description: (v.snippet.description || '').slice(0, 400),
        views: Number(v.statistics?.viewCount) || 0,
      });
    }
  }
  return out;
}

async function youtube() {
  const key = process.env.YOUTUBE_API_KEY;
  if (key) {
    try {
      const videos = await youtubeApi(key);
      console.log('feeds: youtube  via Data API v3');
      return videos;
    } catch (e) {
      console.warn(`feeds: youtube  Data API failed (${e.message}), trying the RSS feed`);
    }
  } else {
    console.log('feeds: youtube  YOUTUBE_API_KEY not set, using the RSS feed');
  }
  const xml = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${FEEDS.youtube.channelId}`, { tries: 5 });
  return blocks(xml, 'entry').map((e) => {
    const id = tag(e, 'yt:videoId');
    return {
      id,
      title: tag(e, 'title'),
      published: tag(e, 'published'),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      description: tag(e, 'media:description').slice(0, 400),
      views: Number(attr(e, 'media:statistics', 'views')) || 0,
    };
  });
}

// ── run ───────────────────────────────────────────────────────────────────────────────────
const sources = { medium, devto, aws: awsBuilder, youtube };
const results = {};
for (const [name, fn] of Object.entries(sources)) {
  try {
    results[name] = await fn();
    console.log(`feeds: ${name.padEnd(8)} ${String(results[name].length).padStart(3)} items`);
  } catch (e) {
    console.warn(`feeds: ${name.padEnd(8)} FAILED (${e.message}), keeping previous snapshot`);
  }
}

const keepOld = (src) => previous.articles.filter((a) => a.source === src);
const articles = [
  ...(results.medium ?? keepOld('medium')),
  ...(results.devto ?? keepOld('devto')),
  ...(results.aws ?? keepOld('aws')),
];
// an AWS article that vanished from the RSS window must not disappear: merge with the old ones
if (results.aws) for (const old of keepOld('aws')) if (!articles.some((a) => a.id === old.id)) articles.push(old);
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

const videos = (results.youtube ?? previous.videos).slice().sort((a, b) => new Date(b.published) - new Date(a.published));

const next = { generatedAt: new Date().toISOString(), articles, videos };
const same = JSON.stringify({ ...next, generatedAt: 0 }) === JSON.stringify({ ...previous, generatedAt: 0 });
if (DRY) {
  console.log(`feeds: dry run, ${articles.length} articles / ${videos.length} videos, ${same ? 'no changes' : 'would update snapshot'}`);
} else if (same) {
  console.log('feeds: snapshot already up to date');
} else {
  writeFileSync(SNAPSHOT, JSON.stringify(next, null, 2) + '\n');
  console.log(`feeds: snapshot written (${articles.length} articles, ${videos.length} videos)`);
}
