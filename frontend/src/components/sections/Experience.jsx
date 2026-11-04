import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Star } from 'lucide-react';
import { EDUCATION as EDUCATION_DATA, TIMELINE_EXPERIENCE } from '../../data/experience';

/* ─────────────────────────────────────────
   Horizontal Timeline Grid (Classic Portfolio Pro exact style)
   Row 1  = items 0-3  (border-top + border-right pattern, text ABOVE line)
   Row 2  = items 4-7  (border-bottom pattern, text BELOW line)
───────────────────────────────────────── */
function TimelineGrid({ items, color }) {
  const row1 = items.slice(0, 4);
  const row2 = items.slice(4, 8);

  /* circle: border colour = accent on lime, else gray */
  const circleBorder = `2px dotted ${color === '#cefe08' ? color : '#555'}`;

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <style>{`
        .cp-tl-cell { position: relative; flex: 1; min-width: 160px; }

        /* ── Row-1 borders (top + selective right) ── */
        .cp-tl-cell.r1-c1 { border-top: 2px dotted var(--border-strong); border-right: 2px dotted var(--border-strong); }
        .cp-tl-cell.r1-c2 { border-bottom: 2px dotted var(--border-strong); }
        .cp-tl-cell.r1-c3 { border-bottom: 2px dotted var(--border-strong); border-right: 2px dotted var(--border-strong); }
        .cp-tl-cell.r1-c4 { border-bottom: 2px dotted var(--border-strong); }

        /* ── Row-2 borders (bottom + selective right) ── */
        .cp-tl-cell.r2-c1 { border-bottom: 2px dotted var(--border-strong); }
        .cp-tl-cell.r2-c2 { border-bottom: 2px dotted var(--border-strong); }
        .cp-tl-cell.r2-c3 { border-bottom: 2px dotted var(--border-strong); border-right: 2px dotted var(--border-strong); }
        .cp-tl-cell.r2-c4 { border-top: 2px dotted var(--border-strong); }

        /* ── Corner circle dot (Premium CSS Pulse) ── */
        .cp-tl-cell::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent-ink);
          z-index: 2;
          box-shadow: 0 0 0 0 rgba(206, 254, 8, 0.7);
          animation: tlPulse 2s infinite;
        }

        /* Create a subtle ring around the pulsing dot */
        .cp-tl-cell::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(206, 254, 8, 0.3);
          z-index: 1;
        }

        @keyframes tlPulse {
          0% { box-shadow: 0 0 0 0 rgba(206, 254, 8, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(206, 254, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(206, 254, 8, 0); }
        }

        /* Positioning the dot */
        .cp-tl-cell.r1-c1::before { top: -8px; left: 5%; }
        .cp-tl-cell.r1-c2::before { bottom: -8px; left: -8px; }
        .cp-tl-cell.r1-c3::before { bottom: -8px; left: -2px; }
        .cp-tl-cell.r1-c4::before { bottom: -8px; left: -8px; }
        .cp-tl-cell.r2-c1::before { bottom: -8px; left: 5%; }
        .cp-tl-cell.r2-c2::before { bottom: -8px; left: -8px; }
        .cp-tl-cell.r2-c3::before { bottom: -8px; left: -2px; }
        .cp-tl-cell.r2-c4::before { top: -8px; left: -8px; }

        /* Positioning the outer ring (shifted by -5px relative to the 14px dot to center it: (24-14)/2 = 5 ) */
        .cp-tl-cell.r1-c1::after { top: -13px; left: calc(5% - 5px); }
        .cp-tl-cell.r1-c2::after { bottom: -13px; left: -13px; }
        .cp-tl-cell.r1-c3::after { bottom: -13px; left: -7px; }
        .cp-tl-cell.r1-c4::after { bottom: -13px; left: -13px; }
        .cp-tl-cell.r2-c1::after { bottom: -13px; left: calc(5% - 5px); }
        .cp-tl-cell.r2-c2::after { bottom: -13px; left: -13px; }
        .cp-tl-cell.r2-c3::after { bottom: -13px; left: -7px; }
        .cp-tl-cell.r2-c4::after { top: -13px; left: -13px; }

        @media (max-width: 640px) {
          .cp-tl-row { flex-wrap: wrap !important; }
          .cp-tl-cell { min-width: 45% !important; border: none !important; }
          .cp-tl-cell::before { display: none; }
        }
      `}</style>

      {/* ── Row 1 — text ABOVE the dashed line ── */}
      <div className="cp-tl-row" style={{ display: 'flex', gap: 0 }}>
        {row1.map((item, i) => {
          const cls = `cp-tl-cell r1-c${i + 1}`;
          return (
            <motion.div
              key={item._id}
              className={cls}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              style={{ padding: '0 20px 24px 20px' }}
            >
              <p style={{
                fontSize: 13, color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
                marginBottom: 6,
              }}>
                {item.year}
              </p>
              <h3 style={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: 15, fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 13, color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
              }}>
                {item.org}
              </p>

              {item.modules && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {item.modules.map((mod, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingLeft: 14 }}>
                      {/* Custom bullet */}
                      <div style={{
                        position: 'absolute', left: 0, top: 6, width: 6, height: 6,
                        borderRadius: '50%', background: 'var(--accent-ink)'
                      }} />
                      <div style={{
                        fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: 2
                      }}>
                        {mod.year}
                      </div>
                      <div style={{
                        fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                        marginBottom: 2
                      }}>
                        {mod.name}
                      </div>
                      <div style={{
                        fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.4
                      }}>
                        {mod.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Row 2 — text BELOW the dashed line ── */}
      {row2.length > 0 && (
        <div className="cp-tl-row" style={{ display: 'flex', gap: 0 }}>
          {row2.map((item, i) => {
            const cls = `cp-tl-cell r2-c${i + 1}`;
            return (
              <motion.div
                key={item._id}
                className={cls}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: i * 0.07 + 0.2 }}
                style={{ padding: '24px 20px 0 20px' }}
              >
                <p style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: 6,
                }}>
                  {item.year}
                </p>
                <h3 style={{
                  fontFamily: 'Unbounded, sans-serif',
                  fontSize: 15, fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {item.org}
                </p>

                {item.modules && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {item.modules.map((mod, idx) => (
                      <div key={idx} style={{ position: 'relative', paddingLeft: 14 }}>
                        <div style={{
                          position: 'absolute', left: 0, top: 6, width: 6, height: 6,
                          borderRadius: '50%', background: 'var(--accent-ink)'
                        }} />
                        <div style={{
                          fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: 2
                        }}>
                          {mod.year}
                        </div>
                        <div style={{
                          fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                          marginBottom: 2
                        }}>
                          {mod.name}
                        </div>
                        <div style={{
                          fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif', lineHeight: 1.4
                        }}>
                          {mod.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function Experience() {
  const [activeTab, setActiveTab]     = useState('experience');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const displayedData = activeTab === 'education' ? EDUCATION_DATA : TIMELINE_EXPERIENCE;

  /* Tab config: btn1 = lime (active selected), btn2 = gray */
  const tabs = [
    { key: 'education',  label: 'My Education',  Icon: GraduationCap },
    { key: 'experience', label: 'My Experience',  Icon: Star          },
  ];

  return (
    <section id="experience" ref={ref} className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      {/* ── Section Header ── */}
      <SectionHeading index="04" label="Journey" title={<>My <span className="gradient-text">Experience</span></>}
        lead={<>Two DevOps and engineering internships, a Computer Engineering degree, and a few years of building and breaking things on purpose.</>}
      />

      {/* ── Classic Portfolio Pro Tab Buttons ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}
      >
        {tabs.map(({ key, label, Icon }, idx) => {
          const isActive = activeTab === key;
          /* btn1 (education) = lime when active; btn2 (experience) = gray when active */
          const activeBg    = idx === 0 ? 'var(--accent)' : 'var(--text-secondary)';
          const activeColor = '#111';
          const inactiveBg  = 'var(--bg-inverse)';
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0,
                background: isActive ? activeBg : inactiveBg,
                color: isActive ? activeColor : '#fff',
                padding: '6px 20px 6px 8px',
                borderRadius: 30,
                border: `2px solid ${isActive ? activeBg : 'rgba(255,255,255,0.12)'}`,
                fontWeight: 700,
                fontSize: 15,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = idx === 0 ? 'var(--accent)' : 'var(--text-secondary)';
                  e.currentTarget.style.color = '#111';
                  e.currentTarget.style.borderColor = idx === 0 ? 'var(--accent)' : 'var(--text-secondary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-inverse)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }
              }}
            >
              {/* Circle icon — exact Classic Portfolio Pro button style */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--bg-inverse)',
                marginRight: 12,
                flexShrink: 0,
              }}>
                <Icon style={{
                  width: 15,
                  height: 15,
                  color: idx === 0 ? 'var(--accent)' : 'var(--text-secondary)',
                }} />
              </span>
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* ── Horizontal Timeline Grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <TimelineGrid
            items={displayedData}
            color={activeTab === 'education' ? '#cefe08' : '#888'}
          />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
