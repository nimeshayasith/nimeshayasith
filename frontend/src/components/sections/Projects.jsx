import { useState } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import TechBadge from '../ui/TechBadge';
import { Link } from 'react-router-dom';
import { PROJECTS, PROJECT_CATEGORIES, FEATURED_PROJECTS } from '../../data/projects';

const HOME_LIMIT = 6;

export default function Projects() {
  const categories = PROJECT_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  /* 'All' shows the featured set; a category tab shows that category's newest. */
  const source = activeCategory === 'all' ? FEATURED_PROJECTS : PROJECTS.filter(p => p.category.slug === activeCategory);
  const filtered = source.slice(0, HOME_LIMIT);

  return (
    <section id="projects" ref={ref} className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      {/* Header */}
      <SectionHeading index="03" label="Portfolio" title={<>Featured <span className="gradient-text">Projects</span></>}
        lead={<>Cloud infrastructure, CI/CD, data pipelines and security research. Two of them were built for AWS Builder weekend challenges.</>}
      />

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2.5 mb-12"
      >
        {['all', ...categories.map(c => c.slug)].map((slug, i) => {
          const label = slug === 'all' ? 'All' : categories.find(c => c.slug === slug)?.name || slug;
          const active = activeCategory === slug;
          return (
            <button
              key={slug}
              onClick={() => setActiveCategory(slug)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                fontFamily: 'Inter, sans-serif',
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#111' : 'var(--text-secondary)',
                border: active ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                boxShadow: active ? '0 0 20px var(--accent-glow)' : 'none',
              }}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div
                  className="glass overflow-hidden group h-full flex flex-col"
                  style={{ transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-glow)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px var(--shadow-ambient)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bg-elevated-2), var(--bg-inverse))' }}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)' }}
                        >
                          <span className="text-2xl font-bold text-accent-500 font-heading">
                            {project.title[0]}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                    {project.aws && (
                      <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#ff9900', color: '#111', fontFamily: 'Inter, sans-serif' }}>AWS</div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="badge text-xs">{project.category?.name}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                      {project.period} · {project.kind}
                    </p>
                    <Link to={`/projects/${project._id}`}>
                      <h3 className="t-h3 mb-2 hover:text-accent-500 transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="t-body mb-4 flex-1 line-clamp-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack?.slice(0, 4).map(tech => (
                        <TechBadge key={tech} tech={tech} />
                      ))}
                      {project.techStack?.length > 4 && (
                        <span className="text-xs text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div
                      className="flex gap-3 pt-4"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <Github className="w-4 h-4" /> Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-500 transition-colors ml-auto"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                      )}
                      {!project.liveUrl && (
                        <Link
                          to={`/projects/${project._id}`}
                          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-500 transition-colors ml-auto"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* View all */}
      {(
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/projects" className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
            <span className="btn-icon">
              <ArrowRight className="w-4 h-4" />
            </span>
            View All {PROJECTS.length} Projects
          </Link>
        </motion.div>
      )}
    </section>
  );
}
