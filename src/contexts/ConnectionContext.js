import React, { createContext, useContext, useState, useEffect } from 'react';

export const ConnectionContext = createContext();

export function ConnectionProvider(props) {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine || false);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);

    window.ononline = () => setIsOnline(true);
    window.onoffline = () => setIsOnline(false);
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
      }}
      {...props}
    />
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
