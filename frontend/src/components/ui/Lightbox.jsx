import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Full-screen image viewer. `items` = [{ url, title?, caption? }], `index` = open item or null.
 * Esc closes, arrow keys / buttons move, click on the backdrop closes.
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index !== undefined && items[index];

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, index, items.length, onClose, onIndex]);

  if (!open) return null;
  const item = items[index];
  const btn = {
    position: 'absolute', width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Image viewer'}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <button type="button" aria-label="Close" onClick={onClose} style={{ ...btn, top: 16, right: 16 }}>
        <X style={{ width: 20, height: 20 }} />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }} style={{ ...btn, left: 16, top: '50%', marginTop: -22 }}>
            <ChevronLeft style={{ width: 22, height: 22 }} />
          </button>
          <button type="button" aria-label="Next image" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }} style={{ ...btn, right: 16, top: '50%', marginTop: -22 }}>
            <ChevronRight style={{ width: 22, height: 22 }} />
          </button>
        </>
      )}
      <figure onClick={(e) => e.stopPropagation()} style={{ margin: 0, maxWidth: 'min(1100px, 100%)', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <img src={item.url} alt={item.title || ''} style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: 12 }} />
        {(item.title || item.caption) && (
          <figcaption style={{ color: '#e5e7eb', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
            {item.title && <strong style={{ display: 'block', color: '#fff' }}>{item.title}</strong>}
            {item.caption}
            <span style={{ display: 'block', opacity: 0.5, fontSize: 12, marginTop: 4 }}>{index + 1} / {items.length}</span>
          </figcaption>
        )}
      </figure>
    </div>,
    document.body,
  );
}
