/**
 * Tiny honest label that tells the visitor whether a block of content is
 * the bundled snapshot or has been refreshed live from the backend.
 */
export default function LiveBadge({ status, liveLabel = 'live from backend', staticLabel = 'bundled snapshot' }) {
  const map = {
    loading: { color: '#fbbf24', text: 'syncing with backend…', pulse: true },
    live: { color: '#4ade80', text: liveLabel, pulse: false },
    offline: { color: '#9ca3af', text: staticLabel, pulse: false },
  }[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-muted)',
        padding: '4px 11px',
        borderRadius: 30,
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: map.color,
          animation: map.pulse ? 'cpPulse 1.2s ease-in-out infinite' : 'none',
        }}
      />
      {map.text}
    </span>
  );
}
