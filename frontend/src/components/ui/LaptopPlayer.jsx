import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Play, Eye, ArrowRight } from 'lucide-react';
import { VideoModal } from './VideoCard';
import { sfx } from '../../lib/sfx';

const ROTATE_MS = 7000;
const short = (t = '') => t.replace(/\s*\|.*$/, '');
const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

/**
 * A laptop whose screen plays the project demos, with an "up next" list beside it.
 *
 *   items: [{ video, project? }]   (video: { id, title, thumb, published, views, url })
 *
 * The screen "changes channel" every few seconds while it is on screen (stops on hover, on keyboard
 * focus, with reduced motion, or while the player is open). Clicking the screen opens the player.
 */
export default function LaptopPlayer({ items }) {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.35 });
  const [idx, setIdx] = useState(0);
  const [held, setHeld] = useState(false);
  const [open, setOpen] = useState(false);

  const count = items.length;
  const safe = Math.min(idx, Math.max(0, count - 1));
  const running = count > 1 && !reduce && inView && !held && !open;

  useEffect(() => {
    if (!running) return undefined;
    const t = setTimeout(() => setIdx((i) => (i + 1) % count), ROTATE_MS);
    return () => clearTimeout(t);
  }, [running, safe, count]);

  if (!count) return null;
  const { video, project } = items[safe];
  const select = (i) => { sfx.click(); setIdx(i); };
  const hold = { onMouseEnter: () => setHeld(true), onMouseLeave: () => setHeld(false), onFocus: () => setHeld(true), onBlur: () => setHeld(false) };

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-center">
      {/* ── the laptop ── */}
      <div {...hold}>
        <div className="laptop">
          <div className="laptop-lid">
            <span className="laptop-cam" aria-hidden="true" />
            <button
              type="button"
              className="laptop-screen group"
              onClick={() => { sfx.click(); setOpen(true); }}
              aria-label={`Play demo: ${short(video.title)}`}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={video.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { clipPath: 'inset(50% 0 50% 0)', filter: 'brightness(2.2)' }}
                  animate={{ clipPath: 'inset(0% 0 0% 0)', filter: 'brightness(1)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <img src={video.thumb} alt="" decoding="async" className="laptop-shot" />
                  <span className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35) 100%)' }} />
                  <span className="laptop-caption absolute left-4 right-4 bottom-8 sm:bottom-9 text-left">
                    <span className="t-label block mb-1.5" style={{ color: 'var(--accent)' }}>Now playing</span>
                    <span className="block line-clamp-2" style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 'clamp(0.9rem, 1.7vw, 1.0625rem)', lineHeight: 1.3, color: '#fff' }}>
                      {short(video.title)}
                    </span>
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* window chrome */}
              <span className="laptop-chrome" aria-hidden="true">
                <i /><i /><i />
                <span>~/demos/{project?._id ?? video.id}.mp4</span>
              </span>

              <span className="laptop-play" aria-hidden="true">
                <Play style={{ width: 26, height: 26, color: '#111', marginLeft: 3 }} fill="#111" />
              </span>

              {/* reel timer: shows when the next demo comes up, not the video's own progress */}
              {running && <span key={`${safe}`} className="laptop-timer" aria-hidden="true"><span style={{ animationDuration: `${ROTATE_MS}ms` }} /></span>}
              <span className="laptop-glare" aria-hidden="true" />
            </button>
          </div>
          <div className="laptop-base" aria-hidden="true" />
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div style={{ minWidth: 0 }}>
            <p className="t-label mb-1.5">{project ? 'Project demo' : 'Video'} · {fmt(video.published)}{video.views > 0 && <> · <Eye className="w-3 h-3 inline -mt-0.5" /> {video.views.toLocaleString()}</>}</p>
            <h3 className="t-h3">{project ? project.title : short(video.title)}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {project && (
              <Link to={`/projects/${project._id}`} className="btn-outline">
                Case study <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <button type="button" className="btn-primary" onClick={() => { sfx.click(); setOpen(true); }}>
              <span className="btn-icon"><Play className="w-4 h-4" /></span>
              Watch demo
            </button>
          </div>
        </div>
      </div>

      {/* ── up next ── */}
      <div className="glass overflow-hidden" {...hold}>
        <p className="t-label px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          Up next · {count} {count === 1 ? 'demo' : 'demos'}
        </p>
        <ul className="reel-list" role="list">
          {items.map((it, i) => {
            const active = i === safe;
            return (
              <li key={it.video.id}>
                <button type="button" className={`reel-item ${active ? 'is-active' : ''}`} onClick={() => select(i)} aria-current={active ? 'true' : undefined}>
                  <span className="reel-thumb">
                    <img src={it.video.thumb} alt="" loading="lazy" decoding="async" />
                    {active && (
                      <span className="reel-eq" aria-hidden="true"><i /><i /><i /></span>
                    )}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span className="t-body block line-clamp-2" style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                      {it.project ? it.project.title.replace(/:.*$/, '') : short(it.video.title)}
                    </span>
                    <span className="t-small block mt-1">{fmt(it.video.published)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <VideoModal video={open ? video : null} onClose={() => setOpen(false)} />
    </div>
  );
}
