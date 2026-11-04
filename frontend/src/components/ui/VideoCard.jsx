import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, ExternalLink, Eye } from 'lucide-react';
import GlassCard from './GlassCard';
import { sfx } from '../../lib/sfx';

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
const short = (t) => t.replace(/\s*\|.*$/, '');

/** Modal player. youtube-nocookie + autoplay; the iframe only exists after a click, so the page stays light. */
export function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [video, onClose]);

  if (!video) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <button type="button" aria-label="Close video" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <X style={{ width: 20, height: 20 }} />
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(1000px, 100%)' }}>
        <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', background: '#000' }}>
          <iframe
            title={video.title}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
        <p style={{ color: '#e5e7eb', fontFamily: 'Inter, sans-serif', fontSize: 14, marginTop: 12 }}>
          {video.title}{' '}
          <a href={video.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>
            Open on YouTube <ExternalLink style={{ width: 12, height: 12, display: 'inline' }} />
          </a>
        </p>
      </div>
    </div>,
    document.body,
  );
}

export default function VideoCard({ video, featured = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GlassCard className="overflow-hidden group h-full flex flex-col" hover={false}>
        <button
          type="button"
          onClick={() => { sfx.click(); setOpen(true); }}
          aria-label={`Play: ${video.title}`}
          className="relative block w-full text-left"
          style={{ aspectRatio: '16 / 9', background: 'var(--bg-inverse)' }}
        >
          <img src={video.thumb} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)' }} />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ width: featured ? 72 : 56, height: featured ? 72 : 56, background: 'var(--accent)', boxShadow: '0 0 0 8px rgba(206,254,8,0.18)' }}
          >
            <Play style={{ width: featured ? 28 : 22, height: featured ? 28 : 22, color: '#111', marginLeft: 3 }} fill="#111" />
          </span>
        </button>
        <div className="p-5 flex flex-col flex-1">
          <p className="t-small flex items-center gap-3 mb-2">
            <span>{fmt(video.published)}</span>
            {video.views > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views.toLocaleString()}</span>}
          </p>
          <h3 className="t-h3 line-clamp-3">{short(video.title)}</h3>
        </div>
      </GlassCard>
      <VideoModal video={open ? video : null} onClose={() => setOpen(false)} />
    </>
  );
}
