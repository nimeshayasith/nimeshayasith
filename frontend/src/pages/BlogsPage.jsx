import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, BookOpen } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import ArticleCard from '../components/ui/ArticleCard';
import LiveBadge from '../components/ui/LiveBadge';
import { overallStatus } from '../components/sections/Blogs';
import { useArticles } from '../hooks/useFeeds';
import { FEEDS, SOURCES } from '../data/feeds.config';
import { SNAPSHOT_TIME } from '../data/feeds';

const PROFILES = [
  { key: 'medium', url: FEEDS.medium.profileUrl },
  { key: 'devto', url: FEEDS.devto.profileUrl },
  { key: 'aws', url: FEEDS.awsBuilder.profileUrl },
];

export default function BlogsPage() {
  const { articles, status } = useArticles();
  const [source, setSource] = useState('all');
  const [tag, setTag] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [visible, setVisible] = useState(9);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Articles | Nimesha Yasith';
  }, []);

  const counts = useMemo(() => {
    const c = { all: articles.length };
    for (const a of articles) c[a.source] = (c[a.source] || 0) + 1;
    return c;
  }, [articles]);

  const bySource = useMemo(() => (source === 'all' ? articles : articles.filter((a) => a.source === source)), [articles, source]);
  const tags = useMemo(() => {
    const t = new Map();
    bySource.forEach((a) => a.tags?.forEach((x) => t.set(x, (t.get(x) || 0) + 1)));
    return ['All', ...[...t.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([x]) => x)];
  }, [bySource]);

  const shown = useMemo(() => {
    let list = bySource;
    if (tag !== 'All') list = list.filter((a) => a.tags?.includes(tag));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.tags?.some((x) => x.toLowerCase().includes(q)));
    }
    return [...list].sort((a, b) => (sort === 'newest' ? new Date(b.pubDate) - new Date(a.pubDate) : new Date(a.pubDate) - new Date(b.pubDate)));
  }, [bySource, tag, query, sort]);

  const chip = (active) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${active ? 'bg-accent-500 text-black' : 'glass glass-hover text-slate-400'}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pb-24">
        <div className="page-wrap">
          <SectionHeading
            as="h1"
            label="Writing"
            title={<>My <span className="gradient-text">articles</span></>}
            lead="Deep dives and field notes on cloud, DevOps, security and computer vision. Everything I publish on Medium, DEV and AWS Builder Center lands here by itself."
            aside={<LiveBadge status={overallStatus(status)} liveLabel="checked live just now" staticLabel={`bundled ${new Date(SNAPSHOT_TIME).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`} />}
            animate={false}
          />

          {/* Platform filter + profile links */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button type="button" onClick={() => { setSource('all'); setTag('All'); }} className={chip(source === 'all')}>
              All ({counts.all})
            </button>
            {PROFILES.map(({ key }) => (
              <button key={key} type="button" onClick={() => { setSource(key); setTag('All'); }} className={chip(source === key)}>
                {SOURCES[key].label} ({counts[key] || 0})
              </button>
            ))}
            <span className="hidden md:block flex-1" />
            {PROFILES.map(({ key, url }) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" className="t-label inline-flex items-center gap-1.5 hover:text-accent-500 transition-colors">
                {SOURCES[key].label} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-500/50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort articles"
              className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <option value="newest" className="bg-slate-900">Newest first</option>
              <option value="oldest" className="bg-slate-900">Oldest first</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`t-label px-3 py-1.5 rounded-md transition-colors ${tag === t ? 'bg-accent-500 !text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          {shown.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {shown.slice(0, visible).map((a) => (
                  <motion.div key={a.link} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} className="h-full">
                    <ArticleCard article={a} tagCount={2} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="glass p-12 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-4 text-slate-600" />
              <h3 className="t-h3 mb-2">{source !== 'all' && !counts[source] ? `Nothing on ${SOURCES[source].label} yet` : 'No articles match'}</h3>
              <p className="t-body">
                {source !== 'all' && !counts[source]
                  ? 'New posts show up here automatically after they are published.'
                  : 'Try a different search or tag.'}
              </p>
            </div>
          )}

          {visible < shown.length && (
            <div className="mt-10">
              <button type="button" onClick={() => setVisible((v) => v + 9)} className="btn-outline">
                Show more ({shown.length - visible} left)
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
