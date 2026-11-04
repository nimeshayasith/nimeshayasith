import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GraduationCap, BookOpen, Code2, Server, Cloud, Cpu,
  Layers, GitBranch, Smartphone, Brain, Network, ArrowRight,
  Star, Briefcase, Figma, Database, Terminal, Wrench,
  Shield, Zap, Eye, Box, Activity,
} from 'lucide-react';
import MemoriesSlideshow from './MemoriesSlideshow';
import { BIO, HIGHLIGHTS as PROFILE_HIGHLIGHTS, PERSONAL } from '../../data/profile';

/* ─── Education Timeline ──────────────────────────────────────────────── */
const EDUCATION = [
  {
    period: '2004 – 2015',
    title: 'Primary & Ordinary Level',
    school: 'K/Aluthgama National School',
    location: 'Aluthgama',
    color: '#22d3ee',
    icon: BookOpen,
    detail: 'Completed primary education and O/Level studies, building a strong academic foundation.',
  },
  {
    period: '2016 – 2019',
    title: 'Advanced Level (Maths Stream)',
    school: 'K/Kalutara Vidyalaya',
    location: 'Kalutara',
    color: '#818cf8',
    icon: Star,
    detail: 'GCE Advanced Level (A, B, C), qualifying for the Faculty of Engineering.',
  },
  {
    period: 'Feb 2022 – Sep 2026',
    title: 'B.Sc. Engineering (Hons) in Computer Engineering',
    school: 'Faculty of Engineering, University of Ruhuna',
    location: 'Hapugala, Galle',
    color: '#a8cc00',
    icon: GraduationCap,
    detail: 'Specialised in Computer Engineering after a broad first year. Graduated in 2026 with depth in cloud and DevOps, backend, security and machine learning.',
    active: true,
  },
];

