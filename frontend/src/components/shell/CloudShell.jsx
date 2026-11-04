import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TerminalSquare, X } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import { COMPLETIONS, SUGGESTIONS, bootBanner, runCommand } from './commands';

/**
 * CloudShell: the portfolio's terminal easter egg. A working command line
 * (a nod to AWS CloudShell) that lets visitors explore my projects, skills
 * and certifications by typing, run a fake-but-faithful `terraform plan`,
 * ping the real backend, ship a "deploy", or `sudo hire-me`.
 *
 * Opens from the navbar button, the footer, or the ` (backtick) / Ctrl+K hotkeys. It is deliberately
 * quiet: the signature interactive feature of the site is the Chaos Monkey (components/chaos).
 */

export const OPEN_EVENT = 'ny:open-shell';
export const openCloudShell = () => window.dispatchEvent(new Event(OPEN_EVENT));

/* The terminal is always dark (like a real one), so these are fixed colours
   and deliberately NOT theme variables. */
const COLORS = {
  out: '#e5e7eb',
  dim: '#9ca3af',
  accent: '#cefe08',
  ok: '#4ade80',
  warn: '#fbbf24',
  err: '#f87171',
  aws: '#ff9900',
  link: '#60a5fa',
  cmd: '#ffffff',
};

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function isTyping(target) {
  const tag = target?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable;
}

