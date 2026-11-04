import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import { SKILLS, SKILL_CATEGORIES as CATEGORIES } from '../../data/skills';

/* Animated progress bar — triggers when card scrolls into view */
function SkillBar({ level, color }) {
  const barRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setWidth(level), 150);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, [level]);

  return (
    <div ref={barRef}>
      {/* Percentage label */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>Proficiency</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'Inter, sans-serif' }}>{level}%</span>
      </div>
      {/* Track */}
      <div style={{
        height: 5,
        background: 'var(--bg-card-hover)',
        borderRadius: 50,
        overflow: 'hidden',
      }}>
        {/* Fill */}
        <div style={{
          height: '100%',
          borderRadius: 50,
          background: `linear-gradient(90deg, ${color}bb, ${color})`,
          width: `${width}%`,
          transition: 'width 1.4s cubic-bezier(0.22,1,0.36,1)',
        }} />
      </div>
    </div>
  );
}

/* Single skill card — Classic Portfolio Pro "skill-box" style */
function SkillCard({ skill, index, inView }) {
  const { name, level, icon, category } = skill;
  const color = '#a8cc00';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: '28px 20px 22px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        scale: 1.04,
        transition: { duration: 0.2 },
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-glow)';
        e.currentTarget.style.boxShadow = '0 8px 32px var(--shadow-ambient)';
        e.currentTarget.style.background = 'var(--accent-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'var(--bg-card)';
      }}
    >
      {/* Subtle glow behind icon */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 80, height: 80,
        background: 'radial-gradient(circle, rgba(206,254,8,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Icon — Classic Portfolio Pro "skill-img" */}
      <div style={{
        width: 64, height: 64,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'var(--bg-card)',
        border: '1.5px solid var(--border-subtle)',
        padding: 12,
        transition: 'transform 0.3s ease',
      }}>
        <img
          src={icon}
          alt={name}
          width={36}
          height={36}
          style={{ objectFit: 'contain', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* Skill name — Classic Portfolio Pro "skill-heading h5" */}
      <h5 style={{
        fontFamily: 'Unbounded, sans-serif',
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--text-primary)',
        margin: 0,
        lineHeight: 1.4,
      }}>
        {name}
      </h5>

      {/* Category tag */}
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        margin: '-8px 0',
      }}>
        {category}
      </span>

      {/* Progress bar — Classic Portfolio Pro "skills_bar" */}
      <SkillBar level={level} color={color} />
    </motion.div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const filtered = activeCategory === 'All'
    ? SKILLS
    : SKILLS.filter(s => s.category === activeCategory);

  return (
    <section id="skills" ref={ref} className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      {/* ── Section Header ── */}
      <SectionHeading index="02" label="Expertise" title={<>Tech <span className="gradient-text">Superpowers</span></>}
        lead={<>The cloud, automation and infrastructure tools I use to build, ship and operate reliable systems.</>}
      />

      {/* ── Category Filter Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 48 }}
      >
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '7px 18px',
                borderRadius: 30,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#111' : 'var(--text-secondary)',
                border: active ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                boxShadow: active ? '0 0 18px var(--accent-glow)' : 'none',
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* ── Skills Grid — same layout as Classic Portfolio Pro owl carousel in grid form ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}
