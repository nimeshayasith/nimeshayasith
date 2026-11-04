import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { useInView } from 'react-intersection-observer';
import { Award, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import AwsCertCard from '../ui/AwsCertCard';
import LiveBadge from '../ui/LiveBadge';
import useCertifications from '../../hooks/useCertifications';

export const CertGrid = ({ certs, inView = true }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {certs.map((cert, i) => (
      <motion.div
        key={cert._id || cert.title}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: i * 0.08 }}
      >
        <GlassCard className="overflow-hidden group h-full flex flex-col" hover={false}>
          <div
            className="relative h-40 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--bg-elevated-2), var(--bg-inverse))' }}
          >
            {cert.image ? (
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent-glow)' }}
                >
                  <Award className="w-8 h-8" style={{ color: 'var(--accent-ink)' }} />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="t-h3 mb-1">{cert.title}</h3>
            <p className="text-accent-500 text-sm font-medium mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              {cert.issuer}
            </p>
            <div className="flex items-center gap-1.5 text-slate-600 text-xs mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Calendar className="w-3.5 h-3.5" />
              {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-500 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <ExternalLink className="w-4 h-4" /> View Credential
              </a>
            )}
          </div>
        </GlassCard>
      </motion.div>
    ))}
  </div>
);

export default function Certifications() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const { data, status } = useCertifications();
  const others = data.filter((c) => !c.featured);

  return (
    <section id="certifications" ref={ref} className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      <SectionHeading index="05" label="Credentials" title={<><span className="gradient-text">Certifications</span> &amp; Achievements</>}
        lead={<>Professional certifications and achievements validating hands-on cloud and DevOps skills.</>}
        aside={<LiveBadge status={status} />}
      />

      <div className="max-w-5xl mx-auto mb-10">
        <AwsCertCard inView={inView} />
      </div>

      <CertGrid certs={others.slice(0, 3)} inView={inView} />

      <div className="text-center mt-12">
        <Link to="/certifications" className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
          <span className="btn-icon">
            <ArrowRight className="w-4 h-4" />
          </span>
          View All
        </Link>
      </div>
    </section>
  );
}
