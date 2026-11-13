/**
 * Custom hook for theme state, toggling, and document element synchronization.
 */
import { useState, useEffect, useRef } from 'react';

export function useTheme(initialTheme = 'dark', onThemeChange = null) {
  const [theme, setTheme] = useState(initialTheme);
  const onThemeChangeRef = useRef(onThemeChange);

  useEffect(() => {
    onThemeChangeRef.current = onThemeChange;
  }, [onThemeChange]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (onThemeChangeRef.current) {
      onThemeChangeRef.current(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, setTheme, toggleTheme };
}
