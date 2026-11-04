import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flame, RotateCcw, ShieldCheck } from 'lucide-react';
import { sfx } from '../../lib/sfx';

/**
 * Chaos Monkey: the site's signature interaction, a small SRE game.
 *
 * "break something" takes down three real components of the page you are looking at (cards,
 * headings, buttons). Each one shows a Kubernetes-style failure (CrashLoopBackOff, ImagePullBackOff,
 * OOMKilled...). Click a broken component to restart its pod. A live MTTR (mean time to recovery)
 * clock runs while it is down, and if nobody responds, the controller self-heals everything after 30 s,
 * which is the whole point of the self-healing work in my AWS / Kubernetes projects.
 *
 * It only toggles `data-chaos*` attributes (styled in index.css); React state and routes are untouched.
 */

const FAILURES = ['CrashLoopBackOff', 'ImagePullBackOff', 'OOMKilled', 'Evicted', '503 Unavailable'];
const COUNT = 3;
const AUTO_HEAL_MS = 30_000;
const TARGETS = '.glass, .section-title, .t-display, .btn-primary, h1';

const rand = (n) => Math.floor(Math.random() * n);
const slug = (el) => {
  const text = el.querySelector?.('h1,h2,h3')?.textContent || el.textContent || 'svc';
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 14) || 'svc';
};
const pod = () => Math.random().toString(16).slice(2, 6);

function pickTargets() {
  const vh = window.innerHeight;
  const dist = (r) => (r.bottom > 70 && r.top < vh - 70 ? 0 : r.top >= vh - 70 ? r.top - (vh - 70) : 70 - r.bottom);
  const candidates = [...document.querySelectorAll(TARGETS)]
    .filter((el) => !el.closest('nav, footer, [data-chaos-ignore], [role="dialog"], [role="status"]'))
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 120 && r.height > 36)
    .map(({ el, r }) => ({ el, d: dist(r), k: Math.random() }));
  // on-screen things first (random order), then whatever is nearest below or above the fold
  candidates.sort((x, y) => (x.d === 0 && y.d === 0 ? x.k - y.k : x.d - y.d));
  const chosen = [];
  for (const { el } of candidates) {
    if (chosen.every((c) => !c.contains(el) && !el.contains(c))) chosen.push(el);
    if (chosen.length === COUNT) break;
  }
  // make sure at least the first victim is visible
  const first = chosen.find((el) => dist(el.getBoundingClientRect()) > 0);
  if (first && chosen.every((el) => dist(el.getBoundingClientRect()) > 0)) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return chosen;
}

const clear = (el) => {
  el.removeAttribute('data-chaos');
  el.removeAttribute('data-chaos-label');
  el.removeAttribute('role');
  el.removeAttribute('aria-label');
  if (el.dataset.chaosTab !== undefined) { if (el.dataset.chaosTab === '') el.removeAttribute('tabindex'); else el.setAttribute('tabindex', el.dataset.chaosTab); delete el.dataset.chaosTab; }
};

const mmss = (ms) => `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`;

