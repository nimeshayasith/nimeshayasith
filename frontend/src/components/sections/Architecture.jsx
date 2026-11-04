import { useEffect, useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  GitBranch, Layers, Rocket, Globe, User, RefreshCw, ExternalLink, Database, Zap, Server,
} from 'lucide-react';
import { SOCIAL_LINKS } from '../../data/profile';
import { BACKEND_ORIGIN, pingBackend, warmBackend } from '../../services/api';
import { openCloudShell } from '../shell/CloudShell';

/**
 * "Under the hood": documents how this very site is built and deployed.
 * Doubles as the AWS-usage write-up the challenge asks for, and shows the
 * static-first + live-backend data split as it actually behaves right now.
 */

const NODES = [
  {
    id: 'github',
    Icon: GitBranch,
    title: 'GitHub',
    sub: 'git push origin main',
    color: '#e5e7eb',
    points: [
      'Single repo: /frontend (React + Vite) and /terraform (infrastructure).',
      'A push to main is the only deployment trigger: no manual uploads.',
      'The repo is connected to Amplify through the AWS Amplify GitHub App.',
    ],
  },
  {
    id: 'terraform',
    Icon: Layers,
    title: 'Terraform',
    sub: 'infrastructure as code',
    color: '#a78bfa',
    points: [
      'Defines the Amplify app, the main branch, SPA rewrite rules and environment variables.',
      'Module layout: root config → modules/amplify_hosting. Reusable, reviewable, repeatable.',
      "Run `terraform plan` in CloudShell (the terminal button) to see the real resource list.",
    ],
  },
  {
    id: 'amplify',
    Icon: Rocket,
    title: 'AWS Amplify',
    sub: 'CI/CD + hosting',
    color: '#ff9900',
    points: [
      'Builds on every push: npm ci → vite build, with the monorepo app root set to /frontend.',
      'Automatically provisions the hosting stack and issues the HTTPS certificate.',
      'Atomic deploys: a failed build never replaces the live site.',
    ],
  },
  {
    id: 'cloudfront',
    Icon: Globe,
    title: 'Amazon CloudFront',
    sub: 'global edge delivery',
    color: '#60a5fa',
    points: [
      'Amplify Hosting serves the static bundle through the CloudFront CDN.',
      'Cached at edge locations, so it loads fast from Colombo to Cape Town.',
      'Rewrite rules send deep links (/projects, /about …) to the single-page app, and proxy /api/* to the backend so there is no CORS to manage.',
    ],
  },
  {
    id: 'visitor',
    Icon: User,
    title: 'You',
    sub: 'reading this right now',
    color: '#cefe08',
    points: [
      'The page you are on is the deployed artifact: nothing server-rendered.',
      'Static content (projects, skills, experience) is bundled and loads instantly.',
      'Live content (articles, library) streams in from the backend when it answers.',
    ],
  },
];

function StatusChip() {
  const [state, setState] = useState({ status: 'checking' });

  const check = (fresh = false) => {
    setState({ status: 'checking' });
    (fresh ? pingBackend() : warmBackend()).then((r) =>
      setState(r.ok ? { status: 'live', ms: r.ms } : { status: 'offline', error: r.error }),
    );
  };

  useEffect(() => {
    check(false);
  }, []);

  const map = {
    checking: { color: '#fbbf24', label: 'Waking the backend… (Render free tier cold start can take ~50 s)' },
    live: { color: '#4ade80', label: `Backend live · ${state.ms} ms` },
    offline: { color: '#f87171', label: 'Backend unreachable. The site keeps working from bundled data.' },
  }[state.status];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 30,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          color: 'var(--text-secondary)',
        }}
        role="status"
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: map.color,
            boxShadow: `0 0 10px ${map.color}`,
            animation: state.status === 'checking' ? 'cpPulse 1.2s ease-in-out infinite' : 'none',
          }}
        />
        {map.label}
      </span>
      <button
        type="button"
        onClick={() => check(true)}
        aria-label="Re-check backend"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <RefreshCw size={12} /> re-check
      </button>
    </div>
  );
}

