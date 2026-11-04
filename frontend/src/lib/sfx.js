/**
 * Tiny synthesised UI sound system (Web Audio, no audio files to download).
 *
 * Off until the visitor turns it on (the entry screen asks, and a speaker button stays on screen).
 * Browsers only allow audio after a user gesture, so everything here is a silent no-op until then.
 * The choice is remembered in localStorage (wrapped in try/catch: it can throw in private windows).
 */
const KEY = 'ny-sound';

let ctx = null;
let master = null;
let noiseBuf = null;
let on = false;
try { on = localStorage.getItem(KEY) === 'on'; } catch { /* private mode: stay silent */ }

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function ensure() {
  if (typeof window === 'undefined') return false;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return true;
}

function tone(freq, { dur = 0.1, type = 'sine', vol = 0.08, at = 0, to = null } = {}) {
  if (!on || !ensure()) return;
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function noise({ dur = 0.3, from = 300, to = 3000, vol = 0.05, at = 0 } = {}) {
  if (!on || !ensure()) return;
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t0 = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

export const sfx = {
  get enabled() { return on; },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  /** Must be called from a click/keypress so the browser lets audio start. */
  setEnabled(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* ignore */ }
    if (on) { ensure(); this.click(); }
    emit();
  },
  toggle() { this.setEnabled(!on); },

  hover()   { tone(1400, { dur: 0.03, type: 'square', vol: 0.012 }); },
  click()   { tone(520, { dur: 0.07, type: 'triangle', vol: 0.07, to: 880 }); },
  route()   { noise({ dur: 0.28, from: 250, to: 2600, vol: 0.05 }); },
  /** n in 0..1: a ticking counter that climbs in pitch as the boot progresses */
  count(n)  { tone(300 + n * 700, { dur: 0.035, type: 'square', vol: 0.022 }); },
  boot()    { [392, 523, 659, 784].forEach((f, i) => tone(f, { dur: 0.16, type: 'triangle', vol: 0.07, at: i * 0.075 })); },
  success() { [523, 659, 784, 1047].forEach((f, i) => tone(f, { dur: 0.22, type: 'sine', vol: 0.08, at: i * 0.09 })); },
  error()   { tone(110, { dur: 0.22, type: 'sawtooth', vol: 0.09, to: 70 }); tone(110, { dur: 0.22, type: 'sawtooth', vol: 0.09, at: 0.28, to: 70 }); },
  alarm()   { for (let i = 0; i < 4; i++) tone(i % 2 ? 660 : 880, { dur: 0.14, type: 'square', vol: 0.05, at: i * 0.16 }); },
  heal()    { tone(440, { dur: 0.09, type: 'sine', vol: 0.08 }); tone(660, { dur: 0.14, type: 'sine', vol: 0.08, at: 0.08 }); },
  /** a match strike, then a soft whoosh as the wick catches */
  light()   {
    noise({ dur: 0.16, from: 2200, to: 6000, vol: 0.08 });
    noise({ dur: 0.6, from: 180, to: 800, vol: 0.06, at: 0.14 });
    tone(196, { dur: 0.6, type: 'sine', vol: 0.05, at: 0.16 });
    tone(294, { dur: 0.6, type: 'sine', vol: 0.04, at: 0.2 });
  },
};
