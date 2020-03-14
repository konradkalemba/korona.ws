import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import firebase from 'firebase';

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID
} = process.env;

firebase.initializeApp({
  ...(REACT_APP_FIREBASE_API_KEY && { apiKey: REACT_APP_FIREBASE_API_KEY }),
  ...(REACT_APP_FIREBASE_AUTH_DOMAIN && { authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN }),
  ...(REACT_APP_FIREBASE_DATABASE_URL && { databaseURL: REACT_APP_FIREBASE_DATABASE_URL }),
  ...(REACT_APP_FIREBASE_PROJECT_ID && { projectId: REACT_APP_FIREBASE_PROJECT_ID }),
  ...(REACT_APP_FIREBASE_STORAGE_BUCKET && { storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET }),
  ...(REACT_APP_FIREBASE_MESSAGING_SENDER_ID && { messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID }),
  ...(REACT_APP_FIREBASE_APP_ID && { appId: REACT_APP_FIREBASE_APP_ID }),
  ...(REACT_APP_FIREBASE_MEASUREMENT_ID && { measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID })
});

firebase.analytics();

const updatedAtDatabaseRef = firebase.database().ref('/updatedAt');
const rootDatabaseRef = firebase.database().ref('/');

const DataContext = createContext();

export function DataProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem('data'));

    // Listen to `updatedAt` property changes
    updatedAtDatabaseRef.on('value', snapshot => {
      // Check if cached data is valid
      if (cachedData && cachedData.updatedAt === snapshot.val()) {
        setData(cachedData);
        setIsLoading(false);
      } else {
        rootDatabaseRef.on('value', snapshot => {
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
        ...data
      }}
      {...props}
    />
  )
}

export function useData() {
  return useContext(DataContext);
}
