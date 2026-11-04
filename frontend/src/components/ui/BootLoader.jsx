import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../../lib/sfx';
import { SNAPSHOT_ARTICLES, SNAPSHOT_VIDEOS } from '../../data/feeds';

/**
 * Entry sequence, shown once per browser session:
 *   gate    "Enter" or "Enter with sound" (also the one user gesture browsers need before audio can play;
 *           it continues silently by itself after a few seconds, so nobody is ever stuck here)
 *   run     the site "deploys itself": a big counter plus the real build log of this site
 *   reveal  the screen splits open
 * Skipped for prefers-reduced-motion.
 */

const SESSION_KEY = 'ny-boot-seen';
const GATE_MS = 4500;
const RUN_MS = 2600;

const commit = typeof __BUILD_COMMIT__ !== 'undefined' ? __BUILD_COMMIT__ : 'local';

const STAGES = [
  { name: 'SOURCE', lines: ['$ git push origin main', 'remote: Amplify build triggered'] },
  { name: 'PROVISION', lines: ['$ terraform apply', 'aws_amplify_app.portfolio: in sync'] },
  { name: 'BUILD', lines: ['$ npm ci && vite build', `commit ${commit} · bundle ready`] },
  { name: 'SYNC', lines: ['$ node scripts/fetch-feeds.mjs', `${SNAPSHOT_ARTICLES.length} articles · ${SNAPSHOT_VIDEOS.length} videos`] },
  { name: 'DEPLOY', lines: ['$ amplify publish', 'cloudfront: invalidated · LIVE'] },
];

