import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Trophy, GraduationCap, HeartHandshake, MapPin, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import TechBadge from '../components/ui/TechBadge';
import { EXPERIENCE, EDUCATION, VOLUNTEERING } from '../data/experience';

export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Experience | Nimesha Yasith';
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <SectionHeading as="h1" label="Journey" title={<>My <span className="gradient-text">Experience</span></>}
          lead={<>Two internships, a Computer Engineering degree, and community work along the way.</>}
          animate={false}
        />
      </div>

      <div className="page-wrap pb-20 space-y-16">
        {/* Work */}
        <section>
          <h2 className="section-title flex items-center gap-3 mb-6">
            <Briefcase className="w-5 h-5" style={{ color: 'var(--accent-ink)' }} /> Work experience
          </h2>
          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard className="p-7" hover={false}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-4">
                      {exp.image && (
                        <img
                          src={exp.image}
                          alt={`${exp.company} logo`}
                          loading="lazy"
                          className="w-14 h-14 rounded-xl object-contain p-1.5 flex-shrink-0"
                          style={{ background: '#fff', border: '1px solid var(--border-subtle)' }}
                        />
                      )}
                      <div>
                        <h3 className="t-h3">{exp.role}</h3>
                        <p className="text-accent-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{exp.company}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <div className="flex items-center gap-2 justify-end"><Calendar className="w-4 h-4" /> {exp.period}</div>
                      <div className="flex items-center gap-2 justify-end mt-1"><MapPin className="w-4 h-4" /> {exp.location}</div>
                    </div>
                  </div>
                  <p className="t-body mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>{exp.description}</p>
                  <ul className="grid gap-2.5 mb-5">
                    {exp.achievements.map((a) => (
                      <li key={a} className="flex gap-3 text-sm text-slate-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Trophy className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-ink)' }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map((t) => <TechBadge key={t} tech={t} />)}
                  </div>
                  {exp.images?.length > 1 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                      {exp.images.slice(1).map((url, k) => (
                        <img key={url} src={url} alt={`${exp.company}, photo ${k + 1}`} loading="lazy" className="w-full h-32 object-cover rounded-xl" style={{ border: '1px solid var(--border-subtle)' }} />
                      ))}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="section-title flex items-center gap-3 mb-6">
            <GraduationCap className="w-5 h-5" style={{ color: 'var(--accent-ink)' }} /> Education
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {EDUCATION.map((e) => (
              <div key={e._id} className="glass p-6">
                {e.image && <img src={e.image} alt={e.org} loading="lazy" className="w-12 h-12 rounded-lg object-contain mb-3" style={{ background: '#fff', padding: 4 }} />}
                <p className="t-small mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{e.year}</p>
                <h3 className="t-h3 mb-2">{e.title}</h3>
                <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>{e.org}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteering */}
        <section>
          <h2 className="section-title flex items-center gap-3 mb-6">
            <HeartHandshake className="w-5 h-5" style={{ color: 'var(--accent-ink)' }} /> Volunteering &amp; community
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {VOLUNTEERING.map((v) => (
              <div key={v._id} className="glass p-6">
                {v.image && <img src={v.image} alt={v.org} loading="lazy" className="w-full h-32 object-cover rounded-lg mb-3" />}
                <p className="t-small mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{v.period}</p>
                <h3 className="t-h3 mb-1">{v.role}</h3>
                <p className="text-accent-500 text-sm mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{v.org}</p>
                <p className="t-body" style={{ fontFamily: 'Inter, sans-serif' }}>{v.detail}</p>
                {v.url && (
                  <a href={v.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-500 transition-colors mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <ExternalLink className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
