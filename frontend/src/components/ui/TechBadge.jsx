import useThemeStore from '../../store/themeStore';

/* Each tech has a dark-mode pastel-on-translucent pairing and a light-mode
   deep-on-tint pairing — light pastel text on a pale tint reads fine on a
   near-black page but disappears on a near-white one, so the two themes
   need genuinely different colors, not just a shared CSS variable. */
const COLORS = {
  'React':          { dark: { bg: 'rgba(6,182,212,0.12)',   text: '#67e8f9', border: 'rgba(6,182,212,0.25)' },  light: { bg: 'rgba(6,182,212,0.1)',   text: '#0e7490', border: 'rgba(6,182,212,0.3)' } },
  'React Native':   { dark: { bg: 'rgba(6,182,212,0.12)',   text: '#67e8f9', border: 'rgba(6,182,212,0.25)' },  light: { bg: 'rgba(6,182,212,0.1)',   text: '#0e7490', border: 'rgba(6,182,212,0.3)' } },
  'Node.js':        { dark: { bg: 'rgba(34,197,94,0.12)',   text: '#86efac', border: 'rgba(34,197,94,0.25)' },  light: { bg: 'rgba(34,197,94,0.1)',   text: '#15803d', border: 'rgba(34,197,94,0.3)' } },
  'Python':         { dark: { bg: 'rgba(234,179,8,0.12)',   text: '#fde047', border: 'rgba(234,179,8,0.25)' },  light: { bg: 'rgba(234,179,8,0.12)',  text: '#a16207', border: 'rgba(234,179,8,0.3)' } },
  'Docker':         { dark: { bg: 'rgba(59,130,246,0.12)',  text: '#93c5fd', border: 'rgba(59,130,246,0.25)' }, light: { bg: 'rgba(59,130,246,0.1)',  text: '#1d4ed8', border: 'rgba(59,130,246,0.3)' } },
  'Kubernetes':     { dark: { bg: 'rgba(59,130,246,0.12)',  text: '#93c5fd', border: 'rgba(59,130,246,0.25)' }, light: { bg: 'rgba(59,130,246,0.1)',  text: '#1d4ed8', border: 'rgba(59,130,246,0.3)' } },
  'MongoDB':        { dark: { bg: 'rgba(16,185,129,0.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.25)' }, light: { bg: 'rgba(16,185,129,0.1)',  text: '#047857', border: 'rgba(16,185,129,0.3)' } },
  'AWS':            { dark: { bg: 'rgba(249,115,22,0.12)',  text: '#fdba74', border: 'rgba(249,115,22,0.25)' }, light: { bg: 'rgba(249,115,22,0.1)',  text: '#c2410c', border: 'rgba(249,115,22,0.3)' } },
  'Java':           { dark: { bg: 'rgba(239,68,68,0.12)',   text: '#fca5a5', border: 'rgba(239,68,68,0.25)' },  light: { bg: 'rgba(239,68,68,0.1)',   text: '#b91c1c', border: 'rgba(239,68,68,0.3)' } },
  'TypeScript':     { dark: { bg: 'rgba(59,130,246,0.12)',  text: '#93c5fd', border: 'rgba(59,130,246,0.25)' }, light: { bg: 'rgba(59,130,246,0.1)',  text: '#1d4ed8', border: 'rgba(59,130,246,0.3)' } },
  'Redis':          { dark: { bg: 'rgba(220,38,38,0.12)',   text: '#fca5a5', border: 'rgba(220,38,38,0.25)' },  light: { bg: 'rgba(220,38,38,0.1)',   text: '#b91c1c', border: 'rgba(220,38,38,0.3)' } },
  'PostgreSQL':     { dark: { bg: 'rgba(99,102,241,0.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.25)' }, light: { bg: 'rgba(99,102,241,0.1)',  text: '#4338ca', border: 'rgba(99,102,241,0.3)' } },
  'Terraform':      { dark: { bg: 'rgba(139,92,246,0.12)',  text: '#c4b5fd', border: 'rgba(139,92,246,0.25)' }, light: { bg: 'rgba(139,92,246,0.1)',  text: '#6d28d9', border: 'rgba(139,92,246,0.3)' } },
  'GitHub Actions': { dark: { bg: 'rgba(255,255,255,0.07)', text: '#d1d5db', border: 'rgba(255,255,255,0.12)' },light: { bg: 'rgba(17,15,9,0.05)',    text: '#374151', border: 'rgba(17,15,9,0.14)' } },
  'FastAPI':        { dark: { bg: 'rgba(6,182,212,0.12)',   text: '#67e8f9', border: 'rgba(6,182,212,0.25)' },  light: { bg: 'rgba(6,182,212,0.1)',   text: '#0e7490', border: 'rgba(6,182,212,0.3)' } },
  'Spring Boot':    { dark: { bg: 'rgba(34,197,94,0.12)',   text: '#86efac', border: 'rgba(34,197,94,0.25)' },  light: { bg: 'rgba(34,197,94,0.1)',   text: '#15803d', border: 'rgba(34,197,94,0.3)' } },
  'default':        { dark: { bg: 'rgba(206,254,8,0.08)',   text: '#cefe08', border: 'rgba(206,254,8,0.2)' },   light: { bg: 'rgba(92,122,0,0.08)',   text: '#5c7a00', border: 'rgba(92,122,0,0.25)' } },
};

export default function TechBadge({ tech }) {
  const theme = useThemeStore((s) => s.theme);
  const entry = COLORS[tech] || COLORS.default;
  const c = entry[theme] || entry.dark;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {tech}
    </span>
  );
}
