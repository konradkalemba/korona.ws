import { firebase } from '../src/helpers/firebase';
import { sum } from '../src/helpers/misc';

const { API_KEY } = process.env;

const rootDatabaseRef = firebase.database().ref('/');

export default function handle(request, response) {
  const { query } = request;

  if (!query.key || query.key !== API_KEY) {
    response.status(401).send({
      error: 'wrong_api_key',
    });
  } else {
    rootDatabaseRef.once('value').then((snapshot) => {
      let { deaths, cases, cures, updatedAt } = snapshot.val();

      deaths = sum(deaths);
      cases = sum(cases);
      cures = sum(cures);

      response.send({
        deaths,
        cases,
        cures,
        updatedAt,
      });
    });
  }
}