export default function ChaosMonkey() {
  const [phase, setPhase] = useState('idle'); // idle | incident | resolved
  const [down, setDown] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [mttr, setMttr] = useState(0);
  const [best, setBest] = useState(null);
  const targets = useRef([]);
  const startedAt = useRef(0);
  const timers = useRef([]);
  const location = useLocation();

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    targets.current.forEach(clear);
    targets.current = [];
    setPhase('idle');
    setDown(0);
  }, []);

  const resolve = useCallback(() => {
    const ms = performance.now() - startedAt.current;
    setMttr(ms);
    setBest((b) => (b === null || ms < b ? ms : b));
    setPhase('resolved');
    sfx.success();
    timers.current.push(setTimeout(() => setPhase((p) => (p === 'resolved' ? 'idle' : p)), 9000));
  }, []);

  const heal = useCallback((el, label = 'Running 1/1') => {
    if (el.getAttribute('data-chaos') !== 'down') return;
    el.setAttribute('data-chaos', 'healing');
    el.setAttribute('data-chaos-label', label);
    sfx.heal();
    setDown((d) => d - 1);
    timers.current.push(setTimeout(() => {
      clear(el);
      targets.current = targets.current.filter((t) => t !== el);
      if (!targets.current.some((t) => t.getAttribute('data-chaos') === 'down' || t.getAttribute('data-chaos') === 'healing')) resolve();
    }, 950));
  }, [resolve]);

  const healAll = useCallback((label) => {
    targets.current.filter((t) => t.getAttribute('data-chaos') === 'down').forEach((el, i) => {
      timers.current.push(setTimeout(() => heal(el, label), i * 450));
    });
  }, [heal]);

  const unleash = useCallback(() => {
    reset();
    const picked = pickTargets();
    if (!picked.length) return;
    picked.forEach((el) => {
      el.setAttribute('data-chaos', 'down');
      el.setAttribute('data-chaos-label', `${slug(el)}-${pod()} · ${FAILURES[rand(FAILURES.length)]}`);
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'Broken component. Activate to restart its pod.');
      el.dataset.chaosTab = el.getAttribute('tabindex') ?? '';
      el.setAttribute('tabindex', '0');
    });
    targets.current = picked;
    startedAt.current = performance.now();
    setDown(picked.length);
    setElapsed(0);
    setPhase('incident');
    sfx.alarm();
    timers.current.push(setTimeout(() => healAll('self-healed by controller'), AUTO_HEAL_MS));
  }, [reset, healAll]);

  // clicking / pressing Enter on a broken component restarts it
  useEffect(() => {
    if (phase !== 'incident') return undefined;
    const hit = (e) => {
      const el = e.target.closest?.('[data-chaos="down"]');
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      heal(el);
    };
    const key = (e) => { if (e.key === 'Enter' || e.key === ' ') hit(e); };
    document.addEventListener('click', hit, true);
    document.addEventListener('keydown', key, true);
    const tick = setInterval(() => setElapsed(performance.now() - startedAt.current), 100);
    return () => { document.removeEventListener('click', hit, true); document.removeEventListener('keydown', key, true); clearInterval(tick); };
  }, [phase, heal]);

  // other parts of the page (the hero hint) can start an incident too
  useEffect(() => {
    const go = () => phase === 'idle' && unleash();
    window.addEventListener('ny:chaos', go);
    return () => window.removeEventListener('ny:chaos', go);
  }, [phase, unleash]);

  // navigating away (or unmounting) cancels the incident cleanly
  useEffect(() => reset, [location.pathname, reset]);

  const pill = {
    idle: { dot: '#4ade80', text: 'prod · all systems operational' },
    incident: { dot: '#ff4d4d', text: `INCIDENT · ${down} down · MTTR ${mmss(elapsed)}` },
    resolved: { dot: '#4ade80', text: `recovered · MTTR ${(mttr / 1000).toFixed(1)}s${best !== null && best < mttr ? ` · best ${(best / 1000).toFixed(1)}s` : ' · personal best'}` },
  }[phase];

  const btn = {
    display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: 'none', borderRadius: 999,
    padding: '6px 12px', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
  };

  return (
    <div
      data-chaos-ignore
      role="region"
      aria-label="Chaos Monkey"
      style={{
        position: 'fixed', left: 16, bottom: 16, zIndex: 9990, display: 'flex', alignItems: 'center', gap: 12, maxWidth: 'calc(100vw - 32px)',
        padding: '8px 8px 8px 12px', borderRadius: 999, background: '#0e0e0e', color: '#e5e7eb',
        border: `1px solid ${phase === 'incident' ? '#ff4d4d' : phase === 'resolved' ? '#4ade80' : 'rgba(255,255,255,0.14)'}`,
        fontFamily: 'ui-monospace, "SFMono-Regular", Consolas, monospace', fontSize: 11.5, letterSpacing: '0.02em',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)', transition: 'border-color 0.25s ease',
      }}
    >
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: pill.dot, flexShrink: 0, animation: phase === 'incident' ? 'cpPulse 0.5s ease-in-out infinite' : 'cpPulse 2.4s ease-in-out infinite' }} />
      <span aria-live="polite" className="hidden sm:inline" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pill.text}</span>
      {phase !== 'idle' && <span className="sm:hidden" style={{ whiteSpace: 'nowrap' }}>{phase === 'incident' ? `${down} down · ${mmss(elapsed)}` : `MTTR ${(mttr / 1000).toFixed(1)}s`}</span>}

      {phase === 'idle' && (
        <button type="button" onClick={() => { sfx.click(); unleash(); }} style={{ ...btn, background: '#cefe08', color: '#0a0a0a' }} title="Break a few components on this page, then restart them by clicking">
          <Flame style={{ width: 13, height: 13 }} /> Break something
        </button>
      )}
      {phase === 'incident' && (
        <button type="button" onClick={() => healAll('rollout restarted')} style={{ ...btn, background: 'transparent', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.3)' }} title="Restart every broken pod at once">
          <RotateCcw style={{ width: 13, height: 13 }} /> Restart all
        </button>
      )}
      {phase === 'resolved' && (
        <button type="button" onClick={() => { sfx.click(); unleash(); }} style={{ ...btn, background: 'transparent', color: '#4ade80', border: '1px solid #4ade80' }}>
          <ShieldCheck style={{ width: 13, height: 13 }} /> Again
        </button>
      )}
    </div>
  );
}
