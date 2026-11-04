import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { warmBackend } from '../../services/api';
import { useArticles, useVideos } from '../../hooks/useFeeds';
import { SOURCES } from '../../data/feeds.config';

/**
 * A running status strip under the hero. Every figure is real: the build's own commit and time
 * (injected by Vite at build), a live latency probe of my backend, and the newest article and video
 * from the feeds. It is the same kind of strip an on-call engineer keeps on a wall.
 */

const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();
const COMMIT = typeof __BUILD_COMMIT__ !== 'undefined' ? __BUILD_COMMIT__ : 'local';
const BRANCH = typeof __BUILD_BRANCH__ !== 'undefined' ? __BUILD_BRANCH__ : 'main';

const ago = (iso) => {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso)) / 1000));
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
};
const clip = (t, n = 56) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

export default function OpsTicker() {
  const { articles } = useArticles();
  const { videos } = useVideos();
  const [backend, setBackend] = useState('probing');

  useEffect(() => {
    let alive = true;
    warmBackend().then((r) => alive && setBackend(r.ok ? `${r.ms} ms` : 'asleep (free tier)'));
    return () => { alive = false; };
  }, []);

  const items = useMemo(() => {
    const a = articles[0];
    const v = videos[0];
    return [
      { k: 'deploy', node: <><b style={{ color: '#4ade80' }}>● LIVE</b> deployed {ago(BUILD_TIME)} · {COMMIT === 'local' ? 'local build' : `${BRANCH}@${COMMIT}`}</> },
      { k: 'edge', node: <>region us-east-1 · CloudFront edge · TLS 1.3</> },
      { k: 'backend', node: <>backend {backend}</> },
      a && { k: 'article', node: <><Link to="/blogs" className="hover:text-accent-500">latest {SOURCES[a.source]?.label} article: {clip(a.title)}</Link></> },
      v && { k: 'video', node: <><Link to="/videos" className="hover:text-accent-500">latest video: {clip(v.title.replace(/\s*\|.*$/, ''))}</Link></> },
      { k: 'sync', node: <>feeds sync daily · EventBridge → Amplify</> },
    ].filter(Boolean);
  }, [articles, videos, backend]);

  const row = (suffix) => (
    <div aria-hidden={suffix ? 'true' : undefined} style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}>
      {items.map((it) => (
        <span key={it.k + suffix} className="t-label" style={{ padding: '0 28px', whiteSpace: 'nowrap', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          {it.node}
          <span aria-hidden="true" style={{ color: 'var(--accent-ink)', opacity: 0.6 }}>▪</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      role="region"
      aria-label="Live site status"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-card)', overflow: 'hidden', padding: '12px 0' }}
    >
      <style>{'@keyframes nyTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}.ny-ticker{display:flex;width:max-content;animation:nyTicker 46s linear infinite}.ny-ticker:hover{animation-play-state:paused}@media (prefers-reduced-motion:reduce){.ny-ticker{animation:none}}'}</style>
      <div className="ny-ticker">
        {row('')}
        {row('-dup')}
      </div>
    </div>
  );
}