export default function Architecture() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [active, setActive] = useState('amplify');
  const node = NODES.find((n) => n.id === active);

  return (
    <section id="architecture" ref={ref} className="section-padding">
      <style>{`
        @keyframes archFlow { from { background-position: 0 0 } to { background-position: 28px 0 } }
        @keyframes archFlowY { from { background-position: 0 0 } to { background-position: 0 28px } }
        .arch-row { display: grid; grid-template-columns: 1fr 34px 1fr 34px 1fr 34px 1fr 34px 1fr; align-items: center; }
        .arch-link { height: 2px; background-image: linear-gradient(90deg, var(--accent) 50%, transparent 50%); background-size: 14px 2px; animation: archFlow 0.9s linear infinite; opacity: 0.75; }
        @media (max-width: 900px) {
          .arch-row { grid-template-columns: 1fr; justify-items: center; }
          .arch-link { width: 2px; height: 30px; background-image: linear-gradient(180deg, var(--accent) 50%, transparent 50%); background-size: 2px 14px; animation: archFlowY 0.9s linear infinite; }
        }
      `}</style>

      <div className="section-divider mb-24 -mt-12" />

      <SectionHeading index="08" label="Under the hood" title={<>Built &amp; shipped on <span className="gradient-text">AWS</span></>}
        lead={<>This portfolio is a static web app. Terraform provisions AWS Amplify Hosting, every push to GitHub builds and deploys it through CloudFront, and a small backend adds live data. Tap a step to see how it works.</>}
      />

      {/* ── pipeline ── */}
      <div className="arch-row" style={{ maxWidth: 1100, margin: '0 auto 28px' }}>
        {NODES.map((n, i) => {
          const isActive = n.id === active;
          return (
            <div key={n.id} style={{ display: 'contents' }}>
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setActive(n.id)}
                onMouseEnter={() => setActive(n.id)}
                aria-pressed={isActive}
                style={{
                  width: '100%',
                  maxWidth: 190,
                  textAlign: 'center',
                  padding: '18px 12px',
                  borderRadius: 18,
                  cursor: 'pointer',
                  background: isActive ? 'var(--accent-glow)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? n.color : 'var(--border-subtle)'}`,
                  boxShadow: isActive ? `0 0 28px ${n.color}30` : 'none',
                  transition: 'all 0.25s ease',
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  style={{
                    width: 46,
                    height: 46,
                    margin: '0 auto 10px',
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${n.color}18`,
                    border: `1px solid ${n.color}45`,
                  }}
                >
                  <n.Icon size={20} style={{ color: n.color }} />
                </span>
                <span style={{ display: 'block', fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: 12 }}>{n.title}</span>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>{n.sub}</span>
              </motion.button>
              {i < NODES.length - 1 && <span className="arch-link" aria-hidden />}
            </div>
          );
        })}
      </div>

      {/* ── details ── */}
      <div style={{ maxWidth: 780, margin: '0 auto 56px', minHeight: 150 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="glass"
            style={{ padding: '22px 26px', border: `1px solid ${node.color}40` }}
          >
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 15, marginBottom: 12, color: node.color }}>{node.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 9 }}>
              {node.points.map((p) => (
                <li key={p} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: 'var(--accent-ink)', flexShrink: 0 }}>▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── static vs live ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass"
          style={{ padding: 26 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Zap size={18} style={{ color: 'var(--accent-ink)' }} />
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 14 }}>Static, bundled at build</h3>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: 12 }}>
            Projects, skills, experience, education and my AWS certification ship inside the JavaScript bundle.
            Zero API calls, instant first paint, and it keeps working even if every server I run is down.
          </p>
          <code style={{ fontSize: 12, color: 'var(--accent-ink)', fontFamily: 'ui-monospace, Consolas, monospace' }}>frontend/src/data/*.js</code>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass"
          style={{ padding: 26 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Server size={18} style={{ color: '#ff9900' }} />
            <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 14 }}>Live, from my backend</h3>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif', marginBottom: 14 }}>
            Latest Medium articles, the study-notes library and any newly added credentials come from a Node/Express API
            on Render. Static data shows first; live data replaces it the moment it arrives.
          </p>
          <StatusChip />
          <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 10, fontFamily: 'ui-monospace, Consolas, monospace', wordBreak: 'break-all' }}>
            <Database size={11} style={{ display: 'inline', marginRight: 6 }} />
            /api/* → {BACKEND_ORIGIN.replace('https://', '')}
          </p>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 44 }}>
        <button type="button" onClick={openCloudShell} className="btn-primary">
          <span className="btn-icon"><Rocket size={15} /></span>
          Run terraform plan in CloudShell
        </button>
        <a href={`${SOCIAL_LINKS.repo}/tree/main/terraform`} target="_blank" rel="noreferrer" className="btn-outline">
          <ExternalLink size={14} /> Read the Terraform
        </a>
      </div>
    </section>
  );
}
