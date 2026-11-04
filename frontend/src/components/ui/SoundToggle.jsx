import { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sfx } from '../../lib/sfx';

/** Speaker button: UI sounds are off until the visitor turns them on (here or on the entry screen). */
export default function SoundToggle({ size = 38 }) {
  const on = useSyncExternalStore(sfx.subscribe, () => sfx.enabled, () => false);

  return (
    <button
      type="button"
      onClick={() => sfx.toggle()}
      aria-pressed={on}
      aria-label={on ? 'Turn interface sounds off' : 'Turn interface sounds on'}
      title={on ? 'Sound on' : 'Sound off'}
      style={{
        width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
        background: on ? 'var(--accent-glow)' : 'var(--bg-card)', border: `1px solid ${on ? 'var(--accent)' : 'var(--border-subtle)'}`,
        color: on ? 'var(--accent-ink)' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      }}
    >
      {on ? <Volume2 style={{ width: 16, height: 16 }} /> : <VolumeX style={{ width: 16, height: 16 }} />}
    </button>
  );
}
