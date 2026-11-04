import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Download, TerminalSquare, ChevronDown } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import SoundToggle from '../ui/SoundToggle';
import { FILES } from '../../data/profile';
import { openCloudShell } from '../shell/CloudShell';

const NAV_LINKS = [
  { label: 'About',          href: '/about',                                type: 'page' },
  { label: 'Projects',       href: '/projects',                             type: 'page' },
  { label: 'Experience',     href: '/experience',                           type: 'page' },
  { label: 'Certifications', href: '/certifications',                       type: 'page' },
  { label: 'Business Work',  href: '/business',                             type: 'page' },
  { label: 'Library',        href: '/library',                              type: 'page', more: true },
  { label: 'Gallery',        href: '/gallery',                              type: 'page', more: true },
  { label: 'Articles',       href: '/blogs',                                type: 'page', more: true },
  { label: 'Videos',         href: '/videos',                               type: 'page', more: true },
  { label: 'Architecture',   href: '#architecture',                         type: 'hash', more: true },
  { label: 'Contact',        href: '#contact',                              type: 'hash' },
];
const MAIN_LINKS = NAV_LINKS.filter(l => !l.more);
const MORE_LINKS = NAV_LINKS.filter(l => l.more);

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef   = useRef(null);
  const location  = useLocation();
  const isHome    = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the "More" menu on outside click, Esc, or navigation
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onDown = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [moreOpen]);
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  const isActive = (link) => {
    if (link.type === 'page') return location.pathname === link.href;
    return false;
  };

  const renderLink = (link, mobile = false) => {
    /* ── Active pill style (lime, like Classic Portfolio) ── */
    const activeStyle = {
      background: 'var(--accent)',
      color: '#111',
      borderRadius: 30,
      padding: mobile ? '8px 18px' : '7px 20px',
      fontWeight: 700,
    };
    const normalStyle = {
      color: 'var(--text-secondary)',
      padding: mobile ? '8px 18px' : '7px 20px',
      fontWeight: 500,
      borderRadius: 30,
      transition: 'color 0.2s ease, background 0.2s ease',
    };
    const active = isActive(link);

    const baseClass = 'text-sm font-medium transition-all duration-200';

    if (link.type === 'external') {
      return (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`${baseClass} flex items-center gap-1`}
          style={normalStyle}
          onClick={() => setMobileOpen(false)}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; } }}
          onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
        >
          {link.label}
          <ExternalLink style={{ width: 11, height: 11, opacity: 0.5 }} />
        </a>
      );
    }
    if (link.type === 'hash') {
      const href = isHome ? link.href : `/${link.href}`;
      return (
        <a
          key={link.label}
          href={href}
          className={baseClass}
          style={normalStyle}
          onClick={() => setMobileOpen(false)}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link
        key={link.label}
        to={link.href}
        onClick={() => setMobileOpen(false)}
        className={baseClass}
        style={active ? activeStyle : normalStyle}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: scrolled ? `0 4px 30px var(--shadow-ambient)` : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          {/* KS-style logo mark */}
          <span
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              color: 'var(--text-primary)',
              letterSpacing: '-1px',
              lineHeight: 1,
            }}
          >
            NY
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div
          className="hidden lg:flex"
          style={{ alignItems: 'center', gap: 2, fontFamily: 'Inter, sans-serif' }}
        >
          {MAIN_LINKS.map(link => renderLink(link))}

          {/* ── More ▾ ── */}
          <div ref={moreRef} style={{ position: 'relative' }}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(o => !o)}
              className="text-sm font-medium"
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '7px 16px', borderRadius: 30, border: 'none', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: MORE_LINKS.some(isActive) ? 700 : 500,
                background: MORE_LINKS.some(isActive) ? 'var(--accent)' : moreOpen ? 'var(--bg-card-hover)' : 'transparent',
                color: MORE_LINKS.some(isActive) ? '#111' : 'var(--text-secondary)',
              }}
            >
              More
              <ChevronDown style={{ width: 14, height: 14, transition: 'transform 0.2s ease', transform: moreOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {moreOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0, minWidth: 190, padding: 8, borderRadius: 18,
                  background: 'var(--bg-nav)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-subtle)', boxShadow: '0 16px 40px var(--shadow-ambient)',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}
                onClick={() => setMoreOpen(false)}
              >
                {MORE_LINKS.map(link => renderLink(link, true))}
              </div>
            )}
          </div>
        </div>

        {/* ── Download CV button (Classic Portfolio style) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SoundToggle />
          <ThemeToggle />

          <button
            type="button"
            onClick={openCloudShell}
            aria-label="Open CloudShell terminal"
            title="CloudShell: try typing commands (press `)"
            style={{
              display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px',
              borderRadius: 30, background: 'var(--bg-card)', border: '1px dashed var(--accent-glow)',
              color: 'var(--accent-ink)', cursor: 'pointer', fontFamily: 'ui-monospace, Consolas, monospace',
              fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--accent-glow)'; }}
          >
            <TerminalSquare style={{ width: 15, height: 15 }} />
            <span className="hidden sm:inline">&gt;_ shell</span>
          </button>

          <a
            href={FILES.cv}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex"
            style={{
              alignItems: 'center',
              gap: 0,
              background: 'var(--bg-inverse)',
              color: '#fff', /* pill is always dark, so its label must always be light */
              padding: '6px 18px 6px 8px',
              borderRadius: 30,
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              border: '2px solid var(--accent-glow)',
              transition: 'border-color 0.3s ease, background 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--accent-glow)';
            }}
          >
            {/* Circle icon */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--accent)',
                marginRight: 10,
                flexShrink: 0,
              }}
            >
              <Download style={{ width: 15, height: 15, color: '#111' }} />
            </span>
            Download CV
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer', padding: 6,
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X style={{ width: 22, height: 22 }} />
              : <Menu style={{ width: 22, height: 22 }} />
            }
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{
              background: 'var(--bg-nav)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '8px 24px 16px', fontFamily: 'Inter, sans-serif' }}>
              {NAV_LINKS.map(link => (
                <div key={link.label} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {renderLink(link, true)}
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <a
                  href={FILES.cv}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0,
                    background: 'var(--accent)',
                    color: '#111',
                    padding: '6px 18px 6px 8px',
                    borderRadius: 30,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: '50%', background: '#111', marginRight: 10,
                  }}>
                    <Download style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                  </span>
                  Download CV
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
