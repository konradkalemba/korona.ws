import firebase from 'firebase';
import { sum } from '../src/helpers/misc';

const {
  REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_AUTH_DOMAIN,
  REACT_APP_FIREBASE_DATABASE_URL,
  REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FIREBASE_STORAGE_BUCKET,
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_FIREBASE_APP_ID,
  REACT_APP_FIREBASE_MEASUREMENT_ID,
  API_KEY
} = process.env;

export default function handle(request, response) {
  const { query } = request;

  if (!query.key || query.key !== API_KEY) {
    response
      .status(401)
      .send({
        error: 'wrong_api_key'
      });
  } else {
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

    const rootDatabaseRef = firebase.database().ref('/');

    rootDatabaseRef.once('value').then(snapshot => {
      let { deaths, cases, cures, updatedAt } = snapshot.val();

      deaths = sum(deaths);
      cases = sum(cases);
      cures = sum(cures);

      response.send({
        deaths,
        cases,
        cures,
        updatedAt
      });
    });
  }
}
