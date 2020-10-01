import React, { createContext, useContext, useState, useEffect } from 'react';

import { useConnection } from './ConnectionContext';

const DataContext = createContext();

export function DataProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [clickedVoivodeship, setClickedVoivodeship] = useState(null);

  const { isOnline } = useConnection();

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem('data'));

    // Set cached data (if available) if no Internet access
    if (!isOnline && cachedData) {
      setData(cachedData);
      setIsLoading(false);

      return false;
    }

    async function fetchData() {
      const response = await fetch(process.env.REACT_APP_DATA_ENDPOINT);

      const fetchedData = await response.json();

      setData(fetchedData);
      setIsLoading(false);
    }

    fetchData();
  }, []); // eslint-disable-line

  useEffect(() => {
    data && localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        isLoading,
        ...data,
        clickedVoivodeship,
        setClickedVoivodeship,
      }}
      {...props}
    />
  );
}

export function useData() {
  return useContext(DataContext);
}
