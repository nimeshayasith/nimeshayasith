import { motion } from 'framer-motion';

/**
 * The one heading block used by every section and every page, so type sizes, spacing and
 * alignment can't drift from page to page.
 *
 *   <SectionHeading index="03" label="Projects" title={<>Things I've <em>shipped</em></>} lead="…" aside={<LiveBadge/>} />
 *   <SectionHeading as="h1" label="Gallery" title="…" />      // page title: bigger, top padding for the navbar
 *
 * `title` may contain <Accent>…</Accent> for the lime word.
 */
export const Accent = ({ children }) => <span className="gradient-text">{children}</span>;

export default function SectionHeading({ index, label, title, lead, aside, as = 'h2', animate = true, className = '' }) {
  const H = as;
  const page = as === 'h1';
  const Wrap = animate ? motion.header : 'header';
  const motionProps = animate ? { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.5 } } : {};

  return (
    <Wrap className={`sh ${page ? 'pt-32 sm:pt-36' : ''} ${className}`} {...motionProps}>
      <div className="sh-top">
        <div style={{ maxWidth: 720 }}>
          <p className="t-label" style={{ marginBottom: 14, color: 'var(--text-secondary)' }}>
            {index && <span className="sh-index">{index}</span>}
            {index && <span aria-hidden="true" style={{ marginRight: 10 }}>/</span>}
            {label}
          </p>
          <H className={page ? 't-display' : 'section-title'}>{title}</H>
          {lead && <p className="t-lead" style={{ marginTop: 16, maxWidth: 620 }}>{lead}</p>}
        </div>
        {aside && <div style={{ paddingBottom: 4 }}>{aside}</div>}
      </div>
      <span className="sh-rule" aria-hidden="true" />
    </Wrap>
  );
}
