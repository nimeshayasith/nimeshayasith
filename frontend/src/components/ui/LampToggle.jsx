import { Lamp } from 'lucide-react';
import useLampStore from '../../store/lampStore';

/** Navbar button: lamp mode on (dark page, lantern cursor) or "lights on" (plain page, normal cursor). */
export default function LampToggle({ size = 38 }) {
  const on = useLampStore((s) => s.on);
  const toggle = useLampStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn the lights on (switch the lamp off)' : 'Switch the lamp back on'}
      title={on ? 'Lamp on · click for lights on' : 'Lights on · click to bring back the lamp'}
      style={{
        width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
        background: on ? 'var(--accent-glow)' : 'var(--bg-card)', border: `1px solid ${on ? 'var(--accent)' : 'var(--border-subtle)'}`,
        color: on ? 'var(--accent-ink)' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      }}
    >
      <Lamp style={{ width: 16, height: 16 }} fill={on ? 'currentColor' : 'none'} fillOpacity={0.25} />
    </button>
  );
}
