import { motion } from 'framer-motion';
import { ArrowRight, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import VideoCard from '../ui/VideoCard';
import LiveBadge from '../ui/LiveBadge';
import { useVideos } from '../../hooks/useFeeds';
import { FEEDS } from '../../data/feeds.config';

export default function Videos() {
  const { videos, status } = useVideos();
  const [lead, ...rest] = videos;
  const next = rest.slice(0, 3);

  return (
    <section id="videos" className="section-padding">
      <SectionHeading
        index="07"
        label="Demos"
        title={<>Projects, <span className="gradient-text">on video</span></>}
        lead="Walkthroughs and demos from my YouTube channel. A new upload shows up here by itself."
        aside={<LiveBadge status={status} liveLabel="synced with YouTube" staticLabel="bundled at last build" />}
      />

      {lead && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <VideoCard video={lead} featured />
          </motion.div>
          <div className="lg:col-span-2 grid gap-6 content-start">
            {next.slice(0, 2).map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}>
                <VideoCard video={v} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/videos" className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
          <span className="btn-icon"><ArrowRight className="w-4 h-4" /></span>
          All {videos.length} videos
        </Link>
        <a href={FEEDS.youtube.channelUrl} target="_blank" rel="noreferrer" className="btn-outline">
          <Youtube className="w-4 h-4" /> Subscribe
        </a>
      </div>
    </section>
  );
}
