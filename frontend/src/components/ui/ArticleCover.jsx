import { useMemo, useState } from 'react';
import { LOCAL_COVERS, postId } from '../../data/articles';

/**
 * Cover image for a Medium article that can't end up blank:
 *   1. the bundled copy in /public/blog (instant, works offline);
 *   2. Medium's own thumbnail (served from its CDN, the new resize URL);
 *   3. a generated cover (gradient + first tag) when neither exists or loads.
 */
const hue = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

// cdn-images-1.medium.com/max/1024/<id>  ->  cdn-images-1.medium.com/v2/resize:fit:1024/<id> (skips a redirect)
const modern = (url) => url?.replace(/\/max\/(\d+)\//, '/v2/resize:fit:$1/');

export default function ArticleCover({ article, className = '', imgClassName = '', children }) {
  const sources = useMemo(
    () => [LOCAL_COVERS[postId(article)], modern(article.thumbnail)].filter(Boolean),
    [article],
  );
  const [failed, setFailed] = useState(0);
  const src = sources[failed];
  const h = hue(postId(article) || article.title);
  const label = article.tags?.[0] || 'Medium';

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: 'var(--bg-inverse)' }}>
      {src ? (
        <img
          key={src}
          src={src}
          alt={article.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed((n) => n + 1)}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          aria-hidden="true"
          className="w-full h-full flex flex-col justify-end p-5"
          style={{
            background: `radial-gradient(120% 90% at 100% 0%, hsla(${h},70%,45%,0.55), transparent 60%), linear-gradient(135deg, hsl(${h},35%,14%), #0a0a0a)`,
          }}
        >
          <span
            style={{
              position: 'absolute', top: 10, right: 16, fontFamily: 'Unbounded, sans-serif', fontWeight: 900,
              fontSize: 64, lineHeight: 1, color: 'rgba(255,255,255,0.07)',
            }}
          >
            M
          </span>
          <span
            style={{
              fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12, color: 'var(--accent)', letterSpacing: 0.5,
            }}
          >
            $ cat ./{label}.md
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