/* ─── University Semester Journey ─────────────────────────────────────── */
const SEMESTERS = [
  {
    id: 'y1',
    label: '1st Year',
    period: '2021 – 2022',
    color: '#22d3ee',
    icon: Layers,
    heading: 'Engineering Foundations',
    body: 'In first year, we covered all core engineering disciplines — Civil, Mechanical, Electrical, and Computer Engineering. This broad exposure helped me identify my strongest passion: Computer Engineering, which I selected for specialization based on my first-year results.',
    skills: ['Engineering Fundamentals', 'Mathematics', 'Physics', 'Programming Basics'],
    highlight: null,
  },
  {
    id: 'y2s1',
    label: '2nd Year — Sem 3',
    period: '2022',
    color: '#818cf8',
    icon: Code2,
    heading: 'Data Structures & GUI Programming',
    body: 'Entering Computer Engineering, the focus shifted to Data Structures & Algorithms (DSA) and GUI Programming. DSA became my primary passion — I went deep on algorithmic thinking and hands-on projects. The problem-solving mindset I built here still drives everything I do.',
    skills: ['Data Structures & Algorithms', 'GUI Programming', 'Java', 'Problem Solving'],
    highlight: '🔍 Most focused on: Data Structures & Algorithms',
  },
  {
    id: 'y2s2',
    label: '2nd Year — Sem 4',
    period: '2023',
    color: '#fb923c',
    icon: Database,
    heading: 'Software Engineering & Databases',
    body: 'The 4th semester was a turning point. We studied Software Engineering Principles, Database Systems, Web App Development, and Problem-Solving Algorithms. My deep interest in Database Systems and Software Engineering fundamentals solidified here — even while covering electronic modules, I maintained good grades throughout.',
    skills: ['Software Engineering', 'Database Systems', 'Web Development', 'Problem Solving Algorithms'],
    highlight: '💾 Most interested in: Database Systems & Software Engineering',
  },
  {
    id: 'y3s1',
    label: '3rd Year — Sem 5',
    period: '2023 – 2024',
    color: '#a8cc00',
    icon: Brain,
    heading: 'ML, Mobile Dev & Architecture',
    body: 'Semester 5 brought Computer Architecture & Organization, Machine Learning, and Mobile App Development — all of which pushed my skills further. I completed two significant projects: one in ML and one in Mobile Development. This was also the start of our year-long Software Project spanning Semesters 5 & 6.',
    skills: ['Machine Learning', 'Mobile Development (Flutter)', 'Computer Architecture', 'TensorFlow'],
    highlight: '📱 Delivered: ML Project + Mobile App Project',
  },
  {
    id: 'y3s2',
    label: '3rd Year — Sem 6',
    period: '2024',
    color: '#34d399',
    icon: Cloud,
    heading: 'DevOps, AI & Networking',
    body: 'The 6th semester introduced DevOps Engineering, Artificial Intelligence, and Computer Networking. This is where my DevOps journey truly began — studying Git, Linux fundamentals, Cloud introduction, and CI/CD. I built my first standalone DevOps project and also worked on an AI project. Both were exciting milestones.',
    skills: ['DevOps Engineering', 'Linux', 'Git & GitHub', 'Cloud Fundamentals', 'Computer Networking', 'Artificial Intelligence'],
    highlight: '🚀 First DevOps Project + AI Project completed',
  },
  {
    id: 'y4s1',
    label: '4th Year — Sem 7',
    period: '2025',
    color: '#f472b6',
    icon: Eye,
    heading: 'Advanced AI, Vision & Security',
    body: 'Semester 7 took things to the next level with five powerful modules: Advanced AI, Advanced Data Communication, Computer Vision & Image Processing, Information Security, and High Performance Computing. I delivered hands-on projects across all of them — Computer Vision, Cloud Computing, HPC, and Information Security projects. Simultaneously, Semester 7 marked the start of the Final Year Project — the most significant and demanding work of the entire degree.',
    skills: [
      'Advanced AI', 'Computer Vision & Image Processing',
      'Information Security', 'High Performance Computing',
      'Advanced Data Communication', 'Cloud Computing',
    ],
    highlight: '🎯 Delivered: CV · Cloud · HPC · InfoSec projects + FYP kicked off',
  },
  {
    id: 'y4s2',
    label: '4th Year — Sem 8',
    period: '2025 – 2026',
    color: '#a8cc00',
    icon: Shield,
    heading: 'Blockchain, Big Data & Final Year Project',
    body: 'The final semester — three elite modules: Blockchain & Cybersecurity, Big Data Analysis, and Software Architecture. These modules aligned perfectly with the Final Year Project, which focuses on defending Software-Defined Vehicular Networks (SDVNs) using Graph Neural Networks and Hyperledger Fabric blockchain. High-novelty research aimed at IEEE/ACM publication — the most challenging and rewarding work of the entire degree.',
    skills: [
      'Blockchain & Cybersecurity', 'Big Data Analysis', 'Software Architecture',
      'Graph Neural Networks', 'Hyperledger Fabric', 'NS-3 Simulation',
      'Transfer Learning', 'TensorFlow (GNN)',
    ],
    highlight: '🏆 Final Year Project — IEEE/ACM level research on SDVN security',
    active: true,
  },
];

/* ─── Software Project Card ────────────────────────────────────────────── */
const PROJECT_TECH = [
  { label: 'React.js', color: '#22d3ee' },
  { label: 'Flutter', color: '#54c5f8' },
  { label: 'Node.js + Express', color: '#cefe08' },
  { label: 'MongoDB', color: '#4db33d' },
  { label: 'TensorFlow / PyTorch', color: '#ff6f00' },
  { label: 'GitHub Actions', color: '#818cf8' },
  { label: 'MongoDB Atlas', color: '#4db33d' },
  { label: 'Render', color: '#46e3b7' },
  { label: 'Jira', color: '#0052cc' },
  { label: 'Figma', color: '#f24e1e' },
];

const PROJECT_ROLES = [
  { icon: Figma, label: 'UI/UX Design', desc: 'Led Figma design — calm, stress-relief themed. Collected references, matched themes, created custom vectors.' },
  { icon: Server, label: 'Backend Logic', desc: 'Developed backend APIs with Node.js & Express. Designed use-case & UML diagrams for system architecture.' },
  { icon: GitBranch, label: 'Team Lead (Jira)', desc: 'Managed sprint planning, conflict resolution in Git, team coordination via Jira as unofficial team lead.' },
  { icon: Smartphone, label: 'Mobile App', desc: 'Contributed to the Flutter mobile application alongside the React web frontend.' },
];