function shouldBoot() {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

const mono = { fontFamily: 'ui-monospace, "SFMono-Regular", Consolas, monospace' };

export default function BootLoader() {
  const [phase, setPhase] = useState(() => (shouldBoot() ? 'gate' : 'done'));
  const [pct, setPct] = useState(0);
  const lastTick = useRef(0);

  const finish = useCallback(() => {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage blocked: fine */ }
    setPhase('done');
  }, []);

  const enter = useCallback((withSound) => {
    if (withSound) { sfx.setEnabled(true); sfx.light(); } // runs inside the click, so the browser allows audio
    setPhase('run');
  }, []);

  // tell the lantern (ui/Lamp.jsx) to wait until the entry screen is gone
  useEffect(() => {
    const root = document.documentElement;
    if (phase === 'done') delete root.dataset.boot;
    else root.dataset.boot = 'on';
    return () => { delete root.dataset.boot; };
  }, [phase]);

  // lock scrolling while the overlay is up
  useEffect(() => {
    if (phase === 'done') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  // gate: any key = enter silently; auto-continue after GATE_MS
  useEffect(() => {
    if (phase !== 'gate') return undefined;
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') enter(false); else if (e.key.toLowerCase() === 's') enter(true); };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => enter(false), GATE_MS);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [phase, enter]);

  // run: counter driven by the clock, not by timers per stage
  useEffect(() => {
    if (phase !== 'run') return undefined;
    const start = performance.now();
    let raf;
    const loop = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / RUN_MS));
      const eased = 1 - Math.pow(1 - t, 2.2);
      const v = Math.round(eased * 100);
      setPct(v);
      if (v - lastTick.current >= 4) { lastTick.current = v; sfx.count(v / 100); }
      if (t < 1) raf = requestAnimationFrame(loop);
      else { sfx.boot(); setPhase('reveal'); }
    };
    raf = requestAnimationFrame(loop);
    const skip = () => { cancelAnimationFrame(raf); setPct(100); setPhase('reveal'); };
    window.addEventListener('keydown', skip);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', skip); };
  }, [phase]);

  // reveal: let the curtains play, then unmount
  useEffect(() => {
    if (phase !== 'reveal') return undefined;
    const t = setTimeout(finish, 900);
    return () => clearTimeout(t);
  }, [phase, finish]);

  if (phase === 'done') return null;

  const stageIdx = Math.max(0, Math.min(STAGES.length - 1, Math.floor(pct / 20)));
  const visibleLines = STAGES.slice(0, stageIdx + 1).flatMap((s) => s.lines).slice(-7);
  const reveal = phase === 'reveal';

  const half = (side) => ({
    position: 'fixed', left: 0, right: 0, [side]: 0, height: '50.2%', zIndex: 100000,
    background: '#0a0a0a', overflow: 'hidden',
  });
  const seamTransition = { duration: 0.75, ease: [0.76, 0, 0.24, 1] };

  const body = (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a0a', color: '#e5e7eb', ...mono }}>
      {/* faint engineering grid */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />

      {/* top bar */}
      <div style={{ position: 'absolute', top: 24, left: 28, right: 28, display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280' }}>
        <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 900, fontSize: 22, letterSpacing: '-0.04em', color: '#fff' }}>NY</span>
        <span style={{ textAlign: 'right', lineHeight: 1.7 }}>portfolio / prod<br />us-east-1 · {commit}</span>
      </div>

      {phase === 'gate' ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(24px, 8vw, 120px)' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cefe08', marginBottom: 20 }}>Nimesha Yasith · Cloud &amp; DevOps Engineer</p>
          <h1 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 'clamp(2.25rem, 7vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.03em', color: '#fff', margin: 0 }}>
            It&apos;s dark<br />in here<span style={{ color: '#cefe08' }}>.</span>
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 40 }}>
            <button type="button" onClick={() => enter(false)} autoFocus style={gateBtn(false)}>Enter</button>
            <button type="button" onClick={() => enter(true)} style={gateBtn(true)}>Light the lamp · with sound</button>
          </div>
          <p style={{ marginTop: 22, fontSize: 11, color: '#6b7280', letterSpacing: '0.06em' }}>
            the page is dark until you carry a lamp through it · enter ↵ · s = with sound · lights itself in a moment
          </p>
          <div aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, height: 3, background: '#cefe08', transformOrigin: 'left', animation: `nyGate ${GATE_MS}ms linear forwards`, width: '100%' }} />
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: '50%', right: 'clamp(24px, 6vw, 96px)', transform: 'translateY(-50%)', width: 'min(360px, 46vw)', fontSize: 12, lineHeight: 1.9, color: '#9ca3af' }}>
            {visibleLines.map((l) => (
              <div key={l} style={{ color: l.startsWith('$') ? '#e5e7eb' : '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
            ))}
          </div>

          <div style={{ position: 'absolute', left: 'clamp(24px, 6vw, 96px)', bottom: 56 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', color: '#cefe08', marginBottom: 6 }}>
              {String(stageIdx + 1).padStart(2, '0')}/05 · {STAGES[stageIdx].name}
            </p>
            <div style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 'clamp(5rem, 22vw, 15rem)', lineHeight: 0.85, letterSpacing: '-0.06em', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
              {String(pct).padStart(3, '0')}
              <span style={{ fontSize: '0.22em', letterSpacing: 0, color: '#6b7280', marginLeft: 8 }}>%</span>
            </div>
          </div>

          <div aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: 0, height: 4, width: `${pct}%`, background: '#cefe08', boxShadow: '0 0 18px rgba(206,254,8,0.6)' }} />
        </>
      )}
    </div>
  );

  return (
    <div role="status" aria-label="Loading portfolio">
      <style>{'@keyframes nyGate{from{transform:scaleX(1)}to{transform:scaleX(0)}}'}</style>
      {!reveal ? (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000 }} onClick={() => phase === 'run' && (setPct(100), setPhase('reveal'))}>{body}</div>
      ) : (
        <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
          <motion.div style={half('top')} initial={{ y: '0%' }} animate={{ y: '-100%' }} transition={seamTransition}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>{body}</div>
          </motion.div>
          <motion.div style={half('bottom')} initial={{ y: '0%' }} animate={{ y: '100%' }} transition={seamTransition}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>{body}</div>
          </motion.div>
          <motion.div
            style={{ position: 'fixed', left: 0, right: 0, top: '50%', height: 2, background: '#cefe08', zIndex: 100001, boxShadow: '0 0 24px #cefe08' }}
            initial={{ opacity: 1, scaleX: 1 }} animate={{ opacity: 0, scaleX: 1.02 }} transition={{ duration: 0.75 }}
          />
        </div>
      )}
    </div>
  );
}

function gateBtn(primary) {
  return {
    ...mono, cursor: 'pointer', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    padding: '14px 26px', borderRadius: 4,
    background: primary ? '#cefe08' : 'transparent', color: primary ? '#0a0a0a' : '#e5e7eb',
    border: primary ? '1px solid #cefe08' : '1px solid rgba(255,255,255,0.25)',
  };
}