export default function CloudShell() {
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(() => bootBanner());
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const [burst, setBurst] = useState(0);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const draftRef = useRef('');

  /* ── open/close ── */
  const close = useCallback(() => setOpen(false), []);
  const show = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const onOpen = () => show();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      const hotkey = e.key === '`' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k');
      if (hotkey && (e.key !== '`' || !isTyping(e.target))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  /* ── running commands ── */
  const print = useCallback((l) => {
    const arr = Array.isArray(l) ? l : [l];
    setLines((prev) => [...prev, ...arr]);
  }, []);

  const execute = useCallback(
    async (raw) => {
      const line = raw.trim();
      if (!line || busy) return;
      setLines((prev) => [...prev, { kind: 'cmd', text: line }]);
      setHistory((h) => [...h, line]);
      setHIdx(-1);
      setInput('');

      const first = line.split(/\s+/)[0].toLowerCase();
      if (first === 'clear' || first === 'cls') return setLines([]);
      if (first === 'exit' || first === 'quit') return close();
      if (first === 'history') {
        return print([...history, line].map((h, i) => ({ kind: 'dim', text: `  ${String(i + 1).padStart(3, ' ')}  ${h}` })));
      }

      setBusy(true);
      try {
        const effect = await runCommand(line, { print, sleep, navigate, close, theme, setTheme });
        if (effect === 'confetti') setBurst((b) => b + 1);
      } catch (err) {
        print({ kind: 'err', text: `error: ${err.message}` });
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
    },
    [busy, close, history, navigate, print, setTheme, theme],
  );

  const complete = () => {
    const v = input.trimStart().toLowerCase();
    if (!v) return;
    const matches = COMPLETIONS.filter((c) => c.startsWith(v));
    if (matches.length === 1) setInput(`${matches[0]} `);
    else if (matches.length > 1) {
      // complete the longest common prefix, then list options
      let prefix = matches[0];
      matches.forEach((m) => {
        while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
      });
      if (prefix.length > v.length) setInput(prefix);
      else print([{ kind: 'cmd', text: input }, { kind: 'dim', text: matches.join('   ') }]);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      if (hIdx === -1) draftRef.current = input;
      const next = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx === -1) return;
      const next = hIdx + 1;
      if (next >= history.length) {
        setHIdx(-1);
        setInput(draftRef.current);
      } else {
        setHIdx(next);
        setInput(history[next]);
      }
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        dx: (Math.random() - 0.5) * 520,
        dy: -(120 + Math.random() * 300),
        rot: Math.random() * 720 - 360,
        delay: Math.random() * 0.12,
        color: ['#cefe08', '#a8cc00', '#ff9900', '#60a5fa', '#ffffff'][i % 5],
      })),
    // regenerate each burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst],
  );

  return (
    <>
      <style>{`
        @keyframes shellRing { 0% { box-shadow: 0 0 0 0 rgba(206,254,8,0.55); } 80%,100% { box-shadow: 0 0 0 16px rgba(206,254,8,0); } }
        @keyframes shellBlink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes shellConfetti { 0% { transform: translate(0,0) rotate(0); opacity: 1 } 100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0 } }
        .ny-shell-launcher:hover { transform: translateY(-2px); }
        .ny-shell-scroll::-webkit-scrollbar { width: 6px; }
        .ny-shell-chip:hover { border-color: var(--accent); color: var(--accent-ink); }
      `}</style>

      {/* ── Terminal window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100001,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(8px, 3vw, 28px)',
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="CloudShell terminal"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: 860,
                height: 'min(78vh, 660px)',
                display: 'flex',
                flexDirection: 'column',
                background: '#0b0d0f',
                border: '1px solid rgba(206,254,8,0.25)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 30px 90px rgba(0,0,0,0.6), 0 0 60px rgba(206,254,8,0.08)',
                color: '#e5e7eb',
              }}
            >
              {/* title bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: '#13161a',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close terminal"
                  style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0 }}
                />
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e' }} />
                <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ flex: 1, textAlign: 'center', fontFamily: MONO, fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  nimesha@aws-portfolio: ~
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: 2 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* output */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                className="ny-shell-scroll"
                onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus()}
                style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', fontFamily: MONO, fontSize: 13, lineHeight: 1.6 }}
              >
                {lines.map((l, i) => (
                  <Line key={i} line={l} />
                ))}

                {/* input line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    nimesha@aws<span style={{ color: '#9ca3af' }}>:~$</span>
                  </span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    disabled={busy}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    aria-label="Terminal input"
                    placeholder={busy ? 'running…' : "type 'help'"}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontFamily: MONO,
                      fontSize: 13,
                      caretColor: 'var(--accent)',
                      padding: 0,
                      boxShadow: 'none',
                    }}
                  />
                  {busy && <span style={{ color: 'var(--accent)', animation: 'shellBlink 0.8s step-end infinite' }}>▍</span>}
                </div>
              </div>

              {/* quick-run chips: essential on touch devices with no hotkeys */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  padding: '10px 14px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  background: '#0f1215',
                }}
              >
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#6b7280', alignSelf: 'center' }}>Try:</span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="ny-shell-chip"
                    disabled={busy}
                    onClick={() => execute(s)}
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      padding: '4px 11px',
                      borderRadius: 20,
                      background: 'transparent',
                      color: '#d1d5db',
                      border: '1px solid rgba(255,255,255,0.14)',
                      cursor: busy ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* confetti burst */}
              {burst > 0 && (
                <div key={burst} aria-hidden style={{ position: 'absolute', left: '50%', bottom: 70, pointerEvents: 'none' }}>
                  {particles.map((p) => (
                    <span
                      key={p.id}
                      style={{
                        position: 'absolute',
                        width: 8,
                        height: 12,
                        background: p.color,
                        borderRadius: 2,
                        '--dx': `${p.dx}px`,
                        '--dy': `${p.dy}px`,
                        '--rot': `${p.rot}deg`,
                        animation: `shellConfetti 1.4s ${p.delay}s cubic-bezier(0.16, 0.8, 0.3, 1) forwards`,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Line({ line }) {
  const common = { whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '1.6em' };
  if (line.kind === 'cmd') {
    return (
      <div style={common}>
        <span style={{ color: 'var(--accent)' }}>
          nimesha@aws<span style={{ color: '#9ca3af' }}>:~$</span>
        </span>{' '}
        <span style={{ color: '#fff' }}>{line.text}</span>
      </div>
    );
  }
  if (line.kind === 'link') {
    return (
      <div style={common}>
        <a href={line.href} target="_blank" rel="noreferrer" style={{ color: COLORS.link, textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {line.text}
        </a>
      </div>
    );
  }
  return <div style={{ ...common, color: COLORS[line.kind] || COLORS.out }}>{line.text || ' '}</div>;
}
