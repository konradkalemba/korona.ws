import React, { createContext, useContext, useState } from 'react';
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

const DataContext = createContext();

export function DataProvider(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState(null);
  const [deaths, setDeaths] = useState(null);

  function fetch() {
    firebase.database().ref('/').once('value').then(snapshot => {
      setCases(snapshot.val().cases);
      setDeaths(snapshot.val().deaths);
      setIsLoading(false);
    });
  }

  if (!cases && !deaths && isLoading) {
    fetch();
  }

  return (
    <DataContext.Provider
      value={{
        isLoading,
        cases,
        deaths
      }}
      {...props}
    />
  )
}

export function useData() {
  return useContext(DataContext);
}
