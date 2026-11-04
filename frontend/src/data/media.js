/**
 * Drop-in images. Put a file in src/media/<folder>/ and it appears on the site.
 * No code change, no list to edit (see src/media/README.md for the naming rules).
 *
 *   src/media/projects/<projectId>.png        -> cover image of that project
 *   src/media/projects/<projectId>-2.png      -> extra screenshots (-1, -2, -3 ...)
 *   src/media/experience/<experienceId>.png   -> logo / photo for that role
 *   src/media/gallery/<anything>.jpg          -> shows up on /gallery
 *   src/media/business/<workId>.png           -> cover for a Business Work entry
 *
 * Vite fingerprints and bundles these, so they get long-lived CloudFront caching.
 * Images in /public (served as-is, e.g. "/memory_travel_beach.jpg") also work:
 * reference them with an explicit `image: '/path.jpg'` field in the data files.
 */

const files = import.meta.glob('../media/**/*.{png,jpg,jpeg,webp,avif,gif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// '../media/projects/gridpulse-2.png' -> { folder: 'projects', name: 'gridpulse-2', url }
const index = Object.entries(files).map(([path, url]) => {
  const [, folder, file] = path.match(/\.\.\/media\/([^/]+)\/(.+)$/) || [];
  return { folder, name: (file || '').replace(/\.[^.]+$/, ''), url };
});

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true });

/** Every image in a folder, sorted by file name. */
export const listMedia = (folder) => index.filter((f) => f.folder === folder).sort(byName);

/**
 * Images for one item: `<id>` first (the cover), then `<id>-1`, `<id>-2` …
 * Returns [] when nothing was dropped in.
 */
export function mediaFor(folder, id) {
  const lower = String(id).toLowerCase();
  return index
    .filter((f) => f.folder === folder && (f.name.toLowerCase() === lower || f.name.toLowerCase().startsWith(`${lower}-`)))
    .sort(byName)
    .map((f) => f.url);
}

/** Attach `image` (cover) and `images` (all) to each item, keeping an explicit `image` if one is set. */
export function withMedia(items, folder, key = '_id') {
  return items.map((item) => {
    const found = mediaFor(folder, item[key]);
    const images = [...new Set([item.image, ...found].filter(Boolean))];
    return images.length ? { ...item, image: images[0], images } : item;
  });
}
