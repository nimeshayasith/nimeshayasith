import { motion } from 'framer-motion';
import { ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { FEATURED_CERT } from '../../data/certifications';

const fmt = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/**
 * The AWS Solutions Architect – Associate credential, drawn in the style of
 * the official certificate (navy card, orange frame) with the real details
 * from the PDF. Links to the PDF and to AWS's public verification page.
 */
export default function AwsCertCard({ inView = true }) {
  const c = FEATURED_CERT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="glass aws-cert-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 0,
        overflow: 'hidden',
        border: '1px solid rgba(255,153,0,0.35)',
        boxShadow: '0 0 60px rgba(255,153,0,0.08)',
      }}
    >
      <style>{`
        @media (max-width: 800px) { .aws-cert-grid { grid-template-columns: 1fr !important; } }
        @keyframes awsShine { 0% { transform: translateX(-120%) } 60%,100% { transform: translateX(220%) } }
      `}</style>

      {/* Certificate artwork */}
      <div style={{ position: 'relative', background: '#232f3e', padding: '28px 28px 24px', color: '#fff', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '30%',
            background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.07), transparent)',
            animation: 'awsShine 5s ease-in-out infinite',
          }}
        />
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: 24, letterSpacing: '-0.5px', marginBottom: 22 }}>
          <span style={{ fontWeight: 700 }}>aws</span>{' '}
          <span style={{ color: '#ff9900' }}>⬢</span> certified
        </div>
        <div style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', lineHeight: 1.2, marginBottom: 8, color: '#fff' }}>
          Nimesha Yasith
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#e5e7eb', marginBottom: 26 }}>{c.title}</div>

        <div style={{ border: '1px solid #ff9900', padding: '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: 1.9 }}>
          <div>
            <b>VALIDATION NUMBER:</b>{' '}
            <span style={{ fontFamily: 'ui-monospace, Consolas, monospace', wordBreak: 'break-all' }}>{c.validationNumber}</span>
          </div>
          <div>
            <b>VALIDATE AT:</b> <span style={{ color: '#ff9900' }}>aws.amazon.com/verification</span>
          </div>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'Inter, sans-serif', fontSize: 12, lineHeight: 1.8, color: '#cbd5e1' }}>
          <div><b style={{ color: '#fff' }}>Issue Date:</b> {fmt(c.date)}</div>
          <div><b style={{ color: '#fff' }}>Expiration Date:</b> {fmt(c.expires)}</div>
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
        <span className="badge" style={{ alignSelf: 'flex-start' }}>
          <ShieldCheck size={13} /> Verified credential
        </span>
        <h3 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: 17, lineHeight: 1.3 }}>
          AWS Certified Solutions Architect <span className="gradient-text">Associate</span>
        </h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>
          Validates the ability to design secure, resilient, high-performing and cost-optimised architectures on AWS.
          The same thinking sits behind the Terraform, EKS, CloudFront and Amplify setups in my projects, including this site.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
          <a href={c.pdf} target="_blank" rel="noreferrer" className="btn-primary">
            <span className="btn-icon"><FileText size={15} /></span>
            View certificate
          </a>
          <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="btn-outline">
            <ExternalLink size={14} /> Verify on AWS
          </a>
        </div>
      </div>
    </motion.div>
  );
}
