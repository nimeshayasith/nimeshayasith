import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LaptopPlayer from '../ui/LaptopPlayer';
import LiveBadge from '../ui/LiveBadge';
import { useVideos } from '../../hooks/useFeeds';
import { projectDemos } from '../../data/feeds';

/**
 * The project demos on a laptop. `limit` keeps the home page short; /projects shows them all.
 * Only videos that belong to a project are shown here. Every upload stays on /videos.
 */
export default function ProjectReel({ limit, className = '' }) {
  const { videos, status } = useVideos();
  const demos = projectDemos(videos);
  if (!demos.length) return null;
  const items = limit ? demos.slice(0, limit) : demos;

  return (
    <div className={className} aria-label="Project demo videos">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <p className="t-label">Demo reel · {demos.length} projects on video</p>
        <LiveBadge status={status} liveLabel="synced with YouTube" staticLabel="bundled at last build" />
      </div>
      <LaptopPlayer items={items} />
      {limit && demos.length > limit && (
        <div className="mt-10">
          <Link to="/projects#demos" className="btn-outline">
            All {demos.length} project demos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
