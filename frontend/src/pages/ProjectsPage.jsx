import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import TechBadge from '../components/ui/TechBadge';
import Skills from '../components/sections/Skills';
import { PROJECTS, PROJECT_CATEGORIES } from '../data/projects';

export default function ProjectsPage() {
  const projects = PROJECTS;
  const categories = PROJECT_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState('all');
  const { ref } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Projects | Nimesha Yasith';
  }, []);

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter(p => p.category?.slug === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="page-wrap">
        <SectionHeading as="h1" label="Portfolio" title={<>My <span className="gradient-text">Projects</span></>}
          lead={<>Cloud infrastructure, CI/CD, data pipelines, security research and software, from the newest to the first.</>}
          animate={false}
        />
      </div>

      {/* Filter */}
      <div className="page-wrap">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-accent-500 text-black shadow-[0_0_20px_rgba(206,254,8,0.3)]'
                : 'glass glass-hover text-slate-400'
            }`}
          >
            All ({projects.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.slug
                  ? 'bg-accent-500 text-black shadow-[0_0_20px_rgba(206,254,8,0.3)]'
                  : 'glass glass-hover text-slate-400'
              }`}
            >
              {cat.name} ({projects.filter(p => p.category?.slug === cat.slug).length})
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {(
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <GlassCard className="overflow-hidden group h-full flex flex-col" hover={false}>
                      {/* Image */}
                      <Link to={`/projects/${project._id}`} className="block">
                        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary-900/30 to-slate-900">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-20 h-20 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                                <span className="text-3xl font-bold text-primary-400">{project.title[0]}</span>
                              </div>
                            </div>
                          )}
                          {project.aws && (
                            <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#ff9900', color: '#111', fontFamily: 'Inter, sans-serif' }}>AWS</div>
                          )}
                          <div className="absolute bottom-3 left-3">
                            <span className="badge text-xs">{project.category?.name}</span>
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-medium flex items-center gap-2 glass px-4 py-2 rounded-xl">
                              View Details <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <Link to={`/projects/${project._id}`}>
                          <h3 className="t-h3 mb-2 hover:text-primary-400 transition-colors">
                            {project.title}
                          </h3>
                        </Link>
                        <p className="t-small mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{project.period} · {project.kind}</p>
                        <p className="t-body mb-4 flex-1 line-clamp-4">{project.description}</p>

                        {project.techStack?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.techStack.slice(0, 5).map(tech => (
                              <TechBadge key={tech} tech={tech} />
                            ))}
                            {project.techStack.length > 5 && (
                              <span className="text-xs text-slate-500">+{project.techStack.length - 5} more</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary-400 transition-colors">
                              <Github className="w-4 h-4" /> Code
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noreferrer"
                              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-accent-400 transition-colors">
                              <ExternalLink className="w-4 h-4" /> Live
                            </a>
                          )}
                          <Link to={`/projects/${project._id}`}
                            className="ml-auto flex items-center gap-1 text-sm text-slate-400 hover:text-primary-400 transition-colors">
                            Details <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            )
          }
        </div>
      </div>

      {/* Skills Section embedded */}
      <div className="border-t border-white/5">
        <Skills />
      </div>

      <Footer />
    </div>
  );
}
