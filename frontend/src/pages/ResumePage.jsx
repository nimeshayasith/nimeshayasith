import { useEffect } from 'react';
import { Mail, Github, Linkedin, MapPin, Lock } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import { PERSONAL, SOCIAL_LINKS, BIO } from '../data/profile';
import { EXPERIENCE, EDUCATION, VOLUNTEERING } from '../data/experience';
import { SKILLS } from '../data/skills';
import { CERTIFICATIONS } from '../data/certifications';
import { FEATURED_PROJECTS } from '../data/projects';

const MAIL = `mailto:${PERSONAL.email}?subject=${encodeURIComponent('Résumé request')}&body=${encodeURIComponent(
  'Hi Nimesha,\n\nCould you please send me a copy of your résumé?\n\nThank you,\n',
)}`;

const fmtYear = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

/** Skills grouped by their category, in the order they are listed in data/skills.js (levels are left out on purpose). */
const skillGroups = () => {
  const groups = new Map();
  SKILLS.forEach((s) => {
    if (!groups.has(s.category)) groups.set(s.category, []);
    groups.get(s.category).push(s.name);
  });
  return [...groups.entries()];
};

const firstSentence = (t = '') => (t.match(/^.*?[.!?](\s|$)/) || [t])[0].trim();

function Block({ title, children }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="section-title mb-6">{title}</h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Résumé | Nimesha Yasith';
  }, []);

  const block = (e) => e.preventDefault();

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <SectionHeading
          as="h1"
          label="Résumé"
          title={<>Nimesha <span className="gradient-text">Yasith</span></>}
          lead={PERSONAL.tagline}
          animate={false}
        />
      </div>

      <div className="page-wrap pb-24">
        {/* why there is no PDF + how to ask for one */}
        <aside className="resume-actions glass p-6 mb-12 flex flex-wrap items-center justify-between gap-5" aria-label="About this résumé">
          <div className="flex items-start gap-4" style={{ minWidth: 0, flex: '1 1 320px' }}>
            <Lock className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--accent-ink)' }} />
            <div>
              <h2 className="t-h3 mb-1">Read online, by lamplight</h2>
              <p className="t-body">
                My CV contains personal details, so there is no PDF to download on this site and the page below does not print.
                Everything on it is readable here. If you need a copy for an application, ask and I will send it.
              </p>
            </div>
          </div>
          <a href={MAIL} className="btn-primary">
            <span className="btn-icon"><Mail className="w-4 h-4" /></span>
            Request a copy
          </a>
        </aside>

        <div className="resume-print-note">
          <p><strong>Nimesha Yasith: résumé.</strong> This page is read-only and does not print. To get a copy, email {PERSONAL.email}.</p>
        </div>

        <article className="resume-sheet glass p-7 sm:p-10" onCopy={block} onCut={block} onContextMenu={block} onDragStart={block}>
          <p className="t-small flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
            <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" /> {PERSONAL.location}</span>
            <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {PERSONAL.email}</span>
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent-500 transition-colors"><Github className="w-4 h-4" /> github.com/nimeshayasith</a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-accent-500 transition-colors"><Linkedin className="w-4 h-4" /> linkedin.com/in/nimesha-yasith</a>
          </p>

          <Block title="Summary">
            <p className="t-lead mb-4" style={{ color: 'var(--text-primary)' }}>{PERSONAL.title}. {PERSONAL.subtitle}.</p>
            {BIO.slice(0, 2).map((p) => <p key={p} className="t-body mb-3">{p}</p>)}
            <p className="t-body" style={{ color: 'var(--accent-ink)' }}>{PERSONAL.openTo}</p>
          </Block>

          <Block title="Experience">
            <div className="grid gap-9">
              {EXPERIENCE.map((e) => (
                <div key={e._id}>
                  <p className="t-small mb-1">{e.period} · {e.location}</p>
                  <h3 className="t-h3">{e.role}</h3>
                  <p className="t-body mb-3" style={{ color: 'var(--accent-ink)' }}>{e.company}</p>
                  <ul className="grid gap-2">
                    {e.achievements.map((a) => (
                      <li key={a} className="diff-line t-body" style={{ color: 'var(--text-primary)' }}>
                        <span className="diff-plus" aria-hidden="true">+</span><span>{a}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="t-small mt-3">{e.techStack.join(' · ')}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Education">
            <div className="grid gap-6">
              {EDUCATION.map((e) => (
                <div key={e._id}>
                  <p className="t-small mb-1">{e.year}</p>
                  <h3 className="t-h3">{e.title}</h3>
                  <p className="t-body">{e.org}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Skills">
            <dl className="grid gap-4">
              {skillGroups().map(([cat, names]) => (
                <div key={cat} className="grid sm:grid-cols-[180px_minmax(0,1fr)] gap-1 sm:gap-6">
                  <dt className="t-label pt-1">{cat}</dt>
                  <dd className="t-body" style={{ color: 'var(--text-primary)' }}>{names.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block title="Certifications">
            <ul className="grid gap-4">
              {CERTIFICATIONS.map((c) => (
                <li key={c._id}>
                  <p className="t-body" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.title}</p>
                  <p className="t-small">{c.issuer}{c.date ? ` · ${fmtYear(c.date)}` : ''}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Selected projects">
            <ul className="grid gap-5">
              {FEATURED_PROJECTS.map((p) => (
                <li key={p._id}>
                  <h3 className="t-h3 mb-1">{p.title}</h3>
                  <p className="t-body">{firstSentence(p.description)}</p>
                  {p.techStack?.length > 0 && <p className="t-small mt-1">{p.techStack.slice(0, 6).join(' · ')}</p>}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Volunteering">
            <div className="grid gap-6">
              {VOLUNTEERING.map((v) => (
                <div key={v._id}>
                  <p className="t-small mb-1">{v.period}</p>
                  <h3 className="t-h3">{v.role}</h3>
                  <p className="t-body">{v.org}. {v.detail}</p>
                </div>
              ))}
            </div>
          </Block>
        </article>
      </div>

      <Footer />
    </div>
  );
}
