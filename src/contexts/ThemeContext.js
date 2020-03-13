import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [useDarkTheme, setUseDarkTheme] = useState(localStorage.getItem('useDarkTheme') === 'true' || false);

  useEffect(() => {
    if (localStorage.getItem('useDarkTheme') === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setUseDarkTheme(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('useDarkTheme', useDarkTheme);
  }, [useDarkTheme]);

  return (
    <ThemeContext.Provider
      value={{
        useDarkTheme,
        setUseDarkTheme
      }}
      {...props}
    />
  )
}

export function useTheme() {
  return useContext(ThemeContext);
}
