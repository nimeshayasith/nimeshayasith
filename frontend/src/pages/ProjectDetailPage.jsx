import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink, CheckCircle2, User, Calendar } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import GlassCard from '../components/ui/GlassCard';
import TechBadge from '../components/ui/TechBadge';
import Lightbox from '../components/ui/Lightbox';
import VideoCard from '../components/ui/VideoCard';
import { useVideos } from '../hooks/useFeeds';
import { videoForProject } from '../data/feeds';
import { PROJECTS, getProject } from '../data/projects';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = getProject(id);
  const [shot, setShot] = useState(null);
  const { videos } = useVideos();
  const demo = project ? videoForProject(project._id, videos) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = project ? `${project.title} | Nimesha Yasith` : 'Project not found | Nimesha Yasith';
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-24 text-center px-4">
          <h1 className="t-display mb-4">Project not found</h1>
          <p className="text-slate-400 mb-8">That project doesn't exist (yet).</p>
          <Link to="/projects" className="btn-primary inline-flex">
            <span className="btn-icon"><ArrowLeft className="w-4 h-4" /></span>
            Back to projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const index = PROJECTS.findIndex((p) => p._id === project._id);
  const related = PROJECTS.filter((p) => p.category.slug === project.category.slug && p._id !== project._id).slice(0, 3);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="page-wrap pt-32 sm:pt-36 pb-10">
        <div className="max-w-4xl">
          <Link to="/projects" className="t-label inline-flex items-center gap-2 hover:text-accent-500 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> All projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="badge">{project.category.name}</span>
              {project.aws && (
                <span className="t-label px-3 py-1.5 rounded-full" style={{ background: '#ff9900', color: '#111' }}>
                  Built on AWS
                </span>
              )}
            </div>
            <h1 className="t-display t-display--long mb-5">{project.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 t-small mb-6">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {project.period}</span>
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> {project.kind}</span>
            </div>
            <p className="t-lead">{project.description}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <span className="btn-icon"><ExternalLink className="w-4 h-4" /></span>
                  Live demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  <Github className="w-4 h-4" /> Source code
                </a>
              )}
              {project.links?.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn-outline">
                  <ExternalLink className="w-4 h-4" /> {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Screenshots: drop files named <id>.png, <id>-2.png … into src/media/projects */}
      {project.images?.length > 0 && (
        <div className="page-wrap pb-8">
          <div className={`grid gap-4 max-w-4xl ${project.images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {project.images.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setShot(i)}
                aria-label={`Open screenshot ${i + 1} of ${project.title}`}
                className={`glass overflow-hidden p-0 cursor-zoom-in ${i === 0 && project.images.length % 2 === 1 ? 'sm:col-span-2' : ''}`}
              >
                <img src={url} alt={`${project.title}, screenshot ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <Lightbox
            items={project.images.map((url, i) => ({ url, title: project.title, caption: `Screenshot ${i + 1}` }))}
            index={shot}
            onClose={() => setShot(null)}
            onIndex={setShot}
          />
        </div>
      )}

      {/* Body */}
      <div className="page-wrap pb-16">
        <div className="max-w-4xl grid gap-6">
          {project.myPart && (
            <div className="glass p-7" style={{ border: '1px solid var(--accent-glow)' }}>
              <h2 className="t-label mb-3">My part</h2>
              <p className="t-body">{project.myPart}</p>
            </div>
          )}

          {project.highlights?.length > 0 && (
            <div className="glass p-7">
              <h2 className="t-label mb-4">Highlights</h2>
              <ul className="grid gap-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 t-body">
                    <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--accent-ink)' }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {demo && (
            <div>
              <h2 className="t-label mb-3">Demo video</h2>
              <div className="max-w-xl"><VideoCard video={demo} /></div>
            </div>
          )}

          <div className="glass p-7">
            <h2 className="t-label mb-4">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <TechBadge key={t} tech={t} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="page-wrap pb-16">
          <h2 className="section-title mb-6">More in {project.category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p._id} to={`/projects/${p._id}`}>
                <GlassCard className="p-5 h-full">
                  <p className="t-small mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{p.period}</p>
                  <h3 className="t-h3 mb-2">{p.title}</h3>
                  <p className="t-small line-clamp-3" style={{ fontFamily: 'Inter, sans-serif' }}>{p.description}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pb-20">
        <Link to={`/projects/${next._id}`} className="btn-outline">
          Next: {next.title} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Footer />
    </div>
  );
}
