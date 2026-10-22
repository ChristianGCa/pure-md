import { useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

function getSystemDark() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem('markdown_theme') as Theme | null;
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          return saved;
        }
      } catch (error) {
        console.warn('Error reading theme preference:', error);
      }
    }
    return 'system';
  });

  const [systemDark, setSystemDark] = useState(getSystemDark);

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  const applyTheme = useCallback((dark: boolean) => {
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('markdown_theme', newTheme);
      } catch (error) {
        console.warn('Error saving theme preference:', error);
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Track the OS preference in state so isDark (and the toggle icon) stay in sync.
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
