import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Github, Linkedin, Youtube, BookOpen,
  ArrowRight, Mail, FolderGit2, Cpu, Award, Flame,
} from 'lucide-react';
import myPhoto from '../../assets/my.jpeg';
import { PERSONAL, ROLES, SOCIAL_LINKS } from '../../data/profile';
import { PROJECTS } from '../../data/projects';
import { SKILLS } from '../../data/skills';
import { CERTIFICATIONS } from '../../data/certifications';


/* ─── Data ─── */
const SOCIAL = [
  { icon: Github, href: SOCIAL_LINKS.github, label: 'GitHub' },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: BookOpen, href: SOCIAL_LINKS.medium, label: 'Medium' },
  { icon: Youtube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
];

const STATS = [
  { Icon: FolderGit2, value: PROJECTS.length, suffix: '', label: 'Projects', color: '#cefe08', textColor: 'var(--accent-ink)' },
  { Icon: Cpu, value: SKILLS.length, suffix: '', label: 'Technologies', color: '#818cf8' },
  { Icon: Award, value: CERTIFICATIONS.length, suffix: '', label: 'Certifications', color: '#22d3ee' },
];

/* ─── Typewriter ─── */
function useTypewriter(words, speed = 90, pause = 2200) {
  const [display, setDisplay] = useState('');
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wIdx];
    const delay = deleting ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, cIdx + 1));
        if (cIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCIdx(c => c + 1);
      } else {
        setDisplay(word.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) { setDeleting(false); setWIdx(i => (i + 1) % words.length); setCIdx(0); }
        else setCIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [cIdx, deleting, wIdx, words, speed, pause]);

  return display;
}

/* ─── Counter ─── */
function Counter({ target, suffix, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let start;
        const dur = 2000;
        const run = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const ep = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ep * target));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref} style={{ color }}>{count}{suffix}</span>;
}

/* ─── Framer variants ─── */
const fadeLeft = { hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const fadeRight = { hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

const staggerLeft = { hidden: {}, show: { transition: { staggerChildren: 0.10, delayChildren: 0.1 } } };
const staggerRight = { hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.4 } } };

