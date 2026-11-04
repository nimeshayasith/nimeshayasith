import { Github, Linkedin, Youtube, BookOpen, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../../data/profile';
import { openCloudShell } from '../shell/CloudShell';

const SOCIAL = [
  { icon: Github,   href: SOCIAL_LINKS.github,   label: 'GitHub' },
  { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
  { icon: BookOpen, href: SOCIAL_LINKS.medium,   label: 'Medium' },
  { icon: Youtube,  href: SOCIAL_LINKS.youtube,  label: 'YouTube' },
];

const NAV_LINKS = [
  { label: 'Projects',       to: '/projects' },
  { label: 'Experience',     to: '/experience' },
  { label: 'Certifications', to: '/certifications' },
  { label: 'Library',        to: '/library' },
  { label: 'Articles',       to: '/blogs' },
  { label: 'Videos',         to: '/videos' },
  { label: 'Gallery',        to: '/gallery' },
  { label: 'Business Work',  to: '/business' },
  { label: 'Contact',        href: '/#contact' },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 40 }}>
      {/* Accent line */}
      <div style={{ height: 2, background: 'linear-gradient(to right, transparent, #cefe08, transparent)' }} />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-dark text-sm"
                style={{ background: '#cefe08', boxShadow: '0 0 20px rgba(206,254,8,0.2)' }}
              >
                NY
              </div>
              <div>
                <p className="font-heading font-bold text-white text-base">Nimesha Yasith</p>
                <p className="text-slate-600 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Cloud &amp; DevOps Engineer</p>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
              Automating infrastructure with Terraform, shipping with CI/CD, and running workloads on AWS and Kubernetes. AWS Certified Solutions Architect – Associate.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-slate-600 hover:text-accent-500 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                      className="text-sm text-slate-600 hover:text-accent-500 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm mb-5">Follow Me</h4>
            <div className="flex flex-wrap gap-2.5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-dark transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = '#111';
                    e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="t-label" style={{ textTransform: 'none', letterSpacing: '0.04em' }}>
            &copy; {new Date().getFullYear()} Nimesha Yasith · build {typeof __BUILD_COMMIT__ !== 'undefined' ? __BUILD_COMMIT__ : 'local'} · AWS Amplify + CloudFront
          </p>
          <button
            onClick={openCloudShell}
            className="text-xs transition-colors"
            style={{ fontFamily: 'ui-monospace, Consolas, monospace', color: 'var(--accent-ink)' }}
          >
            &gt;_ open CloudShell
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-accent-500 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowUp className="w-4 h-4" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
