import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import VideoCard from '../components/ui/VideoCard';
import LiveBadge from '../components/ui/LiveBadge';
import { useVideos } from '../hooks/useFeeds';
import { FEEDS } from '../data/feeds.config';

export default function VideosPage() {
  const { videos, status } = useVideos();
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Videos | Nimesha Yasith';
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? videos.filter((v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)) : videos;
  }, [videos, query]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap pb-24">
        <SectionHeading
          as="h1"
          label="Demos"
          title={<>Projects, <span className="gradient-text">on video</span></>}
          lead="Demos and walkthroughs from my YouTube channel: AWS and Kubernetes builds, security research and software projects."
          aside={<LiveBadge status={status} liveLabel="synced with YouTube" staticLabel="bundled at last build" />}
          animate={false}
        />

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search videos…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-500/50"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          <a href={FEEDS.youtube.channelUrl} target="_blank" rel="noreferrer" className="btn-outline">
            <Youtube className="w-4 h-4" /> Open channel
          </a>
        </div>

        {shown.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}>
                <VideoCard video={v} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass p-12 text-center"><p className="t-body">No videos match “{query}”.</p></div>
        )}
      </div>

      <Footer />
    </div>
  );
}