export default function Hero() {
  const typed = useTypewriter(ROLES);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <style>{`
        @keyframes cpPulse { 0%,100%{ opacity:1 } 50%{ opacity:0.35 } }
        @keyframes cpBlink { 0%,100%{ opacity:1 } 50%{ opacity:0   } }

        .cp-media-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.6s ease;
        }
        .cp-media-layer.cp-photo  { object-fit: cover; object-position: top center; }

        @media (max-width:900px) {
          .cp-hero-grid { grid-template-columns: 1fr !important; padding-top: 100px !important; }
          .cp-hero-photo-col { min-height: 480px; order: -1; }
          .cp-hero-text-col { padding: 0 0 40px 0 !important; align-items: center; text-align: center; }
          .cp-hero-text-col p { margin-left: auto; margin-right: auto; }
          .cp-hero-text-col .cp-social-wrap { justify-content: center; }
          .cp-hero-text-col .cp-shell-hint { align-self: center !important; }
          .cp-hero-stats-col { padding: 0 0 64px 0 !important; flex-direction: row !important; flex-wrap: wrap; justify-content: center; gap: 24px !important; }
        }
        @media (max-width:480px) {
          .cp-hero-photo-col { min-height: 360px; }
        }
      `}</style>

      {/* ══ BACKGROUND ══ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>

        {/* LEFT edge — nested semi-circles */}
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 160, height: 320, borderRadius: '0 160px 160px 0', background: 'var(--bg-elevated-1)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 108, height: 216, borderRadius: '0 108px 108px 0', background: 'var(--bg-elevated-2)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 62, height: 124, borderRadius: '0 62px 62px 0', background: 'var(--bg-elevated-3)' }} />

        {/* RIGHT edge — nested semi-circles */}
        <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 160, height: 320, borderRadius: '160px 0 0 160px', background: 'var(--bg-elevated-1)' }} />
        <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 108, height: 216, borderRadius: '108px 0 0 108px', background: 'var(--bg-elevated-2)' }} />
        <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 62, height: 124, borderRadius: '62px 0 0 62px', background: 'var(--bg-elevated-3)' }} />

        {/* Very subtle accent glow centered behind photo */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 500, height: 640,
          background: 'radial-gradient(ellipse, var(--glow-radial-1) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />

        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.016,
          backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ══ 3-COLUMN GRID ══ */}
      <div
        className="cp-hero-grid"
        style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '2fr 3fr 2fr',
          maxWidth: 1280, margin: '0 auto',
          width: '100%', padding: '0 24px',
          position: 'relative', zIndex: 10,
          paddingTop: 72,
        }}
      >

        {/* ═══ LEFT — Text ═══ */}
        <motion.div
          className="cp-hero-text-col"
          variants={staggerLeft} initial="hidden" animate="show"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 32px 64px 0' }}
        >
          <motion.p variants={fadeLeft} style={{ color: 'var(--accent-ink)', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80', animation: 'cpPulse 2s ease-in-out infinite', flexShrink: 0 }} />
            Open to work
          </motion.p>

          <motion.h1 variants={fadeLeft} style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)', marginBottom: 16 }}>
            Hi, I AM{' '}
            <span style={{ background: 'var(--gradient-accent-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Nimesha
            </span>
            <br />Yasith
          </motion.h1>

          <motion.div variants={fadeLeft} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, minHeight: 30, fontFamily: 'Inter, sans-serif' }}>
            <span style={{ width: 3, height: 20, background: 'var(--accent-ink)', borderRadius: 2, display: 'inline-block', flexShrink: 0, animation: 'cpPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {typed}
              <span style={{ display: 'inline-block', width: 2, height: 16, background: 'var(--accent-ink)', marginLeft: 2, verticalAlign: 'middle', animation: 'cpBlink 1s step-end infinite' }} />
            </span>
          </motion.div>

          <motion.p variants={fadeLeft} style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, maxWidth: 360, marginBottom: 28, fontFamily: 'Inter, sans-serif' }}>
            {PERSONAL.tagline}
          </motion.p>

          <motion.div variants={fadeLeft} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <a href="#contact"
              style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--accent)', color: '#111', padding: '6px 20px 6px 8px', borderRadius: 30, fontWeight: 700, fontSize: 15, fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'background 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: '#111', marginRight: 12, flexShrink: 0 }}>
                <Mail style={{ width: 15, height: 15, color: 'var(--accent)' }} />
              </span>
              Contact Me
            </a>
            <a href="#projects"
              style={{ display: 'inline-flex', alignItems: 'center', background: 'transparent', color: 'var(--text-secondary)', padding: '6px 20px 6px 8px', borderRadius: 30, fontWeight: 600, fontSize: 15, fontFamily: 'Inter, sans-serif', textDecoration: 'none', border: '1px solid var(--border-default)', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--accent-ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--text-secondary)', marginRight: 12, flexShrink: 0 }}>
                <ArrowRight style={{ width: 15, height: 15, color: '#111' }} />
              </span>
              View Projects
            </a>
          </motion.div>

          <motion.div className="cp-social-wrap" variants={fadeLeft} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', transition: 'all 0.2s ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = '#111'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Icon style={{ width: 15, height: 15 }} />
              </a>
            ))}
          </motion.div>

          <motion.button
            variants={fadeLeft}
            type="button"
            onClick={() => window.dispatchEvent(new Event('ny:chaos'))}
            className="cp-shell-hint"
            style={{ marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', padding: '8px 14px', borderRadius: 12, background: 'var(--bg-card)', border: '1px dashed var(--accent-glow)', color: 'var(--text-secondary)', fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12, cursor: 'pointer', transition: 'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-ink)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Flame style={{ width: 15, height: 15, color: 'var(--accent-ink)' }} />
            <span>prod looks stable. <b style={{ color: 'var(--accent-ink)' }}>break something</b></span>
          </motion.button>
        </motion.div>

        {/* ═══ CENTER — Photo (raw, no clipping, blends with dark bg) ═══ */}
        <motion.div
          className="cp-hero-photo-col"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          {/* Photo wrapper */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 460,
              maxWidth: '100%',
              height: 'calc(100vh - 80px)',
              maxHeight: 680,
              minHeight: 420,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            {/* Photo layer */}
            <motion.img
              src={myPhoto}
              alt="Nimesha Yasith"
              className="cp-media-layer cp-photo"
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%',
                height: '105%',
                display: 'block',
                filter: 'drop-shadow(0 20px 60px var(--shadow-ambient-strong))',
              }}
            />
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            style={{
              position: 'absolute', bottom: 28, left: 0, right: 0,
              margin: '0 auto', width: 'fit-content', maxWidth: 'calc(100% - 16px)',
              zIndex: 20,
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'rgba(20,20,20,0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 50,
              padding: '10px 20px 10px 14px',
              boxShadow: '0 8px 32px var(--shadow-ambient)',
              whiteSpace: 'nowrap',
            }}
          >
            <a
              href="/docs/AWS_Solutions_Architect_Associate.pdf"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
              title="View my AWS certificate"
            >
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ff9900', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award style={{ width: 19, height: 19, color: '#111' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 13, color: '#cefe08', margin: 0, lineHeight: 1.2 }}>
                  AWS Certified
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#8a8a8a', margin: 0, marginTop: 2 }}>
                  Solutions Architect · Associate
                </p>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* ═══ RIGHT — Stats ═══ */}
        <motion.div
          className="cp-hero-stats-col"
          variants={staggerRight} initial="hidden" animate="show"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32, padding: '64px 0 64px 40px' }}
        >
          {STATS.map(({ Icon, value, suffix, label, color, textColor }) => (
            <motion.div key={label} variants={fadeRight} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-elevated-2)', border: `2px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = `0 0 28px ${color}40`; e.currentTarget.style.borderColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}35`; }}
              >
                <Icon style={{ width: 26, height: 26, color: textColor || color }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 32, lineHeight: 1, marginBottom: 5 }}>
                  <Counter target={value} suffix={suffix} color={textColor || color} />
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{label}</div>
              </div>
            </motion.div>
          ))}

          <motion.div variants={fadeRight}>
            <div style={{ height: 1, background: 'linear-gradient(to right,var(--accent-glow),transparent)', marginBottom: 20 }} />
            <a href={`mailto:${PERSONAL.email}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-faint)', fontSize: 12, fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-ink)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
            >
              <Mail style={{ width: 13, height: 13, color: 'var(--accent-ink)', flexShrink: 0 }} />
              {PERSONAL.email}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ══ Scroll indicator ══ */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}
        style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 20 }}
      >
        <span style={{ fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>scroll</span>
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom,var(--accent-ink),transparent)', animation: 'cpPulse 2s ease-in-out infinite' }} />
      </motion.div>
    </section>
  );
}
