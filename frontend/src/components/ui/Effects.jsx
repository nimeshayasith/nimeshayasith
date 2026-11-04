import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sfx } from '../../lib/sfx';

/**
 * Site-wide micro-interactions that don't belong to any one component:
 *  - the cursor spotlight on cards (sets --mx / --my on the hovered .glass element)
 *  - a soft tick when hovering links and buttons, and a whoosh on page changes (both silent unless sound is on)
 */
export default function Effects() {
  const { pathname } = useLocation();

  // route change sound (not on first load)
  useEffect(() => {
    if (Effects.first === undefined) { Effects.first = false; return; }
    sfx.route();
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia?.('(hover: none)').matches) return undefined;
    let raf = 0;
    let lastTick = 0;
    let lastEl = null;

    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const card = e.target.closest?.('.glass');
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
        }
      });
    };
    const onOver = (e) => {
      if (!sfx.enabled) return;
      const el = e.target.closest?.('a, button, [role="button"]');
      if (!el || el === lastEl) return;
      lastEl = el;
      const now = performance.now();
      if (now - lastTick > 70) { lastTick = now; sfx.hover(); }
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => { cancelAnimationFrame(raf); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerover', onOver); };
  }, []);

  return null;
}
