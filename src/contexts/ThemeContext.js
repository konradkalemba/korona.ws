import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase';

export const ThemeContext = createContext();

export function ThemeProvider(props) {
  const [useDarkTheme, setUseDarkTheme] = useState(
    localStorage.getItem('useDarkTheme') === 'true' || false
  );

  useEffect(() => {
    if (
      localStorage.getItem('useDarkTheme') === null &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setUseDarkTheme(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('useDarkTheme', useDarkTheme);
    firebase
      .analytics()
      .setUserProperties({ appTheme: useDarkTheme ? 'dark' : 'light' });
    document
      .getElementById('manifest')
      .setAttribute(
        'href',
        `/manifest.${useDarkTheme ? 'dark' : 'light'}.json`
      );
  }, [useDarkTheme]);

  return (
    <ThemeContext.Provider
      value={{
        useDarkTheme,
        setUseDarkTheme,
      }}
      {...props}
    />
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
