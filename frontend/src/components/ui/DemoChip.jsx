import { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoCard';
import { sfx } from '../../lib/sfx';

/** Small "Demo" button for a project card. Opens the YouTube player. Render it outside any <a>. */
export default function DemoChip({ video, project, className = '' }) {
  const [open, setOpen] = useState(false);
  if (!video) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => { sfx.click(); setOpen(true); }}
        aria-label={`Watch the demo video of ${project}`}
        className={`demo-chip ${className}`}
      >
        <Play style={{ width: 11, height: 11 }} fill="currentColor" /> Demo
      </button>
      <VideoModal video={open ? video : null} onClose={() => setOpen(false)} />
    </>
  );
}
