import { useEffect, useRef } from 'react';
import useLampStore from '../../store/lampStore';

/**
 * "Find the light": the creative feature.
 *
 * The page starts in the dark. The cursor is a kerosene lantern and only the circle of light around it
 * is clear; everything else sits under a dark veil (a warm fog in the light theme). Designed so it
 * never gets in the way:
 *   - the navbar, the status pill and every dialog sit above the veil, so navigation is always readable;
 *   - the veil ignores the pointer, so every click still lands on the page;
 *   - without a pointer (a keyboard, a headless screenshot) the lantern drifts by itself, and Tab moves it
 *     to whatever has focus;
 *   - on touch screens the veil is lighter and the lantern follows the finger;
 *   - the navbar's lamp button turns the whole thing off, and the choice is remembered.
 */

const INTERACTIVE = 'a, button, input, textarea, select, summary, label, [role="button"], [tabindex]:not([tabindex="-1"])';
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function Lamp() {
  const on = useLampStore((s) => s.on);
  const veil = useRef(null);
  const lamp = useRef(null);
  const hint = useRef(null);

  useEffect(() => {
    if (!on) return undefined;
    const root = document.documentElement;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia?.('(pointer: fine)').matches ?? true;

    const s = {
      x: window.innerWidth * 0.5, y: window.innerHeight * 0.42,
      tx: window.innerWidth * 0.5, ty: window.innerHeight * 0.42,
      rot: 0, scale: 1, grow: 1, lit0: null,
      real: false, over: false, hover: false, dialog: false, away: false,
      travelled: 0, lastX: null, lastY: null, lastPointer: 0, hintGone: false,
    };

    const setCursorHidden = (hidden) => root.classList.toggle('lamp-cursor', hidden);

    const onPointer = (e) => {
      s.real = true;
      s.away = false;
      s.lastPointer = performance.now();
      s.tx = e.clientX; s.ty = e.clientY;
      if (s.lastX !== null) s.travelled += Math.hypot(e.clientX - s.lastX, e.clientY - s.lastY);
      s.lastX = e.clientX; s.lastY = e.clientY;
      const t = e.target instanceof Element ? e.target : null;
      s.hover = !!t?.closest(INTERACTIVE);
      s.dialog = !!t?.closest('[role="dialog"], iframe');
      // a mouse hides the system arrow (the lantern is the pointer), but never over a dialog or video
      setCursorHidden(fine && e.pointerType !== 'touch' && !s.dialog && root.dataset.boot !== 'on');
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      s.real = true; s.lastPointer = performance.now();
      s.tx = t.clientX; s.ty = t.clientY;
      if (s.lastX !== null) s.travelled += Math.hypot(t.clientX - s.lastX, t.clientY - s.lastY);
      s.lastX = t.clientX; s.lastY = t.clientY;
    };
    const onFocus = (e) => {
      // keyboard users: carry the light to whatever has focus
      if (performance.now() - s.lastPointer < 1500) return;
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      s.real = true;
      s.tx = clamp(r.left + r.width / 2, 0, window.innerWidth);
      s.ty = clamp(r.top + Math.min(r.height / 2, 40), 0, window.innerHeight);
    };
    const onLeave = () => { s.away = true; };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    document.addEventListener('focusin', onFocus);
    document.documentElement.addEventListener('mouseleave', onLeave);

    let raf;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const v = veil.current, l = lamp.current;
      if (!v || !l) return;

      // hold everything back while the entry screen is up
      if (root.dataset.boot === 'on') {
        s.lit0 = null;
        setCursorHidden(false);
        v.style.opacity = '0';
        l.style.opacity = '0';
        return;
      }
      if (s.lit0 === null) s.lit0 = now;
      const lit = reduce ? 1 : clamp((now - s.lit0) / 1400, 0, 1);

      if (!s.real) {
        // nobody has moved a pointer yet: drift slowly so the page is never just black
        const t = now / 1000;
        s.tx = window.innerWidth * (0.5 + 0.17 * Math.sin(t * 0.55));
        s.ty = window.innerHeight * (0.42 + 0.1 * Math.sin(t * 0.8 + 1));
      }

      const px = s.x;
      const k = reduce ? 1 : 0.34;
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      s.rot += (clamp((s.x - px) * 1.2, -16, 16) - s.rot) * 0.15;
      s.grow += ((s.hover ? 1.14 : 1) - s.grow) * 0.14;
      s.scale += ((s.hover ? 1.12 : 1) - s.scale) * 0.18;

      const base = fine
        ? clamp(Math.min(window.innerWidth, window.innerHeight) * 0.38, 230, 360)
        : clamp(window.innerWidth * 0.46, 150, 230);
      const flick = reduce ? 1 : 1 + 0.02 * Math.sin(now / 90) + 0.014 * Math.sin(now / 37 + 1.3) + 0.01 * Math.sin(now / 231);
      const r = base * s.grow * flick * (0.4 + 0.6 * lit);

      v.style.setProperty('--lx', `${s.x.toFixed(1)}px`);
      v.style.setProperty('--ly', `${s.y.toFixed(1)}px`);
      v.style.setProperty('--lr', `${r.toFixed(1)}px`);
      v.style.opacity = String(lit);

      const showLamp = !s.dialog && !s.away;
      l.style.opacity = showLamp ? String(lit) : '0';
      l.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      l.firstChild.style.transform = `rotate(${s.rot.toFixed(2)}deg) scale(${s.scale.toFixed(3)})`;

      // the "move me" hint goes away once the visitor has clearly got the idea
      if (!s.hintGone && hint.current && (s.travelled > 520 || now - s.lit0 > 12000)) {
        s.hintGone = true;
        hint.current.classList.add('is-gone');
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      document.removeEventListener('focusin', onFocus);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('lamp-cursor');
    };
  }, [on]);

  if (!on) return null;
  const touch = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  return (
    <>
      <div ref={veil} className="lamp-veil" aria-hidden="true" />
      <div ref={lamp} className="lamp" aria-hidden="true">
        <div className="lamp-swing">
          <svg width="44" height="72" viewBox="0 0 44 72">
            <path d="M15 13 C15 1, 29 1, 29 13" fill="none" stroke="#a89d86" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M13 15 H31 L28 11 H16 Z" fill="#3a362e" stroke="#a89d86" strokeWidth="1" />
            <path d="M15 15 H29 C34 21, 35 30, 31 41 H13 C9 30, 10 21, 15 15 Z" fill="rgba(255,205,120,0.2)" stroke="#d6c8a6" strokeWidth="1.4" />
            <g className="lamp-flame">
              <path d="M22 37 C16.5 34, 17.5 27, 22 20.5 C26.5 27, 27.5 34, 22 37 Z" fill="#ffae2e" />
              <path d="M22 36 C19.5 34, 20 30.5, 22 27.5 C24 30.5, 24.5 34, 22 36 Z" fill="#fff4c6" />
            </g>
            <rect x="14" y="41" width="16" height="4" rx="1" fill="#6b5a34" stroke="#a89d86" />
            <path d="M10 45 H34 C36.5 55, 34.5 62, 30 66 H14 C9.5 62, 7.5 55, 10 45 Z" fill="#7a4b12" stroke="#d1a85c" strokeWidth="1.2" />
            <path d="M13.5 50 C14.5 56, 15.5 60, 17.5 63" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <rect x="12" y="66" width="20" height="4" rx="1.5" fill="#3a362e" stroke="#a89d86" />
          </svg>
        </div>
        <span ref={hint} className="lamp-hint">{touch ? 'drag to light the way' : "it's dark in here · move the lamp"}</span>
      </div>
    </>
  );
}