/* ─── Skill highlights (data lives in src/data/profile.js) ─────────────── */
const ICONS = { Cloud, Layers, GitBranch, Box, Activity, Terminal };
const HIGHLIGHTS = PROFILE_HIGHLIGHTS.map(h => ({ ...h, icon: ICONS[h.icon] || Cloud }));

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function About() {
  const [activeSem, setActiveSem] = useState('y1');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const sem = SEMESTERS.find(s => s.id === activeSem);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="about" ref={ref} className="section-padding !pt-0">

      {/* ── Header ── */}
      <SectionHeading as="h1" label="About Me" title={<>My <span className="gradient-text">Story</span></>}
        lead={<>A Computer Engineering graduate from the University of Ruhuna, now focused on cloud infrastructure, DevOps and reliability. I like building things that deploy themselves and keep working.</>}
      />

      {/* ══ SECTION 1 — Bio + Skill Highlights ═══════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start mb-24">

        {/* Left – Bio */}
        <motion.div {...fadeUp(0.1)} className="space-y-5">
          <p className="text-slate-300 leading-relaxed text-base" style={{ fontFamily: 'Inter, sans-serif' }}>
            I'm <span className="text-white font-semibold">{PERSONAL.name}</span>. {BIO[0]}
          </p>
          <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
            {BIO[1]}
          </p>
          <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
            Outside the terminal, I discovered a love for Figma and UI/UX while leading the design phase of our
            third-year software project: calm, meaningful user experiences matter to me as much as green pipelines.
          </p>
          <a href="/projects" className="btn-primary inline-flex mt-2" style={{ width: 'fit-content' }}>
            <span className="btn-icon"><ArrowRight className="w-4 h-4" /></span>
            See My Work
          </a>
        </motion.div>

        {/* Right – Skill Highlights */}
        <motion.div {...fadeUp(0.2)}>
          <div className="grid grid-cols-2 gap-3">
            {HIGHLIGHTS.map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
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
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ SECTION 2 — Education Timeline ═══════════════════════════════ */}
      <motion.div {...fadeUp(0.15)} className="mb-24">
        <div className="text-center mb-12">
          <span className="badge mb-4">Education</span>
          <h3 className="t-h3">
            Academic <span className="gradient-text">Timeline</span>
          </h3>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* vertical line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(206,254,8,0.4), rgba(129,140,248,0.3), rgba(34,211,238,0.2))' }}
          />

          <div className="space-y-8">
            {EDUCATION.map(({ period, title, school, location, color, icon: Icon, detail, active }, i) => (
              <motion.div
                key={school}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="flex gap-6"
              >
                {/* dot */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `${color}18`,
                      border: `2px solid ${color}${active ? 'aa' : '40'}`,
                      boxShadow: active ? `0 0 20px ${color}30` : 'none',
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                </div>

                {/* content */}
                <div
                  className="flex-1 glass p-5 rounded-2xl"
                  style={active ? { border: `1px solid ${color}35`, boxShadow: `0 0 30px ${color}10` } : {}}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full" style={{ background: `${color}20`, color }}>
                      {period}
                    </span>
                    {active && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-black" style={{ background: color }}>
                        Graduate ✓
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-white text-base mt-2">{title}</h4>
                  <p className="text-sm font-medium mt-0.5" style={{ color }}>{school}</p>
                  <p className="t-small mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{location}</p>
                  <p className="t-body mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>{detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══ SECTION 3 — University Journey ═══════════════════════════════ */}
      <motion.div {...fadeUp(0.2)} className="mb-24">
        <div className="text-center mb-12">
          <span className="badge mb-4">University of Ruhuna</span>
          <h3 className="t-h3">
            My Learning <span className="gradient-text">Journey</span>
          </h3>
          <p className="t-body mt-3 max-w-lg mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            How I evolved semester by semester — from engineering fundamentals to DevOps & Machine Learning.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {SEMESTERS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSem(s.id)}
              className="text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: activeSem === s.id ? s.color : 'rgba(255,255,255,0.05)',
                color: activeSem === s.id ? '#111' : '#94a3b8',
                border: `1px solid ${activeSem === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
                transform: activeSem === s.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {sem && (
            <motion.div
              key={sem.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl mx-auto glass p-8 rounded-2xl"
              style={{ border: `1px solid ${sem.color}30` }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${sem.color}18`, border: `1px solid ${sem.color}40` }}
                >
                  <sem.icon className="w-5 h-5" style={{ color: sem.color }} />
                </div>
                <div>
                  <p className="text-xs font-mono mb-1" style={{ color: sem.color }}>{sem.label}</p>
                  <h4 className="font-heading font-bold text-white text-lg">{sem.heading}</h4>
                </div>
              </div>

              <p className="t-body mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {sem.body}
              </p>

              {sem.highlight && (
                <div
                  className="text-sm font-medium px-4 py-2.5 rounded-xl mb-5"
                  style={{ background: `${sem.color}15`, color: sem.color, border: `1px solid ${sem.color}30`, fontFamily: 'Inter, sans-serif' }}
                >
                  {sem.highlight}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {sem.skills.map(sk => (
                  <span
                    key={sk}
                    className="text-xs px-3 py-1.5 rounded-lg text-slate-300"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ══ SECTION 4 — Software Project ════════════════════════════════ */}
      <motion.div {...fadeUp(0.25)} className="mb-20">
        <div className="text-center mb-12">
          <span className="badge mb-4">3rd Year · Sem 5 & 6</span>
          <h3 className="t-h3">
            Third Year <span className="gradient-text">Software Project</span>
          </h3>
          <p className="t-body mt-3 max-w-lg mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            A full-cycle, two-semester team project — stress-relief platform with web, mobile, and AI components.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* My Roles */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest opacity-60 mb-4">My Contributions</h4>
            {PROJECT_ROLES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass glass-hover p-4 flex items-start gap-4 rounded-xl"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)' }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--accent-ink)' }} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm font-heading mb-1">{label}</p>
                  <p className="t-small" style={{ fontFamily: 'Inter, sans-serif' }}>{desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Skills gained note */}
            <div className="glass p-4 rounded-xl mt-2" style={{ border: '1px solid rgba(129,140,248,0.25)' }}>
              <p className="t-small" style={{ fontFamily: 'Inter, sans-serif' }}>
                💡 <span className="text-white font-medium">Skills discovered through this project:</span>{' '}
                Creative thinking, Figma UI/UX design, vector creation, backend architecture, GitHub conflict resolution, and technical team leadership.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest opacity-60 mb-4">Technology Stack</h4>
            <div className="glass p-6 rounded-xl h-full">
              <div className="space-y-3">
                {[
                  { group: 'Frontend', items: ['React.js (Web)', 'Flutter (Mobile)'] },
                  { group: 'Backend', items: ['Node.js + Express.js'] },
                  { group: 'Database', items: ['MongoDB', 'MongoDB Atlas'] },
                  { group: 'AI / ML', items: ['TensorFlow.js', 'Python · TensorFlow/PyTorch', 'Pandas · D3.js'] },
                  { group: 'DevOps', items: ['GitHub Actions CI/CD', 'Git + GitHub/GitLab', 'Jira', 'Render (Deploy)'] },
                ].map(({ group, items }) => (
                  <div key={group}>
                    <p className="t-small font-mono mb-1.5">{group}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {items.map(item => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 rounded-lg text-slate-300"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══ SECTION 5 — Final Year Project ══════════════════════════════ */}
      <motion.div {...fadeUp(0.3)} className="mb-8">
        <div className="text-center mb-12">
          <span className="badge mb-4" style={{ background: 'var(--accent-glow)', color: 'var(--accent-ink)', border: '1px solid var(--accent-glow)' }}>
            4th Year · Sem 7 & 8 · Research Project
          </span>
          <h3 className="t-h3">
            Final Year <span className="gradient-text">Research Project</span>
          </h3>
          <p className="t-body mt-3 max-w-xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            High-novelty cybersecurity research targeting IEEE/ACM publication — the most challenging and rewarding work of my degree.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">

          {/* Title + Abstract */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass p-8 rounded-2xl"
            style={{ border: '1px solid var(--accent-glow)', boxShadow: '0 0 40px var(--accent-glow)' }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 flex-none" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)' }}>
                <Shield className="w-5 h-5" style={{ color: 'var(--accent-ink)' }} />
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-black" style={{ background: '#cefe08' }}>🏆 Capstone Research</span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(129,140,248,0.15)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.3)' }}>Targeting IEEE / ACM</span>
                </div>
                <h4 className="font-heading font-bold text-white text-base leading-snug">
                  Defending Software-Defined Vehicular Networks (SDVNs) Against Temporal-Echo Topology Attacks Using Graph Neural Networks & Blockchain
                </h4>
                <p className="text-xs mt-2" style={{ color: 'var(--accent-ink)', fontFamily: 'Inter, sans-serif' }}>
                  Project name: TETA-Guard · Team of 4 · My part: the Hyperledger Fabric network, the NS-3 simulation and the attack-simulation test suite
                </p>
              </div>
            </div>

            <p className="t-body mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Software-Defined Vehicular Networks are increasingly vulnerable to sophisticated <span className="text-pink-400 font-medium">Temporal-Echo Topology Attacks</span> that manipulate timestamps, inject fake heartbeat signals, and create phantom network links. Current defense mechanisms rely on rule-based detection or basic ML approaches — leaving critical security gaps.
            </p>
            <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>
              This project proposes a novel integrated defense framework combining <span className="text-cyan-400 font-medium">Graph Neural Networks (GNNs)</span> for real-time anomaly detection with <span className="text-purple-400 font-medium">blockchain-based verification</span> for tamper-proof audit trails. The framework also applies <span className="text-amber-400 font-medium">transfer learning</span> to generalize the solution to financial fraud detection (tax evasion) — establishing a unified temporal fraud detection system.
            </p>
          </motion.div>

          {/* Attack variants + Tech Stack side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Attack Variants */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass p-6 rounded-2xl"
              style={{ border: '1px solid rgba(251,146,60,0.2)' }}
            >
              <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest opacity-60 mb-5">Attack Variants Targeted</h4>
              <div className="space-y-4">
                {[
                  { num: '01', name: 'Topology Time-Warp', desc: 'Timestamp manipulation to distort network state visibility.', color: '#fb923c' },
                  { num: '02', name: 'Beacon State Heartbeat Hijack', desc: 'Injection of fake control messages to corrupt routing tables.', color: '#f472b6' },
                  { num: '03', name: 'Multipath Echo Attack', desc: 'Creation of phantom network links to mislead traffic routing.', color: '#818cf8' },
                ].map(({ num, name, desc, color }) => (
                  <div key={num} className="flex gap-3 items-start">
                    <span className="text-xs font-mono font-bold flex-shrink-0 mt-0.5" style={{ color }}>{num}</span>
                    <div>
                      <p className="text-white text-sm font-semibold font-heading mb-0.5">{name}</p>
                      <p className="t-small" style={{ fontFamily: 'Inter, sans-serif' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="glass p-6 rounded-2xl"
              style={{ border: '1px solid rgba(129,140,248,0.2)' }}
            >
              <h4 className="font-heading font-bold text-white text-sm uppercase tracking-widest opacity-60 mb-5">Research Tech Stack</h4>
              <div className="space-y-3">
                {[
                  { group: 'Network Simulation', items: ['NS-3'] },
                  { group: 'AI / GNN', items: ['TensorFlow', 'Graph Neural Networks', 'Transfer Learning'] },
                  { group: 'Blockchain', items: ['Hyperledger Fabric'] },
                  { group: 'Data Processing', items: ['Python', 'Pandas'] },
                  { group: 'Application Domain', items: ['SDVNs', 'Financial Fraud Detection'] },
                ].map(({ group, items }) => (
                  <div key={group}>
                    <p className="t-small font-mono mb-1.5">{group}</p>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {items.map(item => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 rounded-lg text-slate-300"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Inter, sans-serif' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Keywords */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass p-5 rounded-2xl"
          >
            <p className="t-small font-mono mb-3">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Software-Defined Vehicular Networks', 'Graph Neural Networks', 'Blockchain',
                'Topology Attacks', 'Anomaly Detection', 'Transfer Learning',
                'Cybersecurity', 'Hyperledger Fabric', 'NS-3', 'TensorFlow',
              ].map(kw => (
                <span
                  key={kw}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: 'rgba(206,254,8,0.07)', color: '#a3e635', border: '1px solid rgba(206,254,8,0.2)', fontFamily: 'Inter, sans-serif' }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ── Memories / Life Beyond Code Slideshow ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 glass rounded-2xl p-6 md:p-8"
        style={{ border: '1px solid var(--accent-glow)' }}
      >
        <MemoriesSlideshow />
      </motion.div>

    </section>
  );
}
