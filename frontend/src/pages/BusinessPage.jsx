import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Boxes, GitBranch, Container, Cloud, ShieldCheck, Activity, Mail, ExternalLink, ArrowRight, CheckCircle2, Github } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import LiveBadge from '../components/ui/LiveBadge';
import TechBadge from '../components/ui/TechBadge';
import useBackend from '../hooks/useBackend';
import { freelanceApi } from '../services/api';
import { BUSINESS_WORK, PROCESS, RELATED_PROJECTS, SERVICES, mergeBusiness } from '../data/business';
import { PERSONAL, SOCIAL_LINKS } from '../data/profile';

const ICONS = { Boxes, GitBranch, Container, Cloud, ShieldCheck, Activity };
const mailto = `mailto:${PERSONAL.email}?subject=${encodeURIComponent('Business enquiry: cloud / DevOps work')}`;

export default function BusinessPage() {
  // Static-first: bundled case studies at once, backend entries merged in when it answers.
  const { data: work, status } = useBackend(() => freelanceApi.getAll(), {
    fallback: BUSINESS_WORK,
    select: (res) => res.freelance ?? res.items ?? res.data,
    merge: mergeBusiness,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Business Work | Nimesha Yasith';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <SectionHeading as="h1" label="Work with me" title={<>Business <span className="gradient-text">Work</span></>}
          lead={<>I help small teams replace manual cloud set-up with automation that is reliable and repeatable: Terraform, CI/CD and Kubernetes, shipped with docs your team can run.</>}
          animate={false}
        />
        <div className="flex flex-wrap gap-3 -mt-4 mb-16">
          <a href={mailto} className="btn-primary">
            <span className="btn-icon"><Mail className="w-4 h-4" /></span>
            Start a conversation
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="btn-outline">
            <ExternalLink className="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>

      <div className="page-wrap pb-24 space-y-24">
        {/* Services */}
        <section>
          <SectionHeading index="01" label="Services" title="What I can do for your business" lead="Six things I build and run, all as code in your own repository." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.icon] || Cloud;
              return (
                <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}>
                  <GlassCard className="p-6 h-full flex flex-col" hover={false}>
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow)' }}>
                      <Icon className="w-5 h-5" style={{ color: 'var(--accent-ink)' }} />
                    </span>
                    <h3 className="t-h3 mb-2">{s.title}</h3>
                    <p className="t-body leading-relaxed mb-4 flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.body}</p>
                    <div className="flex flex-wrap gap-1.5">{s.tags.map((t) => <TechBadge key={t} tech={t} />)}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section>
          <SectionHeading index="02" label="Process" title="How an engagement works" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map((p) => (
              <div key={p.step} className="glass p-6">
                <span className="font-heading font-black text-3xl" style={{ color: 'var(--accent-ink)' }}>{p.step}</span>
                <h3 className="t-h3 mt-2 mb-2">{p.title}</h3>
                <p className="t-body leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Delivered work / closest public examples */}
        <section>
          <SectionHeading
            index="03"
            label="Work"
            title={work.length ? 'Selected work' : 'Closest public examples'}
            lead={work.length ? 'Delivered engagements.' : 'Client case studies are added here as I can publish them. Until then, these open-source projects show the same work end to end.'}
            aside={<LiveBadge status={status} liveLabel="case studies synced from my backend" staticLabel="bundled content" />}
          />

          {work.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {work.map((w) => (
                <GlassCard key={w._id} className="overflow-hidden flex flex-col" hover={false}>
                  {w.image && <img src={w.image} alt={w.title} loading="lazy" className="w-full h-48 object-cover" />}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="t-small mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{[w.client, w.year].filter(Boolean).join(' · ')}</p>
                    <h3 className="t-h3 mb-2">{w.title}</h3>
                    <p className="t-body leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>{w.description}</p>
                    {w.deliverables?.length > 0 && (
                      <ul className="grid gap-2 mb-4">
                        {w.deliverables.map((d) => (
                          <li key={d} className="flex gap-2.5 text-sm text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-ink)' }} /> {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-4">{w.techStack?.map((t) => <TechBadge key={t} tech={t} />)}</div>
                    {w.url && (
                      <a href={w.url} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1.5 text-sm text-accent-500 hover:text-accent-400 w-fit" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Visit <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {RELATED_PROJECTS.map((p) => (
                <GlassCard key={p._id} className="overflow-hidden flex flex-col" hover={false}>
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" className="w-full h-40 object-cover" />}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="t-small mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{p.period} · {p.kind}</p>
                    <h3 className="t-h3 mb-2">{p.title}</h3>
                    <p className="t-body leading-relaxed mb-4 line-clamp-4 flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>{p.description}</p>
                    <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}
                      <Link to={`/projects/${p._id}`} className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-accent-500 transition-colors">
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="glass p-8 md:p-10 text-center" style={{ border: '1px solid var(--accent-glow)' }}>
          <h2 className="section-title mb-3">Have something that should run itself?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Tell me what you run today and what hurts. I reply with a short plan and an honest estimate.
          </p>
          <a href={mailto} className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
            <span className="btn-icon"><Mail className="w-4 h-4" /></span>
            {PERSONAL.email}
          </a>
        </section>
      </div>

      <Footer />
    </div>
  );
}
