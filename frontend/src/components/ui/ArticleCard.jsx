import { ExternalLink, Clock } from 'lucide-react';
import GlassCard from './GlassCard';
import ArticleCover from './ArticleCover';
import { SOURCES } from '../../data/feeds.config';

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** One article, whichever platform it was published on. */
export default function ArticleCard({ article, tagCount = 1 }) {
  const src = SOURCES[article.source] || SOURCES.medium;
  return (
    <GlassCard className="overflow-hidden group h-full flex flex-col" hover={false}>
      <ArticleCover article={article} className="h-48" imgClassName="group-hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/10 to-transparent" />
        <span
          className="t-label absolute top-3 left-3 px-2.5 py-1 rounded-md"
          style={{ background: 'rgba(0,0,0,0.72)', color: src.color, border: `1px solid ${src.color}55` }}
        >
          {src.label}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
          {article.tags?.slice(0, tagCount).map((tag) => (
            <span key={tag} className="t-label px-2 py-1 rounded-md" style={{ background: 'rgba(0,0,0,0.6)', color: '#e5e7eb' }}>
              {tag}
            </span>
          ))}
        </div>
      </ArticleCover>

      <div className="p-5 flex flex-col flex-1">
        <p className="t-small flex items-center gap-3 mb-3">
          <span>{fmt(article.pubDate)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime} min read</span>
        </p>
        <h3 className="t-h3 mb-2 line-clamp-3 group-hover:text-accent-500 transition-colors">
          <a href={article.link} target="_blank" rel="noreferrer">{article.title}</a>
        </h3>
        <p className="t-body mb-5 line-clamp-3 flex-1">{article.summary}</p>
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium w-fit transition-colors"
          style={{ color: 'var(--accent-ink)', fontFamily: 'Inter, sans-serif' }}
        >
          Read on {src.label} <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </GlassCard>
  );
}
