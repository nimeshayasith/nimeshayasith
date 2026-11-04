export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass ${className}`}
      style={{
        transition: hover ? 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease' : undefined,
        cursor: hover ? 'pointer' : undefined,
      }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.borderColor = 'var(--accent-glow)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px var(--shadow-ambient)';
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
