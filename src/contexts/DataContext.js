import React, { createContext, useContext, useState, useEffect } from 'react';

import { connect, db } from '../helpers/stitch';
import { useConnection } from './ConnectionContext';

const COLLECTIONS = [
  'voivodeships',
  'cases',
  'deaths',
  'cures',
  'hospitalizations',
  'quarantines',
  'supervisions',
  'tests',
];

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
      await connect();
      const fetchedData = {};

      async function registerCollection(collectionName) {
        const collection = db.collection(collectionName);

        fetchedData[collectionName] = await collection.find().toArray();

        // Set up a watcher
        const stream = await collection.watch();

        // Watch for the changes
        stream.onNext(async () => {
          fetchedData[collectionName] = await collection.find().toArray();

          setData({
            ...fetchedData,
          });
        });
      }

      await Promise.all(
        COLLECTIONS.map((collectionName) => registerCollection(collectionName))
      );

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
