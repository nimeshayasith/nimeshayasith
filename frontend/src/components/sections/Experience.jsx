import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import TechBadge from '../ui/TechBadge';
import { sfx } from '../../lib/sfx';
import { EXPERIENCE, EDUCATION, VOLUNTEERING } from '../../data/experience';

/**
 * Experience, told as a git history: each role / degree / volunteering stint is a commit on a branch.
 * The hash is only a short stable fingerprint of the entry's id (decoration, not real git data).
 */
const fingerprint = (s) => {
  let h = 2166136261;
  for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
};

const BRANCHES = [
  {
    key: 'main',
    hint: 'work',
    items: EXPERIENCE.map((e) => ({
      id: e._id, title: e.role, where: `${e.company} · ${e.location}`, when: e.period,
      text: e.description, lines: e.achievements, tags: e.techStack, image: e.image,
    })),
  },
  {
    key: 'education',
    hint: 'study',
    items: EDUCATION.map((e) => ({ id: e._id, title: e.title, where: e.org, when: e.year, image: e.image })),
  },
  {
    key: 'community',
    hint: 'volunteering',
    items: VOLUNTEERING.map((v) => ({ id: v._id, title: v.role, where: v.org, when: v.period, text: v.detail, url: v.url, image: v.image })),
  },
];

function Commit({ item, head, branch, index }) {
  return (
    <motion.article
      className={`commit ${head ? 'is-head' : ''}`}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.08 * index }}
    >
      <div className="glass p-6">
        <p className="commit-meta mb-3">
          <span>commit <b>{fingerprint(item.id)}</b></span>
          {head && <span className="commit-head">HEAD → {branch}</span>}
          <span>{item.when}</span>
        </p>

        <div className="flex items-start gap-4">
          {item.image && (
            <img src={item.image} alt="" loading="lazy" className="w-12 h-12 rounded-lg object-contain flex-shrink-0" style={{ background: '#fff', padding: 4 }} />
          )}
          <div style={{ minWidth: 0 }}>
            <h3 className="t-h3">{item.title}</h3>
            <p className="t-body mt-1" style={{ color: 'var(--accent-ink)' }}>{item.where}</p>
          </div>
        </div>

        {item.text && <p className="t-body mt-4">{item.text}</p>}

        {item.lines?.length > 0 && (
          <div className="mt-4" aria-label="What I did">
            {item.lines.map((line) => (
              <p key={line} className="diff-line t-body" style={{ color: 'var(--text-primary)' }}>
                <span className="diff-plus" aria-hidden="true">+</span>
                <span>{line}</span>
              </p>
            ))}
          </div>
        )}

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tags.map((t) => <TechBadge key={t} tech={t} />)}
          </div>
        )}

        {item.url && (
          <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 t-small mt-4 hover:text-accent-500 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> GitHub
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const [branch, setBranch] = useState('main');
  const active = BRANCHES.find((b) => b.key === branch);

  return (
    <section id="experience" className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      <SectionHeading
        index="04"
        label="Journey"
        title={<>My <span className="gradient-text">Experience</span></>}
        lead="Two DevOps and engineering internships, a Computer Engineering degree, and community work. Switch branches to read each one."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="t-label mb-3">$ git checkout</p>
          <div className="branch-bar lg:flex lg:flex-col lg:w-full" role="group" aria-label="Choose a branch">
            {BRANCHES.map((b) => (
              <button
                key={b.key}
                type="button"
                className="branch-btn lg:w-full lg:justify-between"
                aria-pressed={branch === b.key}
                onClick={() => { sfx.click(); setBranch(b.key); }}
              >
                <span>{b.key}</span>
                <small>{b.items.length}<span className="hidden lg:inline"> · {b.hint}</span></small>
              </button>
            ))}
          </div>
          <p className="t-small mt-5">
            {active.items.length} commits on <span style={{ fontFamily: 'ui-monospace, Consolas, monospace', color: 'var(--text-primary)' }}>{active.key}</span>
          </p>
          <Link to="/experience" className="btn-outline mt-5">
            Full details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="gitlog">
              {active.items.map((item, i) => (
                <Commit key={item.id} item={item} head={i === 0} branch={active.key} index={i} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
