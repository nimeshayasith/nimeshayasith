import { listMedia } from './media';

/**
 * Gallery = bundled photos + anything dropped into src/media/gallery + whatever the
 * backend's /api/gallery returns (merged on top, so you can also add photos live).
 *
 * To add a photo: copy it to src/media/gallery/ (e.g. "aws-summit-2026.jpg"). The title is
 * made from the file name. To give it a nicer title, caption or category, add an entry to
 * GALLERY_META below, keyed by the file name without its extension.
 */
export const GALLERY_META = {
  // 'aws-summit-2026': { title: 'AWS Summit Colombo', caption: 'Day one with the community', category: 'Events' },
};

const humanize = (name) => name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Photos that ship in /public. */
const BUNDLED = [
  { _id: 'memory_uni_lab', url: '/memory_uni_lab.jpg', title: 'Late nights in the lab', caption: 'Late nights at the computer lab', category: 'Campus' },
  { _id: 'memory_travel_beach', url: '/memory_travel_beach.jpg', title: 'Beach trip', caption: 'Beach trip with the gang', category: 'Moments' },
  { _id: 'memory_graduation', url: '/memory_graduation.jpg', title: 'Graduation is near', caption: 'Almost there: graduation is near!', category: 'Campus' },
];

const DROPPED = listMedia('gallery').map((f) => ({
  _id: `media-${f.name}`,
  url: f.url,
  title: GALLERY_META[f.name]?.title || humanize(f.name),
  caption: GALLERY_META[f.name]?.caption || '',
  category: GALLERY_META[f.name]?.category || 'Moments',
}));

/** Newest uploads first. */
export const GALLERY = [...DROPPED, ...BUNDLED];

/** Accepts whatever shape the backend stores and returns a gallery item (or null). */
export function normalizeGalleryItem(raw) {
  const url = raw?.imageUrl || raw?.image?.url || raw?.image || raw?.url || raw?.src || raw?.secure_url;
  if (!url || typeof url !== 'string') return null;
  const cat = raw.category;
  return {
    _id: String(raw._id || raw.id || url),
    url,
    title: raw.title || raw.name || 'Untitled',
    caption: raw.description || raw.caption || '',
    category: (typeof cat === 'string' ? cat : cat?.name) || 'Moments',
  };
}

/** Live items first, then bundled ones, without duplicates. */
export const mergeGallery = (bundled, live) => {
  const items = live.map(normalizeGalleryItem).filter(Boolean);
  const seen = new Set(items.map((i) => i.url));
  return [...items, ...bundled.filter((b) => !seen.has(b.url))];
};
