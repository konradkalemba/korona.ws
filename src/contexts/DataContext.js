import React, { createContext, useContext, useState, useEffect } from 'react';

import { firebase } from '../helpers/firebase';
import { useConnection } from './ConnectionContext';

const updatedAtDatabaseRef = firebase.database().ref('/updatedAt');
const rootDatabaseRef = firebase.database().ref('/');

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

    // Listen to `updatedAt` property changes
    updatedAtDatabaseRef.on('value', (snapshot) => {
      // Check if cached data is valid
      if (cachedData && cachedData.updatedAt === snapshot.val()) {
        setData(cachedData);
        setIsLoading(false);
      } else {
        rootDatabaseRef.on('value', (snapshot) => {
          // Update cache
          localStorage.setItem('data', JSON.stringify(snapshot.val()));

          setData(snapshot.val());
          setIsLoading(false);
        });

        // Disable listening to `updatedAt` changes since we are now listening to the root object changes
        updatedAtDatabaseRef.off('value');
      }
    });
  }, []);

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
