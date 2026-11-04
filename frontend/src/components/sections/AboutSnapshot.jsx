import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, Layers, GitBranch, Box, Activity, Terminal, Trophy, MapPin, GraduationCap } from 'lucide-react';
import { BIO, HIGHLIGHTS, ACHIEVEMENTS, PERSONAL } from '../../data/profile';

const ICONS = { Cloud, Layers, GitBranch, Box, Activity, Terminal };

/** Compact "About Me" for the home page. The full story lives at /about. */
export default function AboutSnapshot() {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true });
  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="about" ref={ref} className="section-padding">
      <SectionHeading index="01" label="About Me" title={<>Cloud engineer, <span className="gradient-text">by habit</span></>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
        <motion.div {...fade(0.1)} className="space-y-5">
          <p className="text-slate-300 leading-relaxed text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
            {BIO[0]}
          </p>
          <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
            {BIO[1]}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {PERSONAL.location}</span>
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> B.Sc. Eng. (Hons), University of Ruhuna</span>
          </div>

          <div className="grid gap-3 pt-2">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.title} className="flex gap-3 items-start glass p-4">
                <Trophy className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-ink)' }} />
                <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-white font-semibold">{a.title}:</span> {a.detail}
                </p>
              </div>
            ))}
          </div>

          <Link to="/about" className="btn-primary inline-flex mt-2" style={{ width: 'fit-content' }}>
            <span className="btn-icon"><ArrowRight className="w-4 h-4" /></span>
            Read my full story
          </Link>
        </motion.div>

        <motion.div {...fade(0.2)} className="grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map(({ icon, label, desc, color }, i) => {
            const Icon = ICONS[icon] || Cloud;
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                className="glass glass-hover p-4 flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold font-heading mb-0.5">{label}</p>
                  <p className="t-small" style={{ fontFamily: 'Inter, sans-serif' }}>{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
