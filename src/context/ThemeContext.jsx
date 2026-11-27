import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

const STORAGE_KEY = 'nhg_portfolio_theme_v2';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  const sessionSaved = window.sessionStorage.getItem(STORAGE_KEY);
  if (sessionSaved === 'dark' || sessionSaved === 'light') {
    return sessionSaved;
  }
  const localSaved = window.localStorage.getItem(STORAGE_KEY);
  if (localSaved === 'dark' || localSaved === 'light') {
    return localSaved;
  }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.sessionStorage.setItem(STORAGE_KEY, theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
