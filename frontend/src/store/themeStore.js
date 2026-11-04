import { create } from 'zustand';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') applyTheme(initialTheme);

const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));

export default useThemeStore;
