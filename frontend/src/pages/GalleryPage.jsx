import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import LiveBadge from '../components/ui/LiveBadge';
import Lightbox from '../components/ui/Lightbox';
import useBackend from '../hooks/useBackend';
import { galleryApi } from '../services/api';
import { GALLERY, mergeGallery } from '../data/gallery';

export default function GalleryPage() {
  // Static-first: bundled photos at once, backend photos merged in when it answers.
  const { data: items, status } = useBackend(() => galleryApi.getAll(), {
    fallback: GALLERY,
    select: (res) => res.items ?? res.gallery ?? res.data,
    merge: mergeGallery,
  });
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Gallery | Nimesha Yasith';
  }, []);

  const categories = useMemo(() => ['All', ...new Set(items.map((i) => i.category))], [items]);
  const shown = useMemo(() => (category === 'All' ? items : items.filter((i) => i.category === category)), [items, category]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <SectionHeading as="h1" label="Moments" title={<>My <span className="gradient-text">Gallery</span></>}
          lead={<>Campus days, community events and the people behind the commits.</>}
          aside={<LiveBadge status={status} liveLabel="photos synced from my backend" staticLabel="bundled photos" />}
          animate={false}
        />
      </div>

      <div className="page-wrap pb-20">
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${category === c ? 'bg-accent-500 text-black' : 'glass glass-hover text-slate-400'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {shown.map((item, i) => (
            <motion.button
              key={item._id}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${item.title}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
              className="glass group relative block w-full mb-5 overflow-hidden p-0 text-left cursor-zoom-in"
              style={{ breakInside: 'avoid' }}
            >
              <img src={item.url} alt={item.title} loading="lazy" className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 to-transparent">
                <p className="font-heading font-bold text-white text-sm leading-tight">{item.title}</p>
                {item.caption && <p className="t-small mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{item.caption}</p>}
              </div>
              <span className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                <ZoomIn className="w-4 h-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox items={shown} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      <Footer />
    </div>
  );
}
