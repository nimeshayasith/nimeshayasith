import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, Instagram, Heart, MapPin, Pause, Play } from 'lucide-react';

/* ─── Slide data ──────────────────────────────────────────────────────────
   Replace these with real photos — the admin can upload via Cloudinary.
   For Instagram: connect at nimeshayasith on Instagram.
────────────────────────────────────────────────────────────────────────── */
const MEMORIES = [
  {
    id: 1,
    src: '/memory_uni_lab.jpg',
    caption: 'Late nights at the computer lab',
    location: 'Faculty of Engineering, University of Ruhuna',
    category: 'University',
    color: '#818cf8',
  },
  {
    id: 2,
    src: '/memory_travel_beach.jpg',
    caption: 'Beach trip with the gang',
    location: 'Sri Lanka Coast',
    category: 'Travel',
    color: '#22d3ee',
  },
  {
    id: 3,
    src: '/memory_graduation.jpg',
    caption: 'Almost there — graduation is near!',
    location: 'University of Ruhuna, Hapugala',
    category: 'University',
    color: '#cefe08',
  },
];

const CATEGORY_COLORS = {
  University: '#818cf8',
  Travel:     '#22d3ee',
  Friends:    '#fb923c',
  Memories:   '#cefe08',
};

export default function MemoriesSlideshow() {
  const [current, setCurrent]   = useState(0);
  const [playing, setPlaying]   = useState(true);
  const [liked, setLiked]       = useState({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const intervalRef = useRef(null);
  const total = MEMORIES.length;

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrent(c => (c + dir + total) % total);
  }, [total]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => go(1), 4500);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, go]);

  const slide = MEMORIES[current];
  const catColor = CATEGORY_COLORS[slide.category] || '#818cf8';

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.97 }),
  };

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)' }}>
            <Camera className="w-4 h-4" style={{ color: 'var(--accent-ink)' }} />
          </div>
          <div>
            <h3 className="t-h3">Life Beyond Code</h3>
            <p className="t-small">University memories &amp; adventures</p>
          </div>
        </div>

        {/* Instagram link */}
        <a
          href="https://www.instagram.com/nimeshayasith"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(225,48,108,0.15), rgba(193,53,132,0.15))',
            border: '1px solid rgba(225,48,108,0.3)',
            color: '#f472b6',
          }}
        >
          <Instagram className="w-3.5 h-3.5" />
          @nimeshayasith
        </a>
      </div>

      {/* Slideshow */}
      <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#0a0a0f' }}>
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            <img
              src={slide.src}
              alt={slide.caption}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
            />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${catColor}25`, color: catColor, border: `1px solid ${catColor}40`, backdropFilter: 'blur(8px)' }}
              >
                {slide.category}
              </span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-semibold text-sm leading-snug mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {slide.caption}
              </p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>{slide.location}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Like button */}
        <button
          onClick={() => setLiked(l => ({ ...l, [slide.id]: !l[slide.id] }))}
          className="absolute top-4 right-4 p-2 rounded-xl transition-all hover:scale-110 active:scale-95"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Heart
            className="w-4 h-4 transition-all"
            style={{ color: liked[slide.id] ? '#f43f5e' : '#94a3b8', fill: liked[slide.id] ? '#f43f5e' : 'none' }}
          />
        </button>

        {/* Prev / Next */}
        <button
          onClick={() => { go(-1); setPlaying(false); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white/80 hover:text-white transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => { go(1); setPlaying(false); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-white/80 hover:text-white transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => setPlaying(p => !p)}
          className="absolute bottom-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white transition-all"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Dot indicators + progress bar */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {MEMORIES.map((m, i) => (
            <button
              key={m.id}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setPlaying(false); }}
              className="transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 9999,
                background: i === current ? CATEGORY_COLORS[MEMORIES[i].category] || '#cefe08' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Auto-play progress bar */}
        {playing && (
          <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              key={`${current}-progress`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="h-full rounded-full"
              style={{ background: catColor }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {MEMORIES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); setPlaying(false); }}
            className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
            style={{
              width: 72, height: 48,
              outline: i === current ? `2px solid ${CATEGORY_COLORS[m.category] || '#cefe08'}` : '2px solid transparent',
              outlineOffset: 2,
              opacity: i === current ? 1 : 0.5,
            }}
          >
            <img src={m.src} alt={m.caption} className="w-full h-full object-cover" draggable={false} />
          </button>
        ))}
      </div>
    </div>
  );
}
