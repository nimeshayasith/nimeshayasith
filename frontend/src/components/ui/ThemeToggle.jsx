import { Sun, Moon } from 'lucide-react';
import useThemeStore from '../../store/themeStore';

export default function ThemeToggle({ size = 38 }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.color = 'var(--accent-ink)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {isDark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
    </button>
  );
}
